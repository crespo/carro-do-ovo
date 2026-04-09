import { useApp } from '@/src/context/AppContext';
import { formatCurrency } from '@/src/utils/currency';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';

export function useCheckoutViewModel() {
  const { cart, updateCartQuantity, submitOrder } = useApp();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.egg.price * item.quantity, 0);
  const delivery = subtotal >= 60 || !cart.length ? 0 : 6;
  const total = subtotal + delivery;

  function changeQuantity(eggId: string, quantity: number) {
    updateCartQuantity(eggId, quantity);
  }

  async function confirmOrder() {
    try {
      setLoading(true);
      const order = await submitOrder();
      setFeedback(`Pedido ${order.code} confirmado com sucesso.`);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel concluir o pedido.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  return {
    items: cart,
    loading,
    feedback,
    subtotalLabel: formatCurrency(subtotal),
    deliveryLabel: delivery === 0 ? 'Gratis' : formatCurrency(delivery),
    totalLabel: formatCurrency(total),
    changeQuantity,
    submitOrder: confirmOrder,
    goBack: () => router.back(),
  };
}
