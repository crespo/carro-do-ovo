import EggsList from '@/components/EggList/EggsList';
import { EGGS } from '@/data/dummy-data';
import { useLayoutEffect } from 'react';

export default function SelectEggsScreen({ navigation }: any) {
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Comprar Ovos',
        });
    });

    const eggs = EGGS;

    return <EggsList items={eggs} />;
}
