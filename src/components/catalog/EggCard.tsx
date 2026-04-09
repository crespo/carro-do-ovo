import { Egg } from '@/src/models/egg';
import { palette } from '@/src/theme/palette';
import { formatCurrency } from '@/src/utils/currency';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';

type EggCardProps = {
  egg: Egg;
  onPress: () => void;
  onAdd: () => void;
};

export function EggCard({ egg, onPress, onAdd }: EggCardProps) {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <AppCard style={styles.card}>
        <Image source={egg.image} style={styles.image} contentFit="cover" />
        <Text style={styles.category}>{egg.category}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {egg.name}
        </Text>
        <Text style={styles.meta}>{egg.vendor}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{formatCurrency(egg.price)}</Text>
          <Text style={styles.rating}>{egg.rating.toFixed(1)}★</Text>
        </View>
        <AppButton title="Adicionar" onPress={onAdd} />
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    gap: 10,
    height: '100%',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 18,
    backgroundColor: palette.creamStrong,
  },
  category: {
    fontFamily: 'fredoka',
    fontSize: 12,
    color: palette.accentStrong,
  },
  name: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
    minHeight: 48,
  },
  meta: {
    fontFamily: 'inter',
    fontSize: 13,
    color: palette.primary700,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontFamily: 'fredoka',
    fontSize: 19,
    color: palette.primary900,
  },
  rating: {
    fontFamily: 'fredoka',
    fontSize: 14,
    color: palette.primary800,
    backgroundColor: palette.creamStrong,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
});
