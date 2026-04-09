import { palette } from '@/src/theme/palette';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';

type NativeFeatureCardProps = PropsWithChildren<{
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  tone?: 'warm' | 'soft';
}>;

export function NativeFeatureCard({
  title,
  description,
  actionLabel,
  onAction,
  disabled,
  tone = 'soft',
  children,
}: NativeFeatureCardProps) {
  return (
    <AppCard style={[styles.card, tone === 'warm' ? styles.warm : styles.soft]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {children}
      <AppButton title={actionLabel} onPress={onAction} disabled={disabled} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  warm: {
    backgroundColor: palette.creamStrong,
  },
  soft: {
    backgroundColor: palette.surface,
  },
  header: {
    gap: 6,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  description: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    lineHeight: 20,
  },
});
