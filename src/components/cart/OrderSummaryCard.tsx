import { palette } from '@/src/theme/palette';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../ui/AppCard';

type OrderSummaryCardProps = {
  subtotal: string;
  delivery: string;
  total: string;
};

export function OrderSummaryCard({ subtotal, delivery, total }: OrderSummaryCardProps) {
  return (
    <AppCard>
      <Text style={styles.title}>Resumo financeiro</Text>
      <SummaryRow label="Subtotal" value={subtotal} />
      <SummaryRow label="Entrega" value={delivery} />
      <View style={styles.divider} />
      <SummaryRow label="Total" value={total} strong />
    </AppCard>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'fredoka',
    fontSize: 22,
    color: palette.primary900,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontFamily: 'inter',
    fontSize: 15,
    color: palette.primary700,
  },
  value: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
  },
  strong: {
    color: palette.primary900,
    fontSize: 20,
  },
  divider: {
    height: 2,
    backgroundColor: palette.borderSoft,
    borderRadius: 999,
  },
});
