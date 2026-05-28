# Arquitetura — Carro do Ovo

Documento técnico do fluxo do app. Foca em **como autenticação e comunicação com o Firebase estão integradas**, sem descer ao detalhe de cada componente.

---

## Visão geral

O app é uma SPA em Expo Router que usa um único stack de navegação ([app/_layout.tsx](app/_layout.tsx) define o root, [app/index.tsx](app/index.tsx) monta os providers e o `AppNavigator`).

A árvore de providers é:

```
AuthProvider → StoreProvider → OrdersProvider → CartProvider → AppNavigator
```

Essa ordem é importante: `Store` e `Orders` dependem do `user` exposto pelo `Auth` para abrir/fechar listeners do Firestore. `Cart` é puramente local e fica por último.

A navegação é **condicional ao estado de auth**: `AppNavigator` em [app/index.tsx:74](app/index.tsx) lê `user` e `isInitializing` do `AuthContext` e:

- se `isInitializing` → spinner de splash
- se `user == null` → stack de Login/SignUp
- se `user.role === 'producer'` → stack do produtor
- caso contrário → stack do comprador

Não existe roteamento por URL nem guards explícitos — o stack inteiro é trocado quando o `user` muda.

---

## Inicialização do Firebase

[config/firebase.ts](config/firebase.ts) é o **único ponto** que instancia o SDK. Lê as variáveis `EXPO_PUBLIC_FIREBASE_*` do `.env`, chama `initializeApp` (com guarda para hot reload), e exporta:

- `auth` — inicializado com `initializeAuth` + `getReactNativePersistence(AsyncStorage)`. Isso é o que permite a sessão sobreviver ao fechamento do app.
- `db` — `getFirestore(app)` reutilizado por todos os contexts.

Qualquer outro módulo importa `auth` ou `db` daqui; não há cliente paralelo.

---

## Fluxo de autenticação

### Onde mora

Todo o estado e as ações ficam em [context/AuthContext.tsx](context/AuthContext.tsx). É um `useReducer` com quatro ações (`AUTH_INIT_DONE`, `AUTH_START`, `AUTH_SUCCESS`, `AUTH_ERROR`, `AUTH_LOGOUT`) e expõe `{ user, isInitializing, isLoading, error, login, signup, logout }` via `useAuth()`.

### Restauração de sessão

No mount, [AuthContext.tsx:119](context/AuthContext.tsx#L119) registra `onAuthStateChanged`. Esse listener:

1. dispara assim que o SDK termina de ler a credencial persistida do `AsyncStorage`;
2. se houver `FirebaseUser`, busca o perfil em `users/{uid}` no Firestore (`loadUserProfile`) para resolver `name` e `role`;
3. dispatcha `AUTH_INIT_DONE` (com `User` ou `null`), o que tira `isInitializing` e libera o `AppNavigator` para escolher o stack.

O Firebase Auth não guarda `role` — por isso a leitura extra em `users/{uid}` é obrigatória em todo cold start.

### Login

[LoginScreen.tsx](screens/LoginScreen.tsx) valida o form e chama `login(email, password)`:

1. `signInWithEmailAndPassword` (Firebase Auth)
2. `loadUserProfile` (Firestore) — se o doc não existe, faz `signOut` e mostra erro
3. `AUTH_SUCCESS` → o `AppNavigator` re-renderiza no stack certo

Os erros do SDK são traduzidos em PT-BR por `describeAuthError` ([AuthContext.tsx:55](context/AuthContext.tsx#L55)).

### Signup

[SignUpScreen.tsx](screens/SignUpScreen.tsx) coleta nome, sobrenome, email, senha e `role` ('buyer' | 'producer'). O fluxo é:

1. `createUserWithEmailAndPassword` (Auth) — cria a credencial
2. `setDoc(users/{uid}, { name, role, email, createdAt })` (Firestore) — cria o perfil
3. `AUTH_SUCCESS` direto, sem precisar refazer o `loadUserProfile`

Cadastro e perfil são **duas escritas separadas**, não uma transação. Em teoria, falha entre os passos 1 e 2 deixaria um usuário Auth sem perfil — o `login` lida com esse caso forçando logout.

### Logout

[AuthContext.tsx:179](context/AuthContext.tsx#L179) faz `dispatch(AUTH_LOGOUT)` **antes** de `signOut`. A ordem é deliberada: zerar o `user` desmonta os listeners de `StoreContext`/`OrdersContext` antes do token sumir, evitando `permission-denied` transitório das queries ativas.

### Persistência

A persistência é totalmente delegada ao Firebase Web SDK + `AsyncStorage` (configurada em [config/firebase.ts:27](config/firebase.ts#L27)). Não há nada no app que leia ou escreva sessão diretamente.

---

## Comunicação com Firestore (CRUDs)

A regra é: **nenhuma tela fala com o Firestore diretamente**. Toda I/O passa pelos contexts, que padronizam:

- listener em tempo real montado no Provider (`onSnapshot`)
- write helpers (`addDoc`, `updateDoc`, `deleteDoc`) expostos pelo `value`
- tradução de erros via `describeFirestoreError` para PT-BR

### `listings` — [context/StoreContext.tsx](context/StoreContext.tsx)

Catálogo único compartilhado por buyer e producer.

- **Read:** `onSnapshot(collection(db, 'listings'))` ([StoreContext.tsx:99](context/StoreContext.tsx#L99)). Listener só é aberto se `user` existir (rules exigem auth); fechado no logout via cleanup do `useEffect`.
- **Create:** `addListing(producerId, vendorName, data)` — `addDoc` em `listings` com `producerId`, `vendor`, `createdAt`.
- **Update:** `updateListing(id, data)` — `updateDoc` no doc.
- **Delete:** `deleteListing(id)` — `deleteDoc` no doc.
- **Derivação:** `getProducerListings(producerId)` filtra o array em memória (não dispara nova query). Usado pela dashboard do produtor.

Quem consome: [SelectEggsScreen](screens/SelectEggsScreen.tsx) (buyer lista tudo), [EggDetailScreen](screens/EggDetailScreen.tsx), [ProducerDashboardScreen](screens/producer/ProducerDashboardScreen.tsx) (filtra pelo `producerId`), [CreateListingScreen](screens/producer/CreateListingScreen.tsx) (create/update/delete).

### `orders` — [context/OrdersContext.tsx](context/OrdersContext.tsx)

Pedidos, com listener **filtrado pelo usuário logado**.

- **Read:** [OrdersContext.tsx:122](context/OrdersContext.tsx#L122) monta a query escolhendo o filtro pelo `role`:
  - buyer → `where('buyerId', '==', user.id)`
  - producer → `where('producerIds', 'array-contains', user.id)`
  - sempre com `orderBy('createdAt', 'desc')`
  - O `producerIds` é um campo denormalizado (array dos producers únicos dos `items`) justamente para esse `array-contains` funcionar em uma única query. Sem ele, o producer precisaria varrer `items[].producerId`, o que o Firestore não suporta.
- **Create:** `createOrder(payload)` — calcula `producerIds` a partir dos `items`, escreve com `status: 'received'`, retorna o `id`. Chamado pelo [CheckoutScreen](screens/CheckoutScreen.tsx).
- **Update:** `updateOrderStatus(id, status)` — só altera `status`. Chamado pelo [ReceivedOrdersScreen](screens/producer/ReceivedOrdersScreen.tsx) para avançar `received → preparing → shipped → delivered`. As rules limitam essa escrita ao campo `status`.
- **Delete:** proibido pelas rules.

Quem consome: [MyOrdersScreen](screens/MyOrdersScreen.tsx) (buyer), [ReceivedOrdersScreen](screens/producer/ReceivedOrdersScreen.tsx) (producer), [OrderConfirmationScreen](screens/OrderConfirmationScreen.tsx).

> Na primeira execução, o Firestore exige índices compostos (`buyerId + createdAt desc` e `producerIds array-contains + createdAt desc`). O link de criação aparece no console quando a query falha.

### `users` — somente [context/AuthContext.tsx](context/AuthContext.tsx)

`users/{uid}` só é tocado por dois pontos: `signup` (cria) e `loadUserProfile` (lê no login/restore). Nenhuma tela acessa diretamente.

### `CartContext` — sem Firebase

[context/CartContext.tsx](context/CartContext.tsx) é estado **puramente em memória**. Não persiste, não bate em Firestore. Existe pra UX do buyer entre catálogo e checkout. Some no logout/reload.

---

## Segurança — [firestore.rules](firestore.rules)

As rules são versionadas no repo e refletem exatamente o contrato dos contexts:

- `users/{uid}` — leitura e escrita só pelo próprio dono (`request.auth.uid == uid`).
- `listings/{id}` — qualquer autenticado lê; só o `producerId` cria/edita/deleta.
- `orders/{id}` —
  - leitura: o `buyerId` ou qualquer um em `producerIds`
  - create: só com `buyerId == request.auth.uid`
  - update: só por producer envolvido, e **só pode mudar o campo `status`** (usa `diff().affectedKeys().hasOnly(['status'])`)
  - delete: bloqueado

A consequência prática: a denormalização do `producerIds` no `orders` cumpre duplo papel — habilita a query do producer e serve de check de permissão.

---

## Resumo do ciclo de uma ação típica

**Buyer finaliza compra:**

1. `CheckoutScreen` chama `useOrders().createOrder(payload)`
2. `OrdersContext` faz `addDoc('orders', { buyerId, producerIds, items, ... })`
3. Rules validam `buyerId == auth.uid`
4. O `onSnapshot` do mesmo buyer (filtro `buyerId ==`) recebe o novo doc → `MyOrdersScreen` atualiza
5. O `onSnapshot` de cada producer envolvido (filtro `producerIds array-contains`) também recebe → `ReceivedOrdersScreen` aparece sem reload

Nenhum estado é propagado manualmente entre as telas — o Firestore é a fonte de verdade, e os listeners por usuário são o canal de sincronização.
