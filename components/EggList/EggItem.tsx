import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import PressableCard from '../PressableCard';

export default function EggItem({ id, name, vendor, vendorRating, price, imageUrl }: any) {
    const navigation: any = useNavigation();

    function selectEggHandler() {
        navigation.navigate('EggDetail', {
            eggId: id,
        });
    }

    return (
        <View
            style={[
                styles.rootContainer,
                {
                    aspectRatio: 1.3,
                    flexGrow: 1,
                    width: '50%',
                    position: 'relative',
                    paddingHorizontal: 8,
                },
            ]}
        >
            <PressableCard onPress={selectEggHandler}>
                <View style={styles.innerContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <Text>
                        <Text style={styles.price}>R$ {price.toFixed(2)}</Text>/bandeja
                    </Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {name}
                    </Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.vendor}>{vendor}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color={'#fcb101'} />
                            <Text style={styles.rating}>{vendorRating}</Text>
                        </View>
                    </View>
                </View>
            </PressableCard>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '50%',
    },
    image: {
        width: 50,
        height: 50,
    },
    innerContainer: {
        gap: 3,
    },
    vendor: {
        fontFamily: 'inter',
        fontSize: 12,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    rating: {
        fontSize: 12,
    },
    price: {
        fontFamily: 'fredoka',
        fontSize: 17,
        letterSpacing: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'fredoka',
        fontSize: 12,
        letterSpacing: 1,
    },
});
