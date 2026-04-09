import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
import { useState } from 'react';

export function useNativeResourcesViewModel() {
  const [networkSummary, setNetworkSummary] = useState(
    'Nenhuma leitura realizada ainda. Atualize para ver estado de conectividade e IP do dispositivo.',
  );
  const [networkLoading, setNetworkLoading] = useState(false);

  async function loadNetwork() {
    try {
      setNetworkLoading(true);
      const [networkState, ipAddress, airplaneMode] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync(),
        Network.isAirplaneModeEnabledAsync().catch(() => false),
      ]);

      setNetworkSummary(
        `Tipo: ${networkState.type ?? 'desconhecido'} - Conectado: ${networkState.isConnected ? 'sim' : 'nao'} - Internet: ${
          networkState.isInternetReachable ? 'ok' : 'indisponivel'
        } - IP: ${ipAddress} - Modo aviao: ${airplaneMode ? 'ligado' : 'desligado'}`,
      );
      await Haptics.selectionAsync();
    } catch {
      setNetworkSummary('Nao foi possivel ler os dados da rede neste dispositivo.');
    } finally {
      setNetworkLoading(false);
    }
  }

  return {
    networkSummary,
    networkLoading,
    loadNetwork,
  };
}
