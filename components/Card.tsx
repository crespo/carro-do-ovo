import { StyleSheet, View } from 'react-native';

export default function Card({ children }: any) {
    return <View style={styles.card}>{children}</View>;
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
});
