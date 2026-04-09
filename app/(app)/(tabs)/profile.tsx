import { CameraCard } from '@/src/components/native/CameraCard';
import { ProfileCard } from '@/src/components/profile/ProfileCard';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppInput } from '@/src/components/ui/AppInput';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useProfileViewModel } from '@/src/view-models/useProfileViewModel';
import { Image } from 'expo-image';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileRoute() {
  const viewModel = useProfileViewModel();

  return (
    <Screen contentContainerStyle={styles.content}>
      <PageHeader
        title="Perfil do usuario"
        subtitle="Seus dados, foto e pedidos em um so lugar."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileCard title="Conta">
          <View style={styles.accountRow}>
            {viewModel.avatarUri ? (
              <Image source={{ uri: viewModel.avatarUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarLabel}>Sem foto</Text>
              </View>
            )}

            <View style={styles.accountCopy}>
              <Text style={styles.name}>{viewModel.userName}</Text>
              <Text style={styles.body}>{viewModel.email}</Text>
              <Text style={styles.body}>Endereco: {viewModel.defaultAddress}</Text>
            </View>
          </View>

          <AppInput
            label="Celular"
            keyboardType="phone-pad"
            placeholder="(84) 99999-9999"
            value={viewModel.phone}
            onChangeText={viewModel.setPhone}
          />

          <AppButton title={viewModel.loading ? 'Salvando perfil...' : 'Salvar perfil'} onPress={viewModel.saveProfile} />
          {viewModel.loading ? <ActivityIndicator color={palette.primary700} /> : null}
          {viewModel.feedback ? <Text style={styles.feedback}>{viewModel.feedback}</Text> : null}
        </ProfileCard>

        <CameraCard
          title="Foto do perfil"
          description="Atualize sua foto"
          permissionLabel={viewModel.cameraPermissionLabel}
          permissionActionLabel="Ativar camera"
          placeholderLabel="Ative a camera para tirar sua foto."
          captureLabel={viewModel.cameraBusy ? 'Capturando...' : 'Capturar nova foto'}
          canCapture={viewModel.canUseCamera}
          isBusy={viewModel.cameraBusy}
          photoUri={viewModel.avatarUri}
          cameraRef={viewModel.cameraRef}
          onRequestPermission={viewModel.requestCameraAccess}
          onCapture={viewModel.capturePhoto}
        />

        <ProfileCard title="Historico de compras">
          {viewModel.orderHistory.length ? (
            viewModel.orderHistory.map((item) => (
              <View key={item.id} style={styles.orderRow}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderCode}>{item.code}</Text>
                  <Text style={styles.orderTotal}>{item.totalLabel}</Text>
                </View>
                <Text style={styles.body}>{item.createdAtLabel}</Text>
                <Text style={styles.body}>{item.itemsLabel}</Text>
                <Text style={styles.body}>Entrega: {item.address}</Text>
                <Text style={styles.body}>Contato: {item.phone}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>Nenhuma compra concluida ainda.</Text>
          )}
        </ProfileCard>

        <AppButton title="Sair" onPress={viewModel.logout} variant="secondary" />
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
  accountRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 999,
    backgroundColor: palette.creamStrong,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.borderSoft,
  },
  avatarLabel: {
    fontFamily: 'fredoka',
    fontSize: 14,
    color: palette.primary700,
  },
  accountCopy: {
    flex: 1,
    gap: 4,
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
  feedback: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary800,
  },
  orderRow: {
    gap: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSoft,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  orderCode: {
    fontFamily: 'fredoka',
    fontSize: 17,
    color: palette.primary900,
  },
  orderTotal: {
    fontFamily: 'fredoka',
    fontSize: 17,
    color: palette.primary900,
  },
});
