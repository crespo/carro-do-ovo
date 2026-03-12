import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';
import Card from '../Card';

export default function EggItem({ id, name, vendor, vendorRating, price }: any) {
    const navigation: any = useNavigation();

    function selectEggHandler() {
        navigation.navigate('EggDetail', {
            eggId: id,
        });
    }

    return (
        <View style={styles.rootContainer}>
            <Card>
                <Text style={styles.title} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.vendor}>Produtor {vendor}</Text>
                <View style={styles.rating}>
                    <Ionicons name="star" size={14} />
                    <Text>{vendorRating}</Text>
                </View>
                <Text>
                    <Text style={styles.price}>R$ {price.toFixed(2)}</Text>/bandeja
                </Text>
                <Button onPress={selectEggHandler}>Comprar</Button>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '50%',
    },
    vendor: {
        fontFamily: 'inter',
        fontSize: 14,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 14,
        gap: 8,
    },
    price: {
        fontFamily: 'fredoka',
        fontSize: 18,
        letterSpacing: 1,
    },
    title: {
        fontFamily: 'fredoka',
        fontSize: 16,
        letterSpacing: 1,
    },
});
