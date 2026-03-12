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
        backgroundColor: '#dbd3c5',
        borderRightColor: '#9b8f78',
        borderBottomColor: '#9b8f78',
        borderLeftColor: '#c9bca4',
        borderTopColor: '#c9bca4',
        gap: 2,
        color: 'white',
    },
});
