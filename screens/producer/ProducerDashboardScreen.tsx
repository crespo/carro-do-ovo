import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import Egg from '@/models/eggs';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

function ListingRow({ egg, onEdit, onDelete }: { egg: Egg; onEdit: () => void; onDelete: () => void }) {
    return (
        <View style={styles.row}>
            <View style={styles.rowInfo}>
                <Text style={styles.rowName} numberOfLines={1}>{egg.name}</Text>
                <Text style={styles.rowMeta}>
                    R$ {egg.price.toFixed(2)} · {egg.quantity} und · {egg.category}
                </Text>
            </View>
            <View style={styles.rowActions}>
                <Pressable onPress={onEdit} hitSlop={8} style={styles.actionBtn}>
                    <Ionicons name="pencil-outline" size={20} color={Colors.primary500} />
                </Pressable>
                <Pressable onPress={onDelete} hitSlop={8} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={20} color="#c0392b" />
                </Pressable>
            </View>
        </View>
    );
}

export default function ProducerDashboardScreen({ navigation }: any) {
    const { user } = useAuth();
    const { getProducerListings, deleteListing } = useStore();

    const listings = getProducerListings(user!.id);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Meus Anúncios' });
    }, [navigation]);

    function handleDelete(egg: Egg) {
        Alert.alert(
            'Remover anúncio',
            `Deseja remover "${egg.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', style: 'destructive', onPress: () => deleteListing(egg.id) },
            ],
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{listings.length}</Text>
                    <Text style={styles.statLabel}>Anúncios ativos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                        R$ {listings.reduce((s, e) => s + e.price, 0).toFixed(0)}
                    </Text>
                    <Text style={styles.statLabel}>Valor total (1 bandeja cada)</Text>
                </View>
            </View>

            <FlatList
                data={listings}
                keyExtractor={(e) => e.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="basket-outline" size={56} color={Colors.secondary600} />
                        <Text style={styles.emptyText}>Nenhum anúncio ainda.</Text>
                        <Text style={styles.emptyText}>Crie seu primeiro produto abaixo!</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ListingRow
                        egg={item}
                        onEdit={() => navigation.navigate('CreateListing', { egg: item })}
                        onDelete={() => handleDelete(item)}
                    />
                )}
            />

            <View style={styles.cta}>
                <Button onPress={() => navigation.navigate('CreateListing', {})}>
                    + Novo Anúncio
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.secondaryAccent500,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 3,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
    },
    statNumber: {
        fontFamily: 'fredoka',
        fontSize: 22,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    statLabel: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.darkText,
        textAlign: 'center',
    },
    list: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 8,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 10,
        padding: 12,
        borderWidth: 3,
        borderLeftColor: Colors.secondary500,
        borderTopColor: Colors.secondary500,
        borderRightColor: Colors.secondary800,
        borderBottomColor: Colors.secondary800,
    },
    rowInfo: {
        flex: 1,
        gap: 3,
    },
    rowName: {
        fontFamily: 'fredoka',
        fontSize: 16,
        color: Colors.primary500,
        letterSpacing: 0.5,
    },
    rowMeta: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.darkText,
    },
    rowActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 6,
    },
    empty: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 8,
    },
    emptyText: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.secondary800,
    },
    cta: {
        padding: 16,
    },
});
