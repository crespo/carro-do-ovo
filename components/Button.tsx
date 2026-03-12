import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Button({ children, fontSize, onPress, color }: any) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
            <View
                style={[
                    styles.rootContainer,
                    color === 'secondary' ? styles.colorSecondary : styles.colorPrimary,
                ]}
            >
                <Text style={[styles.title, { fontSize: fontSize }]}>{children}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        height: 50,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
    },
    colorPrimary: {
        backgroundColor: '#9b8f78',
        borderRightColor: '#c9bca4',
        borderBottomColor: '#c9bca4',
        borderLeftColor: '#9b8f78',
        borderTopColor: '#9b8f78',
    },
    colorSecondary: {
        backgroundColor: '#ceb88e',
        borderRightColor: '#9b8f78',
        borderBottomColor: '#9b8f78',
        borderLeftColor: '#c9bca4',
        borderTopColor: '#c9bca4',
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
    },
    pressed: {
        opacity: 0.8,
    },
});
