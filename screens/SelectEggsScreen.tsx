import EggsList from '@/components/EggList/EggsList';
import { Colors } from '@/constants/colors';
import { useStore } from '@/context/StoreContext';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SelectEggsScreen() {
    const { eggs, isInitializing } = useStore();

    if (isInitializing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={Colors.primary500}
                    accessibilityLabel="Carregando produtos"
                />
            </View>
        );
    }

    return <EggsList items={eggs} />;
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
