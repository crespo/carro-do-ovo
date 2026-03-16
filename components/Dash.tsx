import { Colors } from '@/constants/colors';
import { StyleSheet, View } from 'react-native';

export default function Dash() {
    return <View style={styles.dash} />;
}

const styles = StyleSheet.create({
    dash: {
        height: 0,
        borderBottomWidth: 3,
        borderStyle: 'dashed',
        borderColor: Colors.secondaryAccent800,
        width: '100%',
    },
});
