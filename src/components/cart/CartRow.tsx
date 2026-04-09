import { CartItem } from '@/src/models/order';
import { palette } from '@/src/theme/palette';
import { formatCurrency } from '@/src/utils/currency';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../ui/AppCard';

type CartRowProps = {
  item: CartItem;
  onChangeQuantity: (eggId: string, quantity: number) => void;
};

export function CartRow({ item, onChangeQuantity }: CartRowProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.title}>{item.egg.name}</Text>
          <Text style={styles.meta}>{item.egg.vendor}</Text>
        </View>
        <Text style={styles.total}>{formatCurrency(item.egg.price * item.quantity)}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.counter}>
          <Pressable style={styles.control} onPress={() => onChangeQuantity(item.egg.id, item.quantity - 1)}>
            <Text style={styles.controlLabel}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable style={styles.control} onPress={() => onChangeQuantity(item.egg.id, item.quantity + 1)}>
            <Text style={styles.controlLabel}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.unitPrice}>{formatCurrency(item.egg.price)} cada</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
  },
  meta: {
    fontFamily: 'inter',
    fontSize: 13,
    color: palette.primary700,
  },
  total: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  control: {
    width: 36,
    height: 36,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.creamStrong,
    borderWidth: 2,
    borderColor: palette.borderSoft,
  },
  controlLabel: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
  },
  quantity: {
    fontFamily: 'fredoka',
    fontSize: 20,
    color: palette.primary900,
    minWidth: 24,
    textAlign: 'center',
  },
  unitPrice: {
    fontFamily: 'inter',
    fontSize: 13,
    color: palette.primary700,
  },
});
