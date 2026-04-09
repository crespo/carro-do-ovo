import { CartList } from '@/src/components/cart/CartList';
import { OrderSummaryCard } from '@/src/components/cart/OrderSummaryCard';
import { AppButton } from '@/src/components/ui/AppButton';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useCheckoutViewModel } from '@/src/view-models/useCheckoutViewModel';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

export default function CheckoutRoute() {
  const viewModel = useCheckoutViewModel();

  return (
    <Screen contentContainerStyle={styles.content}>
      <PageHeader
        title="Fechar pedido"
        subtitle="Resumo do carrinho, ajuste de quantidade e confirmacao de compra."
        rightActionLabel="Voltar"
        onRightAction={viewModel.goBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CartList items={viewModel.items} onChangeQuantity={viewModel.changeQuantity} />
        <OrderSummaryCard
          subtotal={viewModel.subtotalLabel}
          delivery={viewModel.deliveryLabel}
          total={viewModel.totalLabel}
        />

        {viewModel.feedback ? <Text style={styles.feedback}>{viewModel.feedback}</Text> : null}

        <AppButton
          title={viewModel.loading ? 'Finalizando pedido...' : 'Confirmar pedido'}
          onPress={viewModel.submitOrder}
          disabled={viewModel.loading || !viewModel.items.length}
        />

        {viewModel.loading ? <ActivityIndicator color={palette.primary700} /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 32,
  },
  feedback: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary800,
  },
});
