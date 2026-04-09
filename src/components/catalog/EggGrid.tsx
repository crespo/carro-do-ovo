import { Egg } from '@/src/models/egg';
import { palette } from '@/src/theme/palette';
import { FlatList, ListRenderItemInfo, StyleSheet, Text } from 'react-native';
import { EggCard } from './EggCard';

type EggGridProps = {
  items: Egg[];
  columns: number;
  onSelectEgg: (id: string) => void;
  onAddEgg: (egg: Egg) => void;
};

export function EggGrid({ items, columns, onSelectEgg, onAddEgg }: EggGridProps) {
  function renderItem({ item }: ListRenderItemInfo<Egg>) {
    return <EggCard egg={item} onPress={() => onSelectEgg(item.id)} onAdd={() => onAddEgg(item)} />;
  }

  return (
    <FlatList
      key={columns}
      data={items}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum item encontrado com esse filtro.</Text>}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingBottom: 28,
  },
  columnWrapper: {
    gap: 12,
  },
  empty: {
    paddingTop: 32,
    fontFamily: 'inter',
    fontSize: 15,
    color: palette.primary700,
    textAlign: 'center',
  },
});
