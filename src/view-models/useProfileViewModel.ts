import { useApp } from '@/src/context/AppContext';
import { formatCurrency } from '@/src/utils/currency';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

export function useProfileViewModel() {
  const { user, orders, logout, updateUserProfile } = useApp();
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUri ?? null);
  const [loading, setLoading] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setPhone(user?.phone ?? '');
    setAvatarUri(user?.avatarUri ?? null);
  }, [user?.phone, user?.avatarUri]);

  async function requestCameraAccess() {
    await requestCameraPermission();
  }

  async function capturePhoto() {
    try {
      setCameraBusy(true);

      if (!cameraPermission?.granted || !cameraRef.current) {
        setFeedback('Permita o acesso a camera para atualizar sua foto.');
        return;
      }

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      setAvatarUri(result.uri);
      setFeedback('Foto atualizada. Toque em salvar para confirmar.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setFeedback('Nao foi possivel tirar a foto agora.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setCameraBusy(false);
    }
  }

  async function saveProfile() {
    try {
      if (!user) {
        return;
      }

      setLoading(true);
      await updateUserProfile({
        phone,
        avatarUri,
        defaultAddress: user.defaultAddress,
      });
      setFeedback('Perfil atualizado com sucesso.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel salvar o perfil.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  return {
    userName: user ? `${user.firstName} ${user.lastName}` : 'Cliente',
    email: user?.email ?? 'Sem email cadastrado',
    phone,
    avatarUri,
    defaultAddress: user?.defaultAddress ?? 'Sem endereco cadastrado',
    feedback,
    loading,
    cameraBusy,
    canUseCamera: cameraPermission?.granted ?? false,
    cameraPermissionLabel: cameraPermission?.granted ? 'concedida' : 'pendente',
    cameraRef,
    setPhone,
    saveProfile,
    requestCameraAccess,
    capturePhoto,
    orderHistory: orders.map((order) => ({
      id: order.id,
      code: order.code,
      totalLabel: formatCurrency(order.total),
      createdAtLabel: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(order.createdAt)),
      address: order.deliveryAddress,
      phone: order.contactPhone,
      itemsLabel: order.items.map((item) => `${item.quantity}x ${item.egg.name}`).join(', '),
    })),
    logout: () => {
      logout();
      router.replace('/login' as Href);
    },
  };
}
