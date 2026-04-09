# Roteiro de Apresentacao

## Ordem sugerida

1. Abra a tela de login.
2. Entre no aplicativo com um email qualquer.
3. Mostre o catalogo com os cards e diga que a listagem usa `FlatList`.
4. Pesquise um item e troque de categoria.
5. Abra o detalhe de um produto.
6. Adicione o item ao carrinho e finalize um pedido.
7. Abra a aba de perfil e mostre o resumo do MVP.
8. Abra a aba de recursos nativos e demonstre camera, GPS e rede.

## Fala curta para o video

Este projeto foi desenvolvido como um MVP mobile em Expo para simular um aplicativo de venda de bandejas de ovos. Eu organizei a aplicacao com navegacao usando expo-router, separei a interface dos modelos e da logica em uma estrutura inspirada em MVVM, e implementei as principais telas do fluxo.

No catalogo eu utilizo `FlatList` para listagem otimizada dos produtos. O usuario pode pesquisar, filtrar por categoria, abrir os detalhes de cada item e adicionar produtos ao carrinho. Depois disso, ele pode revisar o pedido e concluir a compra.

Na aba de perfil eu concentrei um resumo da conta e dos pedidos feitos durante a demonstracao. Ja na aba de recursos nativos, eu demonstro leitura de localizacao, captura com camera e diagnostico de rede do dispositivo, atendendo ao requisito de uso de recursos nativos.

O projeto tambem possui uma camada de servicos chamada `mockBackend`, que simula autenticacao, carregamento de catalogo e criacao de pedidos. Isso deixa a arquitetura preparada para uma futura integracao com back-end real sem comprometer o MVP.

## Como explicar o codigo

- `app/`: define as rotas e a navegacao do app
- `src/components/`: componentes visuais reutilizaveis
- `src/view-models/`: regras de cada tela
- `src/context/`: estado global do app
- `src/services/mockBackend.ts`: simulacao de backend
- `src/models/`: entidades tipadas do sistema

## Perguntas provaveis

### Qual arquitetura voce usou?

Usei uma separacao por rotas, componentes, modelos, servicos e view-models. A ideia foi tirar a logica pesada das telas e deixar a manutencao mais organizada.

### Onde esta o backend?

Nesta fase eu usei um backend simulado local, porque o foco da avaliacao era concluir as funcionalidades do aplicativo. Mesmo assim, deixei uma camada de servicos separada para facilitar integracao futura.

### Onde esta a listagem otimizada?

No catalogo, usando `FlatList`, com layout responsivo por quantidade de colunas conforme a largura da tela.

### Onde estao os recursos nativos?

Na aba `Recursos`, com camera, GPS e leitura de rede.
