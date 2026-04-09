import { palette } from '@/src/theme/palette';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type QuantityPickerProps = {
  quantity: number;
  onChange: (value: number) => void;
};

export function QuantityPicker({ quantity, onChange }: QuantityPickerProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Quantidade</Text>
      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={() => onChange(Math.max(1, quantity - 1))}>
          <Text style={styles.buttonLabel}>-</Text>
        </Pressable>
        <Text style={styles.value}>{quantity}</Text>
        <Pressable style={styles.button} onPress={() => onChange(quantity + 1)}>
          <Text style={styles.buttonLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  label: {
    fontFamily: 'fredoka',
    fontSize: 18,
    color: palette.primary900,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.borderStrong,
    backgroundColor: palette.creamStrong,
  },
  buttonLabel: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  value: {
    fontFamily: 'fredoka',
    fontSize: 28,
    color: palette.primary900,
    minWidth: 40,
    textAlign: 'center',
  },
});
