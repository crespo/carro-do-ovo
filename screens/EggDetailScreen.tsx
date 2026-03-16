import RatingLabel from '@/components/RatingLabel';
import { Colors } from '@/constants/colors';
import { EGGS } from '@/data/dummy-data';
import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

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
            <View style={styles.rootContainer}>
                <Image source={{ uri: selectedEgg.imageUrl }} style={styles.image} />
                <Text style={styles.title} numberOfLines={3}>
                    {selectedEgg.name}
                </Text>
                <View style={styles.vendorContainer}>
                    <Text style={styles.vendor}>{selectedEgg.vendor}</Text>
                    <RatingLabel vendorRating={selectedEgg.vendorRating} />
                </View>
                <Text style={styles.price}>R$ {selectedEgg.price.toFixed(2)}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontFamily: 'fredoka',
        fontSize: 28,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    image: {
        width: '80%',
        height: 250,
    },
    vendorContainer: {
        flexDirection: 'row',
    },
    vendor: {
        color: Colors.primary500,
    },
    price: {
        color: Colors.primary500,
    },
});
