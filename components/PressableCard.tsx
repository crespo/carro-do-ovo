import { Colors } from '@/constants/colors';
import { Pressable, StyleSheet, View } from 'react-native';

export default function PressableCard({ children, onPress, accessibilityLabel, accessibilityHint }: any) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            style={({ pressed }) => (pressed ? styles.pressed : styles.notPressed)}
        >
            <View style={styles.card}>{children}</View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 4,
        gap: 12,
        borderWidth: 3,
        borderRadius: 8,
        backgroundColor: Colors.secondaryAccent500,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
        elevation: 3,
    },
    pressed: {
        flex: 1,
        opacity: 0.8,
    },
    notPressed: {
        flex: 1,
    },
});
