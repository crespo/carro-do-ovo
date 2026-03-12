import { StyleSheet, View } from 'react-native';
import Label from './Label';

export default function FormInput({ children, label }: any) {
    return (
        <>
            <Label>{label}</Label>
            <View style={styles.inputContainer}>{children}</View>
        </>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        padding: 8,
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: '#dbd3c5',
        borderRightColor: '#9b8f78',
        borderBottomColor: '#9b8f78',
        borderLeftColor: '#c9bca4',
        borderTopColor: '#c9bca4',
        gap: 2,
        color: 'white',
    },
});
