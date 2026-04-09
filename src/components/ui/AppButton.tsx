import { palette } from '@/src/theme/palette';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  const primary = variant === 'primary';

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}>
      <View
        style={[
          styles.button,
          primary ? styles.primaryButton : styles.secondaryButton,
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.label, primary ? styles.primaryLabel : styles.secondaryLabel]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  button: {
    minHeight: 54,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    paddingHorizontal: 18,
  },
  primaryButton: {
    backgroundColor: palette.accent,
    borderColor: palette.borderStrong,
  },
  secondaryButton: {
    backgroundColor: palette.creamStrong,
    borderColor: palette.borderSoft,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: 'fredoka',
    fontSize: 18,
  },
  primaryLabel: {
    color: palette.primary900,
  },
  secondaryLabel: {
    color: palette.primary800,
  },
});
