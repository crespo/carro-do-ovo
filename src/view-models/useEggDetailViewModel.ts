import { useApp } from '@/src/context/AppContext';
import * as Haptics from 'expo-haptics';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { formatCurrency } from '@/src/utils/currency';

export function useEggDetailViewModel() {
  const params = useLocalSearchParams<{ id: string }>();
  const { eggs, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const egg = eggs.find((item) => item.id === params.id);

  async function addCurrentEggToCart() {
    if (!egg) {
      return;
    }

    addToCart(egg, quantity);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/checkout' as Href);
  }

  return {
    egg,
    quantity,
    setQuantity,
    priceLabel: egg ? formatCurrency(egg.price) : formatCurrency(0),
    addToCart: addCurrentEggToCart,
    goBack: () => router.back(),
  };
}
