import { useApp } from '@/src/context/AppContext';
import { formatCurrency } from '@/src/utils/currency';
import { Href, router } from 'expo-router';

export function useProfileViewModel() {
  const { user, orders, logout } = useApp();

  return {
    userName: user ? `${user.firstName} ${user.lastName}` : 'Aluno Expo',
    email: user?.email ?? 'sem email',
    phone: user?.phone ?? 'sem telefone',
    highlights: [
      'Navegacao com expo-router e separacao por grupos de rotas.',
      'Listagem otimizada com FlatList e layout responsivo por largura.',
      'Camada de servicos local simulando um backend para login, catalogo e pedidos.',
      'Recursos nativos com camera, localizacao e informacoes de rede.',
    ],
    orderSummaries: orders.map((order) => ({
      id: order.id,
      code: order.code,
      description: `${order.items.length} itens · ${formatCurrency(order.total)}`,
    })),
    logout: () => {
      logout();
      router.replace('/login' as Href);
    },
  };
}
