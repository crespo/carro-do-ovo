import { NativeFeatureCard } from '@/src/components/native/NativeFeatureCard';
import { AppCard } from '@/src/components/ui/AppCard';
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
        title="Conexao"
        subtitle="Confira o status da sua conexao para evitar problemas no envio do pedido."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.callout}>
          <Text style={styles.calloutTitle}>Seu app esta pronto para o pedido</Text>
          <Text style={styles.detailText}>Foto do perfil pela camera na tela de conta.</Text>
          <Text style={styles.detailText}>Endereco rapido pela localizacao no checkout.</Text>
          <Text style={styles.detailText}>Aqui voce acompanha a conexao do aparelho.</Text>
        </AppCard>

        <NativeFeatureCard
          title="Status da conexao"
          description="Veja se sua internet esta pronta para finalizar pedidos."
          actionLabel={viewModel.networkLoading ? 'Atualizando...' : 'Atualizar status'}
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
  callout: {
    backgroundColor: palette.creamStrong,
  },
  calloutTitle: {
    fontFamily: 'fredoka',
    fontSize: 22,
    color: palette.primary900,
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
