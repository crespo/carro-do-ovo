import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Button({ children, onPress, color }: any) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => (pressed ? styles.pressed : styles.notPressed)}
        >
            <View
                style={[
                    styles.rootContainer,
                    color === 'secondary' ? styles.colorSecondary : styles.colorPrimary,
                ]}
            >
                <Text style={color === 'secondary' ? styles.titleSecondary : styles.titlePrimary}>
                    {children}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: 5,
    },
    colorPrimary: {
        backgroundColor: '#fcb101',
        borderRightColor: '#9d4901',
        borderBottomColor: '#9d4901',
        borderLeftColor: '#feec7a',
        borderTopColor: '#feec7a',
    },
    colorSecondary: {
        backgroundColor: '#fdeed2',
        borderRightColor: '#d8a67d',
        borderBottomColor: '#d8a67d',
        borderLeftColor: '#fdf8e6',
        borderTopColor: '#fdf8e6',
    },
    titlePrimary: {
        fontFamily: 'fredoka',
        color: '#fbf7f1',
        fontSize: 24,
        letterSpacing: 1,
    },
    titleSecondary: {
        fontFamily: 'fredoka',
        color: '#622c18',
        fontSize: 24,
        letterSpacing: 1,
    },
    pressed: {
        flex: 1,
        opacity: 0.6,
    },
    notPressed: {
        flex: 1,
    },
});
