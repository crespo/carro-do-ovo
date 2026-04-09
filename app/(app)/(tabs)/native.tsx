import { CameraCard } from '@/src/components/native/CameraCard';
import { NativeFeatureCard } from '@/src/components/native/NativeFeatureCard';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useNativeResourcesViewModel } from '@/src/view-models/useNativeResourcesViewModel';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NativeRoute() {
  const viewModel = useNativeResourcesViewModel();

  return (
    <Screen contentContainerStyle={styles.content}>
      <PageHeader
        title="Recursos nativos"
        subtitle="Camera, GPS e rede implementados com APIs reais do Expo para atender a exigencia da disciplina."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <NativeFeatureCard
          title="GPS"
          description="Captura latitude, longitude e endereco aproximado do ponto atual."
          actionLabel={viewModel.locationLoading ? 'Buscando localizacao...' : 'Ler localizacao'}
          onAction={viewModel.loadLocation}
          disabled={viewModel.locationLoading}
          tone="warm"
        >
          <View style={styles.detailBlock}>
            <Text style={styles.detailText}>{viewModel.locationSummary}</Text>
          </View>
        </NativeFeatureCard>

        <CameraCard
          permissionLabel={viewModel.cameraPermissionLabel}
          captureLabel={viewModel.cameraBusy ? 'Capturando...' : 'Capturar foto'}
          canCapture={viewModel.canUseCamera}
          isBusy={viewModel.cameraBusy}
          photoUri={viewModel.photoUri}
          cameraRef={viewModel.cameraRef}
          onRequestPermission={viewModel.requestCameraAccess}
          onCapture={viewModel.capturePhoto}
        />

        <NativeFeatureCard
          title="Rede do aparelho"
          description="Leitura do estado de conexao, tipo de rede, IP e modo aviao."
          actionLabel={viewModel.networkLoading ? 'Atualizando rede...' : 'Atualizar diagnostico'}
          onAction={viewModel.loadNetwork}
          disabled={viewModel.networkLoading}
        >
          <View style={styles.detailBlock}>
            <Text style={styles.detailText}>{viewModel.networkSummary}</Text>
          </View>
        </NativeFeatureCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  detailBlock: {
    gap: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.cream,
    borderWidth: 2,
    borderColor: palette.borderSoft,
  },
  detailText: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary800,
    lineHeight: 20,
  },
});
