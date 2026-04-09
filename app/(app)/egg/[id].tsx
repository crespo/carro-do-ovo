import { QuantityPicker } from '@/src/components/catalog/QuantityPicker';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppCard } from '@/src/components/ui/AppCard';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useEggDetailViewModel } from '@/src/view-models/useEggDetailViewModel';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function EggDetailRoute() {
  const viewModel = useEggDetailViewModel();

  if (!viewModel.egg) {
    return (
      <Screen contentContainerStyle={styles.content}>
        <AppCard>
          <Text style={styles.title}>Produto nao encontrado.</Text>
        </AppCard>
      </Screen>
    );
  }

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <PageHeader
        title={viewModel.egg.name}
        subtitle={`${viewModel.egg.vendor} · ${viewModel.egg.category}`}
        rightActionLabel="Voltar"
        onRightAction={viewModel.goBack}
      />

      <AppCard style={styles.heroCard}>
        <Image source={viewModel.egg.image} style={styles.image} contentFit="cover" />
        <View style={styles.priceRow}>
          <Text style={styles.price}>{viewModel.priceLabel}</Text>
          <Text style={styles.badge}>{viewModel.egg.rating.toFixed(1)} estrelas</Text>
        </View>
        <Text style={styles.description}>{viewModel.egg.description}</Text>
        <Text style={styles.meta}>{viewModel.egg.stock} bandejas disponiveis hoje</Text>
      </AppCard>

      <AppCard>
        <QuantityPicker quantity={viewModel.quantity} onChange={viewModel.setQuantity} />
        <AppButton title="Adicionar ao carrinho" onPress={viewModel.addToCart} />
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 32,
  },
  heroCard: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 24,
    backgroundColor: palette.creamStrong,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  price: {
    fontFamily: 'fredoka',
    fontSize: 30,
    color: palette.primary900,
  },
  badge: {
    fontFamily: 'fredoka',
    fontSize: 14,
    color: palette.primary900,
    backgroundColor: palette.warmSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  description: {
    fontFamily: 'inter',
    fontSize: 15,
    color: palette.primary800,
    lineHeight: 22,
  },
  meta: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
  },
});
