import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SelectEggsScreen({ navigation }: any) {
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Comprar Ovos',
        });
    });

    return <View style={styles.rootContainer}></View>;
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 80,
        marginHorizontal: 16,
    },
});
