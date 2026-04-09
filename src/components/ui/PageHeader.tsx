import { AppButton } from '@/src/components/ui/AppButton';
import { palette } from '@/src/theme/palette';
import { StyleSheet, Text, View } from 'react-native';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  rightActionLabel?: string;
  onRightAction?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  rightActionLabel,
  onRightAction,
}: PageHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {rightActionLabel && onRightAction ? (
        <View style={styles.action}>
          <AppButton title={rightActionLabel} onPress={onRightAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  texts: {
    gap: 4,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 30,
    color: palette.primary900,
  },
  subtitle: {
    fontFamily: 'inter',
    fontSize: 15,
    lineHeight: 22,
    color: palette.primary700,
  },
  action: {
    maxWidth: 160,
  },
});
