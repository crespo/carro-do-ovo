import { Colors } from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import PressableCard from '../PressableCard';
import RatingLabel from '../RatingLabel';

export default function EggItem({ id, name, vendor, vendorRating, price, imageUrl }: any) {
    const navigation: any = useNavigation();

    function selectEggHandler() {
        navigation.navigate('EggDetail', {
            eggId: id,
        });
    }

    const a11yLabel = `${name}, vendedor ${vendor}, avaliação ${vendorRating} de 5, R$ ${price.toFixed(2)} por bandeja`;

    return (
        <View
            style={[
                styles.rootContainer,
                {
                    aspectRatio: 0.88,
                    flexGrow: 1,
                    width: '50%',
                    position: 'relative',
                    paddingHorizontal: 4,
                },
            ]}
        >
            <PressableCard
                onPress={selectEggHandler}
                accessibilityLabel={a11yLabel}
                accessibilityHint="Abre os detalhes do produto"
            >
                <View style={styles.innerContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        accessibilityElementsHidden
                        importantForAccessibility="no"
                    />
                    <View style={styles.subContainer}>
                        <Text style={styles.color}>
                            <Text style={styles.price}>R$ {price.toFixed(2)}</Text> / bandeja
                        </Text>
                        <Text style={[styles.title, styles.color]} numberOfLines={1}>
                            {name}
                        </Text>
                        <View style={styles.infoContainer}>
                            <Text style={[styles.vendor, styles.color]}>{vendor}</Text>
                            <RatingLabel vendorRating={vendorRating} />
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
        width: '100%',
        height: 120,
    },
    subContainer: {
        marginHorizontal: 10,
        gap: 3,
    },
    innerContainer: {
        gap: 3,
    },
    infoContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    vendor: {
        fontFamily: 'inter',
        fontSize: 12,
    },
    price: {
        fontFamily: 'fredoka',
        fontSize: 17,
        letterSpacing: 1,
    },

    title: {
        fontFamily: 'fredoka',
        fontSize: 12,
        letterSpacing: 1,
    },
    color: {
        color: Colors.primary500,
    },
});
