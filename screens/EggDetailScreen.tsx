import { EGGS } from '@/data/dummy-data';
import { useLayoutEffect } from 'react';
import { ScrollView, Text } from 'react-native';

export default function EggDetailScreen({ route, navigation }: any) {
    const eggId: string = route.params.eggId;

    const selectedEgg = EGGS.filter((egg) => {
        return egg.id === eggId;
    })[0];

    useLayoutEffect(() => {
        const eggName = EGGS.find((egg: any) => egg.id === eggId)?.name;

        navigation.setOptions({
            title: eggName,
        });
    }, [eggId, navigation]);

    return (
        <ScrollView>
            <Text>{selectedEgg.name}</Text>
            <Text>{selectedEgg.price}</Text>
            <Text>{selectedEgg.vendor}</Text>
            <Text>{selectedEgg.vendorRating}</Text>
        </ScrollView>
    );
}
