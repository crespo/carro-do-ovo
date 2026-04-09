# Projeto Carro do Ovo

## Objetivo
- Entregar um MVP explicavel para avaliacao academica.
- Priorizar navegacao, listagem com `FlatList`, visual consistente e uso de recursos nativos.

## Arquitetura
- Usar `expo-router` como unico sistema de navegacao.
- Organizar codigo em `src/models`, `src/services`, `src/context`, `src/view-models` e `src/components`.
- Tratar `src/services/mockBackend.ts` como camada backend-ready para login, catalogo e pedidos.

## Convencoes
- Manter visual retro com `Fredoka`, tons quentes e cards com bordas fortes.
- Evitar logica de negocio dentro das rotas; preferir hooks em `src/view-models`.
- Toda nova tela deve ficar em `app/` e consumir componentes e view-models de `src/`.
- Para listas grandes, continuar usando `FlatList`.

## Versionamento
- Branches de trabalho: `feature/*`, `fix/*`, `docs/*`.
- Commits sugeridos: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- Antes de finalizar mudancas, rodar `npm run typecheck` e `npm run lint`.
