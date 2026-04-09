import { CartItem } from '@/src/models/order';
import { palette } from '@/src/theme/palette';
import { FlatList, ListRenderItemInfo, StyleSheet, Text } from 'react-native';
import { CartRow } from './CartRow';

type CartListProps = {
  items: CartItem[];
  onChangeQuantity: (eggId: string, quantity: number) => void;
};

export function CartList({ items, onChangeQuantity }: CartListProps) {
  function renderItem({ item }: ListRenderItemInfo<CartItem>) {
    return <CartRow item={item} onChangeQuantity={onChangeQuantity} />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.egg.id}
      renderItem={renderItem}
      scrollEnabled={false}
      contentContainerStyle={styles.content}
      ListEmptyComponent={<Text style={styles.empty}>Seu carrinho esta vazio no momento.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  empty: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
