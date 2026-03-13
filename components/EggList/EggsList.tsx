import { FlatList, StyleSheet, View } from 'react-native';
import EggItem from './EggItem';

export default function EggsList({ items }: any) {
    function renderEggItem(itemData: any) {
        const item = itemData.item;
        const eggItemProps = {
            id: item.id,
            name: item.name,
            price: item.price,
            vendor: item.vendor,
            vendorRating: item.vendorRating,
        };
        return <EggItem {...eggItemProps} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderEggItem}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8 },
});
