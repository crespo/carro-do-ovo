import { CartList } from '@/src/components/cart/CartList';
import { OrderSummaryCard } from '@/src/components/cart/OrderSummaryCard';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppCard } from '@/src/components/ui/AppCard';
import { AppInput } from '@/src/components/ui/AppInput';
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
        subtitle="Revise seu carrinho, confirme o endereco e finalize sua compra."
        rightActionLabel="Voltar"
        onRightAction={viewModel.goBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CartList items={viewModel.items} onChangeQuantity={viewModel.changeQuantity} />

        <AppCard>
          <Text style={styles.sectionTitle}>Entrega</Text>
          <AppInput
            label="Celular para contato"
            keyboardType="phone-pad"
            placeholder="(84) 99999-9999"
            value={viewModel.contactPhone}
            onChangeText={viewModel.setContactPhone}
          />
          <AppInput
            label="Endereco de entrega"
            placeholder="Rua, numero e bairro"
            multiline
            value={viewModel.deliveryAddress}
            onChangeText={viewModel.setDeliveryAddress}
            style={styles.multilineInput}
          />
          <AppButton
            title={viewModel.addressLoading ? 'Buscando endereco...' : 'Usar minha localizacao'}
            onPress={viewModel.fillAddressFromLocation}
            disabled={viewModel.addressLoading}
            variant="secondary"
          />
          <Text style={styles.helper}>Use sua localizacao para preencher o endereco mais rapido.</Text>
        </AppCard>

        <OrderSummaryCard
          subtotal={viewModel.subtotalLabel}
          delivery={viewModel.deliveryLabel}
          total={viewModel.totalLabel}
        />

        {viewModel.feedback ? <Text style={styles.feedback}>{viewModel.feedback}</Text> : null}

        {viewModel.lastOrder ? (
          <AppCard style={styles.successCard}>
            <Text style={styles.sectionTitle}>Pedido confirmado</Text>
            <Text style={styles.successCode}>{viewModel.lastOrder.code}</Text>
            <Text style={styles.helper}>Entrega: {viewModel.lastOrder.deliveryAddress}</Text>
            <Text style={styles.helper}>Celular: {viewModel.lastOrder.contactPhone}</Text>
            <AppButton title="Ver historico de compras" onPress={viewModel.openHistory} variant="secondary" />
          </AppCard>
        ) : null}

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
  sectionTitle: {
    fontFamily: 'fredoka',
    fontSize: 22,
    color: palette.primary900,
  },
  multilineInput: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  helper: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    lineHeight: 20,
  },
  feedback: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary800,
  },
  successCard: {
    backgroundColor: palette.creamStrong,
  },
  successCode: {
    fontFamily: 'fredoka',
    fontSize: 26,
    color: palette.primary900,
  },
});
