import { CatalogHeader } from '@/src/components/catalog/CatalogHeader';
import { EggGrid } from '@/src/components/catalog/EggGrid';
import { Screen } from '@/src/components/ui/Screen';
import { useCatalogViewModel } from '@/src/view-models/useCatalogViewModel';
import { StyleSheet, View } from 'react-native';

export default function HomeRoute() {
  const viewModel = useCatalogViewModel();

  return (
    <Screen contentContainerStyle={styles.content}>
      <CatalogHeader
        userName={viewModel.userName}
        cartCount={viewModel.cartCount}
        totalLabel={viewModel.totalLabel}
        search={viewModel.search}
        categories={viewModel.categories}
        selectedCategory={viewModel.selectedCategory}
        onSearchChange={viewModel.setSearch}
        onCategoryChange={viewModel.setCategory}
        onCheckout={viewModel.goToCheckout}
      />

      <View style={styles.listArea}>
        <EggGrid
          items={viewModel.filteredEggs}
          columns={viewModel.columns}
          onSelectEgg={viewModel.openEgg}
          onAddEgg={viewModel.addEgg}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    flex: 1,
  },
  listArea: {
    flex: 1,
  },
});
