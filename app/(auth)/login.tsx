import { AppButton } from '@/src/components/ui/AppButton';
import { AppCard } from '@/src/components/ui/AppCard';
import { AppInput } from '@/src/components/ui/AppInput';
import { BrandHero } from '@/src/components/ui/BrandHero';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useAuthViewModel } from '@/src/view-models/useAuthViewModel';
import { Href, Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoginRoute() {
  const viewModel = useAuthViewModel('login');

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <BrandHero
        eyebrow="Entrega rapida para o bairro"
        title="Carro do Ovo"
        subtitle="Seu MVP para vender bandejas, gerenciar pedidos e demonstrar um app mobile completo."
      />

      <AppCard>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.helper}>Use qualquer email e uma senha com pelo menos 4 caracteres.</Text>
        </View>

        <AppInput
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="aluno@carrodoovo.com"
          value={viewModel.form.email}
          onChangeText={(value) => viewModel.setField('email', value)}
        />
        <AppInput
          label="Senha"
          secureTextEntry
          autoComplete="password"
          placeholder="1234"
          value={viewModel.form.password}
          onChangeText={(value) => viewModel.setField('password', value)}
        />

        {viewModel.error ? <Text style={styles.error}>{viewModel.error}</Text> : null}

        <AppButton title="Entrar no aplicativo" onPress={viewModel.submit} disabled={viewModel.loading} />

        {viewModel.loading ? <ActivityIndicator color={palette.primary700} /> : null}

        <Text style={styles.footerText}>
          Ainda nao tem acesso?{' '}
          <Link href={'/signup' as Href} style={styles.footerLink}>
            Criar conta
          </Link>
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 32,
  },
  formHeader: {
    gap: 6,
  },
  formTitle: {
    fontFamily: 'fredoka',
    fontSize: 28,
    color: palette.primary900,
  },
  helper: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    lineHeight: 20,
  },
  error: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.error,
  },
  footerText: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    textAlign: 'center',
  },
  footerLink: {
    color: palette.primary900,
    fontFamily: 'fredoka',
  },
});
