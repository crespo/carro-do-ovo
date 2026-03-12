import { StyleSheet, View } from 'react-native';

export default function Card({ children }: any) {
    return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 32,
        padding: 16,
        gap: 8,
        borderWidth: 3,
        borderRadius: 8,
        borderRightColor: '#9b8f78',
        borderBottomColor: '#9b8f78',
        borderLeftColor: '#c9bca4',
        borderTopColor: '#c9bca4',
    },
});
