import { palette } from '@/src/theme/palette';
import { Pressable, StyleSheet, Text } from 'react-native';

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.activeChip]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
  },
  activeChip: {
    backgroundColor: palette.primary900,
    borderColor: palette.primary900,
  },
  label: {
    fontFamily: 'fredoka',
    fontSize: 14,
    color: palette.primary800,
  },
  activeLabel: {
    color: palette.cream,
  },
});
