# Carro do Ovo

Aplicativo mobile em Expo criado como MVP de disciplina, focado em venda de bandejas de ovos com navegacao completa, listagem otimizada, visual retro e demonstracao de recursos nativos.

## Requisitos

- Node.js 20+
- npm 10+
- Expo Go no celular para testar recursos nativos
- Opcional: Docker Desktop para subir a versao web e rodar checks automatizados

## Como subir localmente

1. Instale as dependencias:

```bash
npm install
```

2. Rode o projeto:

```bash
npm run start
```

3. Escolha uma das opcoes do Expo:

- `a` para Android
- `w` para Web
- QR Code para abrir no Expo Go

## Como subir para testes nativos

O app usa camera, localizacao e rede. Para validar isso de verdade, prefira rodar no celular com Expo Go.

Fluxo recomendado:

1. Execute `npm run start`
2. Escaneie o QR Code com o Expo Go
3. Abra a aba `Recursos`
4. Teste GPS, camera e rede no aparelho

## Como subir com Docker

Docker aqui foi configurado para ajudar em dois cenarios:

- subir a versao web rapidamente
- rodar verificacoes automatizadas de qualidade

Observacao importante:

- recursos nativos como camera e GPS nao sao o fluxo ideal dentro do Docker
- para a apresentacao da disciplina, use o celular com Expo Go para demonstrar esses pontos

### 1. Subir a versao web com Docker

```bash
docker compose up carro-do-ovo-web --build
```

Depois acesse:

- [http://localhost:8081](http://localhost:8081)

### 2. Rodar checks automatizados com Docker

```bash
docker compose run --rm carro-do-ovo-checks
```

Esse comando executa:

- typecheck
- lint

## Scripts principais

- `npm run start`: inicia o projeto Expo
- `npm run web`: inicia no navegador
- `npm run docker:web`: inicia a versao web escutando na porta `8081`
- `npm run typecheck`: valida TypeScript
- `npm run lint`: valida ESLint
- `npm run check`: roda typecheck + lint

## Estrutura do projeto

- `app/`: rotas com `expo-router`
- `src/components/`: UI e componentes de dominio
- `src/context/`: estado global do aplicativo
- `src/view-models/`: logica das telas
- `src/services/`: camada de servicos/backend local
- `src/models/`: tipos e entidades

## Padrao de versionamento

- Branches: `feature/*`, `fix/*`, `docs/*`
- Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

## Entrega e demonstracao

Para apresentar com seguranca:

1. Mostre login e cadastro
2. Mostre o catalogo com `FlatList`
3. Abra um item e finalize um pedido
4. Mostre a aba `Recursos`
5. Explique que existe uma camada `mockBackend` para simular backend sem depender de API externa

## Arquivos de automacao

- [Dockerfile](C:/Users/crespo/Documents/code/expo/carro-do-ovo/Dockerfile)
- [docker-compose.yml](C:/Users/crespo/Documents/code/expo/carro-do-ovo/docker-compose.yml)
- [.dockerignore](C:/Users/crespo/Documents/code/expo/carro-do-ovo/.dockerignore)
