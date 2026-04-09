import { ProfileCard } from '@/src/components/profile/ProfileCard';
import { AppButton } from '@/src/components/ui/AppButton';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useProfileViewModel } from '@/src/view-models/useProfileViewModel';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileRoute() {
  const viewModel = useProfileViewModel();

  return (
    <Screen contentContainerStyle={styles.content}>
      <PageHeader
        title="Perfil do vendedor"
        subtitle="Resumo da conta, pedidos recentes e pontos principais para explicar o projeto em sala."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileCard title="Conta">
          <Text style={styles.name}>{viewModel.userName}</Text>
          <Text style={styles.body}>{viewModel.email}</Text>
          <Text style={styles.body}>{viewModel.phone}</Text>
        </ProfileCard>

        <ProfileCard title="Painel do MVP">
          {viewModel.highlights.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.body}>{item}</Text>
            </View>
          ))}
        </ProfileCard>

        <ProfileCard title="Ultimos pedidos">
          {viewModel.orderSummaries.length ? (
            viewModel.orderSummaries.map((item) => (
              <View key={item.id} style={styles.orderRow}>
                <Text style={styles.orderCode}>{item.code}</Text>
                <Text style={styles.body}>{item.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>Nenhum pedido finalizado ainda.</Text>
          )}
        </ProfileCard>

        <AppButton title="Sair da demonstracao" onPress={viewModel.logout} variant="secondary" />
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
    paddingBottom: 24,
  },
  name: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  body: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary800,
    lineHeight: 20,
    flex: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.accent,
    marginTop: 6,
  },
  orderRow: {
    gap: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSoft,
  },
  orderCode: {
    fontFamily: 'fredoka',
    fontSize: 16,
    color: palette.primary900,
  },
});
