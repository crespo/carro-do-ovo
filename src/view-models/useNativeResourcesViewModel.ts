import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { useRef, useState } from 'react';

export function useNativeResourcesViewModel() {
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationSummary, setLocationSummary] = useState(
    'Nenhuma leitura realizada ainda. Toque no botao para pedir permissao e capturar o ponto atual.',
  );
  const [networkSummary, setNetworkSummary] = useState(
    'Nenhuma leitura realizada ainda. Atualize para ver estado de conectividade e IP do dispositivo.',
  );
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);

  async function loadLocation() {
    try {
      setLocationLoading(true);
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setLocationSummary('Permissao negada para acessar GPS.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const address = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const firstAddress = address[0];

      setLocationSummary(
        `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}${
          firstAddress
            ? ` · ${firstAddress.street ?? 'Rua sem nome'}, ${firstAddress.city ?? 'Cidade'}`
            : ''
        }`,
      );
      await Haptics.selectionAsync();
    } catch {
      setLocationSummary('Nao foi possivel ler a localizacao neste dispositivo.');
    } finally {
      setLocationLoading(false);
    }
  }

  async function loadNetwork() {
    try {
      setNetworkLoading(true);
      const [networkState, ipAddress, airplaneMode] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync(),
        Network.isAirplaneModeEnabledAsync().catch(() => false),
      ]);

      setNetworkSummary(
        `Tipo: ${networkState.type ?? 'desconhecido'} · Conectado: ${networkState.isConnected ? 'sim' : 'nao'} · Internet: ${
          networkState.isInternetReachable ? 'ok' : 'indisponivel'
        } · IP: ${ipAddress} · Modo aviao: ${airplaneMode ? 'ligado' : 'desligado'}`,
      );
    } catch {
      setNetworkSummary('Nao foi possivel ler os dados da rede neste dispositivo.');
    } finally {
      setNetworkLoading(false);
    }
  }

  async function requestCameraAccess() {
    await requestCameraPermission();
  }

  async function capturePhoto() {
    try {
      setCameraBusy(true);

      if (!cameraPermission?.granted || !cameraRef.current) {
        return;
      }

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      setPhotoUri(result.uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setCameraBusy(false);
    }
  }

  return {
    locationSummary,
    networkSummary,
    photoUri,
    locationLoading,
    networkLoading,
    cameraBusy,
    canUseCamera: cameraPermission?.granted ?? false,
    cameraPermissionLabel: cameraPermission?.granted ? 'concedida' : 'pendente',
    cameraRef,
    loadLocation,
    loadNetwork,
    requestCameraAccess,
    capturePhoto,
  };
}
