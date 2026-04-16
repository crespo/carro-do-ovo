import Button from '@/components/Button';
import RatingLabel from '@/components/RatingLabel';
import { Colors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EggDetailScreen({ route, navigation }: any) {
    const eggId: string = route.params.eggId;
    const { eggs } = useStore();
    const { addItem, items } = useCart();

    const selectedEgg = eggs.find((egg) => egg.id === eggId)!;
    const [qty, setQty] = useState(1);

    const cartItem = items.find((i) => i.egg.id === eggId);

    useLayoutEffect(() => {
        navigation.setOptions({ title: selectedEgg?.name ?? '' });
    }, [eggId, navigation, selectedEgg]);

    function handleAddToCart() {
        for (let i = 0; i < qty; i++) {
            addItem(selectedEgg);
        }
        navigation.navigate('Cart');
    }

    if (!selectedEgg) return null;

    return (
        <ScrollView contentContainerStyle={styles.rootContainer}>
            <Image source={{ uri: selectedEgg.imageUrl }} style={styles.image} />

            <Text style={styles.title} numberOfLines={3}>
                {selectedEgg.name}
            </Text>

            <View style={styles.vendorContainer}>
                <Ionicons name="storefront-outline" size={14} color={Colors.primary500} />
                <Text style={styles.vendor}>{selectedEgg.vendor}</Text>
                <RatingLabel vendorRating={selectedEgg.vendorRating} />
            </View>

            <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{selectedEgg.category}</Text>
            </View>

            {selectedEgg.description ? (
                <Text style={styles.description}>{selectedEgg.description}</Text>
            ) : null}

            <View style={styles.priceRow}>
                <Text style={styles.price}>R$ {selectedEgg.price.toFixed(2)}</Text>
                <Text style={styles.unit}>/ bandeja</Text>
            </View>

            <View style={styles.stock}>
                <Ionicons name="cube-outline" size={14} color={Colors.secondary800} />
                <Text style={styles.stockText}>{selectedEgg.quantity} disponíveis</Text>
            </View>

            {/* Quantity stepper */}
            <View style={styles.stepperRow}>
                <Pressable
                    style={styles.stepperBtn}
                    onPress={() => setQty((q) => Math.max(1, q - 1))}
                    hitSlop={8}
                >
                    <Ionicons name="remove" size={22} color={Colors.primary500} />
                </Pressable>
                <Text style={styles.stepperQty}>{qty}</Text>
                <Pressable
                    style={styles.stepperBtn}
                    onPress={() => setQty((q) => Math.min(selectedEgg.quantity, q + 1))}
                    hitSlop={8}
                >
                    <Ionicons name="add" size={22} color={Colors.primary500} />
                </Pressable>
            </View>

            <Text style={styles.subtotal}>
                Subtotal: R$ {(selectedEgg.price * qty).toFixed(2)}
            </Text>

            <View style={styles.buttonRow}>
                <Button onPress={handleAddToCart}>Adicionar ao Carrinho</Button>
            </View>

            {cartItem && (
                <Text style={styles.alreadyInCart}>
                    Você já tem {cartItem.quantity} no carrinho.
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        alignItems: 'center',
        padding: 20,
        gap: 10,
        paddingBottom: 40,
    },
    title: {
        fontFamily: 'fredoka',
        fontSize: 28,
        color: Colors.primary500,
        letterSpacing: 1,
        textAlign: 'center',
    },
    image: {
        width: '90%',
        height: 240,
        borderRadius: 12,
    },
    vendorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    vendor: {
        color: Colors.primary500,
        fontFamily: 'inter',
        fontSize: 14,
    },
    categoryBadge: {
        backgroundColor: Colors.primaryAccent600,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    categoryText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.primary800,
        textTransform: 'capitalize',
    },
    description: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    price: {
        fontFamily: 'fredoka',
        fontSize: 32,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    unit: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.secondary800,
    },
    stock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stockText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.secondary800,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 8,
        backgroundColor: Colors.secondaryAccent500,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 3,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
    },
    stepperBtn: {
        padding: 4,
    },
    stepperQty: {
        fontFamily: 'fredoka',
        fontSize: 24,
        color: Colors.primary500,
        minWidth: 32,
        textAlign: 'center',
    },
    subtotal: {
        fontFamily: 'fredoka',
        fontSize: 16,
        color: Colors.darkText,
        letterSpacing: 0.5,
    },
    buttonRow: {
        width: '100%',
        marginTop: 4,
    },
    alreadyInCart: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.secondary800,
    },
});
