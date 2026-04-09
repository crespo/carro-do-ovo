import { AppButton } from '@/src/components/ui/AppButton';
import { AppCard } from '@/src/components/ui/AppCard';
import { AppInput } from '@/src/components/ui/AppInput';
import { Chip } from '@/src/components/ui/Chip';
import { palette } from '@/src/theme/palette';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type CatalogHeaderProps = {
  userName: string;
  cartCount: number;
  totalLabel: string;
  search: string;
  categories: string[];
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCheckout: () => void;
};

export function CatalogHeader({
  userName,
  cartCount,
  totalLabel,
  search,
  categories,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onCheckout,
}: CatalogHeaderProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.overline}>Bem-vindo, {userName}</Text>
          <Text style={styles.title}>Catalogo de bandejas</Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterValue}>{cartCount}</Text>
          <Text style={styles.counterLabel}>itens</Text>
        </View>
      </View>

      <AppInput
        label="Pesquisar bandejas"
        placeholder="Buscar por nome, vendedor ou categoria"
        value={search}
        onChangeText={onSearchChange}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            active={selectedCategory === category}
            onPress={() => onCategoryChange(category)}
          />
        ))}
      </ScrollView>

      <View style={styles.checkoutRow}>
        <View>
          <Text style={styles.totalLabel}>Carrinho atual</Text>
          <Text style={styles.totalValue}>{totalLabel}</Text>
        </View>

        <View style={styles.checkoutAction}>
          <AppButton title="Ver pedido" onPress={onCheckout} variant="secondary" />
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.creamStrong,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  overline: {
    fontFamily: 'inter',
    color: palette.primary700,
    fontSize: 14,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 30,
    color: palette.primary900,
  },
  counter: {
    backgroundColor: palette.primary900,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 84,
    alignItems: 'center',
  },
  counterValue: {
    fontFamily: 'fredoka',
    fontSize: 22,
    color: palette.cream,
  },
  counterLabel: {
    fontFamily: 'inter',
    fontSize: 12,
    color: palette.cream,
  },
  chips: {
    gap: 10,
  },
  checkoutRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  totalLabel: {
    fontFamily: 'inter',
    fontSize: 13,
    color: palette.primary700,
  },
  totalValue: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  checkoutAction: {
    minWidth: 150,
  },
});
