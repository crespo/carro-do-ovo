import { palette } from '@/src/theme/palette';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, style, ...props }: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={palette.muted} style={[styles.input, style]} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontFamily: 'fredoka',
    color: palette.primary900,
    fontSize: 16,
  },
  input: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: palette.borderSoft,
    backgroundColor: palette.cream,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'inter',
    fontSize: 15,
    color: palette.primary900,
  },
});
