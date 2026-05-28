# Carro do Ovo

Marketplace mobile que conecta produtores de ovos a compradores.

## Sobre

App em React Native (Expo) com dois perfis selecionados no cadastro:

- **buyer**: navega o catálogo de anúncios em tempo real, monta o carrinho, finaliza a compra e acompanha o histórico de pedidos.
- **producer**: gerencia os próprios anúncios e atualiza o status dos pedidos que recebeu.

Autenticação e dados ficam no Firebase (Auth + Firestore), com listeners em tempo real.

## Stack

- Expo SDK 54, React Native 0.81, TypeScript
- Expo Router + React Navigation native-stack
- Firebase Auth + Firestore (Web SDK v12)
- Estado em React Context + `useReducer`

## Setup

1. `npm install`
2. Copiar `.env.example` para `.env` e preencher com as credenciais do projeto Firebase (Console → ⚙️ Project settings → Your apps → SDK setup and configuration).
3. No Console do Firebase:
   - **Authentication** → habilitar provider **Email/Password**.
   - **Firestore Database** → criar database (modo de produção).
   - **Firestore → Rules** → colar o conteúdo de [`firestore.rules`](firestore.rules) e **Publish**.
4. `npx expo start` — abrir no Expo Go, emulador ou web.

Na primeira vez que um usuário abrir "Meus Pedidos" / "Pedidos Recebidos", o Firestore pode pedir a criação de um **índice composto** (`buyerId + createdAt desc` e `producerIds array-contains + createdAt desc`). O link de criação aparece no erro do console — clicar resolve.

## Scripts

- `npm run start` — Metro bundler
- `npm run android` / `npm run ios` / `npm run web` — abrir em cada plataforma
- `npm run lint` — ESLint (config do Expo)

## Estrutura

- `app/` — rotas (Expo Router). `app/index.tsx` decide entre stack de buyer e producer pelo `user.role`.
- `screens/` — telas do buyer (`LoginScreen`, `SignUpScreen`, `SelectEggsScreen`, `EggDetailScreen`, `CartScreen`, `CheckoutScreen`, `OrderConfirmationScreen`, `MyOrdersScreen`).
- `screens/producer/` — telas do producer (`ProducerDashboardScreen`, `CreateListingScreen`, `ReceivedOrdersScreen`).
- `components/` — UI reaproveitada (`Button`, `Card`, `FormInput`, `EggList/`, etc.).
- `context/` — `AuthContext`, `StoreContext`, `CartContext`, `OrdersContext` (lógica inline no Provider via `useReducer`, com listeners do Firestore vinculados ao usuário logado).
- `config/firebase.ts` — init do Firebase app, Auth (persistência em AsyncStorage) e Firestore.
- `constants/`, `models/` — temas, tipos compartilhados.
- `firestore.rules` — source of truth das regras do Firestore (colar no console).

## Coleções no Firestore

### `users/{uid}`

```
{ name, role: 'buyer' | 'producer', email, createdAt }
```

### `listings/{id}`

```
{ name, price, quantity, category, description, imageUrl, vendor,
  vendorRating, producerId, createdAt }
```

### `orders/{id}`

```
{
  buyerId, buyerName,
  items: [{ eggId, name, price, quantity, vendor, producerId, imageUrl }],
  producerIds: string[],         // denormalizado para queries array-contains
  total,
  address: { street, number, neighborhood, city },
  paymentMethod: 'card' | 'pix' | 'boleto',
  status: 'received' | 'preparing' | 'shipped' | 'delivered',
  createdAt: number
}
```

## Fluxos

**Buyer:** login → catálogo (tempo real) → detalhe → adicionar ao carrinho → checkout (endereço + pagamento) → confirmação → "Meus Pedidos" (status acompanhado em tempo real).

**Producer:** login → dashboard com seus anúncios → criar / editar / excluir → "Pedidos Recebidos" (apenas itens dos seus anúncios) → avançar status (`received` → `preparing` → `shipped` → `delivered`).
