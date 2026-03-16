import { Colors } from '@/constants/colors';
import { StyleSheet, View } from 'react-native';
import Label from './Label';

export default function FormInput({ children, label }: any) {
    return (
        <View style={styles.rootContainer}>
            <Label>{label}</Label>

            <View style={styles.inputContainer}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        gap: 8,
        alignItems: 'flex-start',
    },
    inputContainer: {
        width: '100%',
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 29,
        backgroundColor: Colors.secondary500,
        borderLeftColor: Colors.secondary600,
        borderTopColor: Colors.secondary600,
        borderRightColor: Colors.secondary800,
        borderBottomColor: Colors.secondary800,
        gap: 2,
    },
});
