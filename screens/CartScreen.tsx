import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { CartItem, useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

function CartRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <View style={styles.row}>
            <Image source={{ uri: item.egg.imageUrl }} style={styles.rowImage} />
            <View style={styles.rowInfo}>
                <Text style={styles.rowName} numberOfLines={2}>{item.egg.name}</Text>
                <Text style={styles.rowVendor}>{item.egg.vendor}</Text>
                <Text style={styles.rowPrice}>R$ {item.egg.price.toFixed(2)}</Text>
            </View>
            <View style={styles.rowRight}>
                <Pressable onPress={() => removeItem(item.egg.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color="#c0392b" />
                </Pressable>
                <View style={styles.stepper}>
                    <Pressable hitSlop={6} onPress={() => updateQuantity(item.egg.id, item.quantity - 1)}>
                        <Ionicons name="remove-circle-outline" size={24} color={Colors.primary500} />
                    </Pressable>
                    <Text style={styles.stepperQty}>{item.quantity}</Text>
                    <Pressable hitSlop={6} onPress={() => updateQuantity(item.egg.id, item.quantity + 1)}>
                        <Ionicons name="add-circle-outline" size={24} color={Colors.primary500} />
                    </Pressable>
                </View>
                <Text style={styles.rowSubtotal}>
                    R$ {(item.egg.price * item.quantity).toFixed(2)}
                </Text>
            </View>
        </View>
    );
}

export default function CartScreen({ navigation }: any) {
    const { items, totalPrice, totalItems, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={72} color={Colors.secondary600} />
                <Text style={styles.emptyTitle}>Carrinho vazio</Text>
                <Text style={styles.emptySubtitle}>Adicione produtos para continuar.</Text>
                <View style={styles.emptyBtn}>
                    <Button onPress={() => navigation.navigate('Home')}>Ver Produtos</Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            {/* flex: 1 here is the key — constrains list height so footer stays on screen */}
            <FlatList
                data={items}
                keyExtractor={(i) => i.egg.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <CartRow item={item} />}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>
                        {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </Text>
                    <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>
                </View>
                <Button onPress={() => navigation.navigate('Checkout')}>
                    Finalizar Compra
                </Button>
                <Pressable onPress={clearCart} style={styles.clearBtn}>
                    <Text style={styles.clearText}>Limpar carrinho</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 3,
        borderLeftColor: Colors.secondary500,
        borderTopColor: Colors.secondary500,
        borderRightColor: Colors.secondary800,
        borderBottomColor: Colors.secondary800,
    },
    rowImage: {
        width: 80,
        height: 80,
    },
    rowInfo: {
        flex: 1,
        padding: 10,
        gap: 2,
    },
    rowName: {
        fontFamily: 'fredoka',
        fontSize: 14,
        color: Colors.primary500,
        letterSpacing: 0.5,
    },
    rowVendor: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
    },
    rowPrice: {
        fontFamily: 'inter',
        fontSize: 13,
        color: Colors.darkText,
    },
    rowRight: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stepperQty: {
        fontFamily: 'fredoka',
        fontSize: 18,
        color: Colors.primary500,
        minWidth: 22,
        textAlign: 'center',
    },
    rowSubtotal: {
        fontFamily: 'fredoka',
        fontSize: 13,
        color: Colors.primary800,
    },
    footer: {
        padding: 16,
        backgroundColor: Colors.backgroundColorOuter,
        borderTopWidth: 2,
        borderTopColor: Colors.secondary600,
        gap: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.darkText,
    },
    totalPrice: {
        fontFamily: 'fredoka',
        fontSize: 26,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    clearBtn: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    clearText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.secondary800,
        textDecorationLine: 'underline',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
    },
    emptyTitle: {
        fontFamily: 'fredoka',
        fontSize: 26,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    emptySubtitle: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.secondary800,
    },
    emptyBtn: {
        width: '100%',
        marginTop: 16,
    },
});
