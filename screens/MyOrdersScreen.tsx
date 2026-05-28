import { Colors } from '@/constants/colors';
import { Order, OrderStatus, useOrders } from '@/context/OrdersContext';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
    received: { label: 'Recebido', bg: Colors.secondaryAccent500, fg: Colors.primary800 },
    preparing: { label: 'Em preparo', bg: Colors.primaryAccent600, fg: Colors.primaryAccent800 },
    shipped: { label: 'Enviado', bg: Colors.primary500, fg: Colors.lightText },
    delivered: { label: 'Entregue', bg: Colors.primary800, fg: Colors.lightText },
};

function formatDate(ts: number): string {
    if (!ts) return '';
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function summarizeItems(order: Order): string {
    if (order.items.length === 0) return '';
    const head = order.items.slice(0, 2).map((i) => `${i.quantity}× ${i.name}`).join(', ');
    const rest = order.items.length - 2;
    return rest > 0 ? `${head} e mais ${rest}` : head;
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const meta = STATUS_META[status];
    return (
        <View style={[styles.badge, { backgroundColor: meta.bg }]} accessible accessibilityLabel={`Status: ${meta.label}`}>
            <Text style={[styles.badgeText, { color: meta.fg }]}>{meta.label}</Text>
        </View>
    );
}

function OrderCard({ order }: { order: Order }) {
    const orderNumber = `#${order.id.slice(-6).toUpperCase()}`;
    return (
        <View style={styles.card} accessible accessibilityLabel={`Pedido ${orderNumber}, total R$ ${order.total.toFixed(2)}, status ${STATUS_META[order.status].label}`}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.orderNumber}>{orderNumber}</Text>
                    <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
                </View>
                <StatusBadge status={order.status} />
            </View>
            <Text style={styles.items} numberOfLines={2}>{summarizeItems(order)}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R$ {order.total.toFixed(2)}</Text>
            </View>
        </View>
    );
}

export default function MyOrdersScreen() {
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
                <Text style={styles.emptyTitle} accessibilityRole="header">Nenhum pedido ainda</Text>
                <Text style={styles.emptySubtitle}>Seus pedidos aparecerão aqui.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(o) => o.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <OrderCard order={item} />}
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
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    card: {
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 12,
        padding: 14,
        gap: 8,
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
    items: {
        fontFamily: 'inter',
        fontSize: 13,
        color: Colors.darkText,
        lineHeight: 18,
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
});
