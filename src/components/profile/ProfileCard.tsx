import { palette } from '@/src/theme/palette';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppCard } from '../ui/AppCard';

type ProfileCardProps = PropsWithChildren<{
  title: string;
}>;

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      {children}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'fredoka',
    fontSize: 22,
    color: palette.primary900,
  },
});
