import { StyleSheet, Text, View } from 'react-native';

export default function Label({ children }: any) {
    const label = children.toLowerCase();

    return (
        <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
        paddingHorizontal: 8,
    },
    label: {
        fontSize: 14,
        color: '#000',
    },
});
