import Card from '@/components/Card';
import { StyleSheet, View } from 'react-native';

export default function SignUpScreen() {
    return (
        <View style={styles.rootContainer}>
            <Card></Card>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
});
