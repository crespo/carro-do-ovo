import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderItem, OrderStatus, useOrders } from '@/context/OrdersContext';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
    received: { label: 'Recebido', bg: Colors.secondaryAccent500, fg: Colors.primary800 },
    preparing: { label: 'Em preparo', bg: Colors.primaryAccent600, fg: Colors.primaryAccent800 },
    shipped: { label: 'Enviado', bg: Colors.primary500, fg: Colors.lightText },
    delivered: { label: 'Entregue', bg: Colors.primary800, fg: Colors.lightText },
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
    received: 'preparing',
    preparing: 'shipped',
    shipped: 'delivered',
    delivered: null,
};

function formatDate(ts: number): string {
    if (!ts) return '';
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const meta = STATUS_META[status];
    return (
        <View style={[styles.badge, { backgroundColor: meta.bg }]} accessible accessibilityLabel={`Status: ${meta.label}`}>
            <Text style={[styles.badgeText, { color: meta.fg }]}>{meta.label}</Text>
        </View>
    );
}

function OrderCard({ order, producerId }: { order: Order; producerId: string }) {
    const { updateOrderStatus } = useOrders();
    const orderNumber = `#${order.id.slice(-6).toUpperCase()}`;
    const myItems: OrderItem[] = order.items.filter((i) => i.producerId === producerId);
    const mySubtotal = myItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const next = NEXT_STATUS[order.status];

    async function handleAdvance() {
        if (!next) return;
        try {
            await updateOrderStatus(order.id, next);
        } catch (err) {
            Alert.alert('Erro', (err as Error).message);
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.orderNumber}>{orderNumber}</Text>
                    <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
                </View>
                <StatusBadge status={order.status} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Cliente</Text>
                <Text style={styles.buyerName}>{order.buyerName}</Text>
                <Text style={styles.address}>
                    {order.address.street}, {order.address.number}
                    {order.address.neighborhood ? ` — ${order.address.neighborhood}` : ''}
                    {'\n'}{order.address.city}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Seus itens</Text>
                {myItems.map((i) => (
                    <View key={i.eggId} style={styles.itemRow}>
                        <Text style={styles.itemQty}>{i.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{i.name}</Text>
                        <Text style={styles.itemSubtotal}>R$ {(i.price * i.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Subtotal seus itens</Text>
                <Text style={styles.totalValue}>R$ {mySubtotal.toFixed(2)}</Text>
            </View>

            {next && (
                <Pressable
                    onPress={handleAdvance}
                    style={styles.advanceBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Avançar para ${STATUS_META[next].label}`}
                >
                    <Text style={styles.advanceText}>Avançar para "{STATUS_META[next].label}"</Text>
                    <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={Colors.lightText}
                        accessibilityElementsHidden
                        importantForAccessibility="no"
                    />
                </Pressable>
            )}
        </View>
    );
}

export default function ReceivedOrdersScreen() {
    const { user } = useAuth();
    const { orders, isInitializing } = useOrders();

    if (isInitializing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary500} accessibilityLabel="Carregando pedidos" />
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons
                    name="receipt-outline"
                    size={72}
                    color={Colors.secondary600}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                />
                <Text style={styles.emptyTitle} accessibilityRole="header">Nenhum pedido recebido</Text>
                <Text style={styles.emptySubtitle}>Pedidos com seus produtos aparecerão aqui.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(o) => o.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <OrderCard order={item} producerId={user!.id} />}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
    },
    emptyTitle: {
        fontFamily: 'fredoka',
        fontSize: 24,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    emptySubtitle: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.secondary800,
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    card: {
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 12,
        padding: 14,
        gap: 10,
        borderWidth: 3,
        borderLeftColor: Colors.secondary500,
        borderTopColor: Colors.secondary500,
        borderRightColor: Colors.secondary800,
        borderBottomColor: Colors.secondary800,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    orderNumber: {
        fontFamily: 'fredoka',
        fontSize: 16,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    date: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        fontFamily: 'fredoka',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    section: {
        gap: 3,
        borderTopWidth: 1,
        borderTopColor: Colors.secondary600,
        paddingTop: 8,
    },
    sectionLabel: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    buyerName: {
        fontFamily: 'fredoka',
        fontSize: 14,
        color: Colors.primary800,
    },
    address: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.darkText,
        lineHeight: 17,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 2,
    },
    itemQty: {
        fontFamily: 'fredoka',
        fontSize: 13,
        color: Colors.primary500,
        minWidth: 28,
    },
    itemName: {
        flex: 1,
        fontFamily: 'inter',
        fontSize: 13,
        color: Colors.darkText,
    },
    itemSubtotal: {
        fontFamily: 'fredoka',
        fontSize: 13,
        color: Colors.primary800,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.secondary600,
        paddingTop: 8,
    },
    totalLabel: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.secondary800,
    },
    totalValue: {
        fontFamily: 'fredoka',
        fontSize: 18,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    advanceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary500,
        borderRadius: 10,
        paddingVertical: 10,
        borderWidth: 2,
        borderLeftColor: Colors.primary500,
        borderTopColor: Colors.primary500,
        borderRightColor: Colors.primary800,
        borderBottomColor: Colors.primary800,
    },
    advanceText: {
        fontFamily: 'fredoka',
        fontSize: 13,
        color: Colors.lightText,
        letterSpacing: 0.5,
    },
});
