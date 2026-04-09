import { metrics } from '@/src/theme/metrics';
import { palette } from '@/src/theme/palette';
import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: metrics.radiusLarge,
    borderWidth: 3,
    borderColor: palette.borderStrong,
    padding: 18,
    gap: 14,
    ...metrics.shadow,
  },
});
