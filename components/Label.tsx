import { Colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import Dash from './Dash';

export default function Label({ children }: any) {
    return (
        <View style={styles.rootContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{children}</Text>
            </View>
            <Dash />
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%',
        gap: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 2,
        borderRadius: 29,
        borderWidth: 3,
        backgroundColor: Colors.primary500,
        borderLeftColor: Colors.primary600,
        borderTopColor: Colors.primary600,
        borderRightColor: Colors.primary800,
        borderBottomColor: Colors.primary800,
    },
    label: {
        textAlign: 'center',
        fontFamily: 'fredoka',
        letterSpacing: 1,
        fontSize: 18,
        color: Colors.lightText,
    },
});
