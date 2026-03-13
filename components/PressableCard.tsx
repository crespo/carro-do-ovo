import { Pressable, StyleSheet, View } from 'react-native';

export default function PressableCard({ children, onPress }: any) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => (pressed ? styles.pressed : styles.notPressed)}
        >
            <View style={styles.card}>{children}</View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 16,
        gap: 12,
        borderWidth: 3,
        borderRadius: 8,
        backgroundColor: '#fdf1dd',
        borderRightColor: '#c49878',
        borderBottomColor: '#c49878',
        borderLeftColor: '#e3b998',
        borderTopColor: '#e3b998',
    },
    pressed: {
        flex: 1,
        opacity: 0.4,
    },
    notPressed: {
        flex: 1,
    },
});
