import { useApp } from '@/src/context/AppContext';
import { Order } from '@/src/models/order';
import { formatCurrency } from '@/src/utils/currency';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';

function buildAddressLabel(address: Location.LocationGeocodedAddress | null) {
  if (!address) {
    return '';
  }

  const firstLine = [address.street, address.streetNumber].filter(Boolean).join(', ');
  const secondLine = [address.district, address.city, address.region].filter(Boolean).join(' - ');

  return [firstLine, secondLine].filter(Boolean).join(' | ');
}

export function useCheckoutViewModel() {
  const { cart, updateCartQuantity, submitOrder, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.defaultAddress ?? '');
  const [contactPhone, setContactPhone] = useState(user?.phone ?? '');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    setDeliveryAddress(user?.defaultAddress ?? '');
    setContactPhone(user?.phone ?? '');
  }, [user?.defaultAddress, user?.phone]);

  const subtotal = cart.reduce((sum, item) => sum + item.egg.price * item.quantity, 0);
  const delivery = subtotal >= 60 || !cart.length ? 0 : 6;
  const total = subtotal + delivery;

  function changeQuantity(eggId: string, quantity: number) {
    updateCartQuantity(eggId, quantity);
  }

  async function fillAddressFromLocation() {
    try {
      setAddressLoading(true);
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setFeedback('Nao conseguimos usar sua localizacao. Digite o endereco manualmente.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const formattedAddress = buildAddressLabel(address);

      if (!formattedAddress) {
        setFeedback('Nao encontramos seu endereco completo. Ajuste os dados manualmente.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      setDeliveryAddress(formattedAddress);
      setFeedback('Endereco preenchido automaticamente.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setFeedback('Nao foi possivel buscar seu endereco agora.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAddressLoading(false);
    }
  }

  async function confirmOrder() {
    try {
      setLoading(true);
      const order = await submitOrder({
        deliveryAddress,
        contactPhone,
      });
      setLastOrder(order);
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
    addressLoading,
    feedback,
    deliveryAddress,
    contactPhone,
    lastOrder,
    subtotalLabel: formatCurrency(subtotal),
    deliveryLabel: delivery === 0 ? 'Gratis' : formatCurrency(delivery),
    totalLabel: formatCurrency(total),
    changeQuantity,
    setDeliveryAddress,
    setContactPhone,
    fillAddressFromLocation,
    submitOrder: confirmOrder,
    openHistory: () => router.push('/profile' as Href),
    goBack: () => router.back(),
  };
}
