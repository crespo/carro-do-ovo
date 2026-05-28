import { Colors } from '@/constants/colors';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Button({ children, onPress, color, accessibilityLabel, disabled }: any) {
    const label =
        accessibilityLabel ??
        (typeof children === 'string' ? children : undefined);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: !!disabled }}
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
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
    pressable: {
        alignSelf: 'stretch',
    },
    pressed: {
        opacity: 0.6,
    },
    rootContainer: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: 5,
    },
    colorPrimary: {
        backgroundColor: Colors.primaryAccent500,
        borderLeftColor: Colors.primaryAccent600,
        borderTopColor: Colors.primaryAccent600,
        borderRightColor: Colors.primaryAccent800,
        borderBottomColor: Colors.primaryAccent800,
    },
    colorSecondary: {
        backgroundColor: Colors.secondaryAccent500,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
    },
    titlePrimary: {
        fontFamily: 'fredoka',
        // a11y: era lightText sobre primaryAccent500 = 1.72:1 (falha AA). darkText agora = 6.04:1.
        color: Colors.darkText,
        fontSize: 24,
        letterSpacing: 1,
    },
    titleSecondary: {
        fontFamily: 'fredoka',
        color: Colors.darkText,
        fontSize: 24,
        letterSpacing: 1,
    },
});
