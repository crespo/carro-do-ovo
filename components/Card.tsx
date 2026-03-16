import { Colors } from '@/constants/colors';
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
        backgroundColor: Colors.secondaryAccent500,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
        elevation: 8,
    },
});
