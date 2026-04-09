import { useApp } from '@/src/context/AppContext';
import { Egg } from '@/src/models/egg';
import { formatCurrency } from '@/src/utils/currency';
import * as Haptics from 'expo-haptics';
import { Href, router } from 'expo-router';
import { startTransition, useDeferredValue, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export function useCatalogViewModel() {
  const { user, eggs, cart, addToCart } = useApp();
  const { width } = useWindowDimensions();
  const [search, setSearchState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const deferredSearch = useDeferredValue(search);

  const categories = ['Todos', 'Caipira', 'Premium', 'Organico', 'Branco'];
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredEggs = eggs.filter((egg) => {
    const categoryMatches = selectedCategory === 'Todos' || egg.category === selectedCategory;
    const searchMatches =
      !normalizedSearch ||
      egg.name.toLowerCase().includes(normalizedSearch) ||
      egg.vendor.toLowerCase().includes(normalizedSearch) ||
      egg.category.toLowerCase().includes(normalizedSearch);

    return categoryMatches && searchMatches;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.egg.price * item.quantity, 0);
  const columns = width >= 860 ? 3 : width >= 540 ? 2 : 1;

  function setSearch(value: string) {
    startTransition(() => {
      setSearchState(value);
    });
  }

  function setCategory(value: string) {
    setSelectedCategory(value);
  }

  function openEgg(id: string) {
    router.push({ pathname: '/egg/[id]', params: { id } } as unknown as Href);
  }

  function goToCheckout() {
    router.push('/checkout' as Href);
  }

  async function addEgg(egg: Egg) {
    addToCart(egg, 1);
    await Haptics.selectionAsync();
  }

  return {
    userName: user?.firstName ?? 'Aluno',
    cartCount,
    totalLabel: formatCurrency(cartTotal),
    search,
    categories,
    selectedCategory,
    filteredEggs,
    columns,
    setSearch,
    setCategory,
    openEgg,
    goToCheckout,
    addEgg,
  };
}
