import { AppButton } from '@/src/components/ui/AppButton';
import { AppCard } from '@/src/components/ui/AppCard';
import { AppInput } from '@/src/components/ui/AppInput';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { Screen } from '@/src/components/ui/Screen';
import { palette } from '@/src/theme/palette';
import { useAuthViewModel } from '@/src/view-models/useAuthViewModel';
import { Href, Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SignUpRoute() {
  const viewModel = useAuthViewModel('signup');

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <PageHeader
        title="Criar cadastro"
        subtitle="Fluxo simples para demonstrar autenticacao local e organizacao das telas."
      />

      <AppCard>
        <View style={styles.grid}>
          <AppInput
            label="Nome"
            placeholder="Raul"
            value={viewModel.form.firstName}
            onChangeText={(value) => viewModel.setField('firstName', value)}
          />
          <AppInput
            label="Sobrenome"
            placeholder="Silva"
            value={viewModel.form.lastName}
            onChangeText={(value) => viewModel.setField('lastName', value)}
          />
        </View>

        <AppInput
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="raul@carrodoovo.com"
          value={viewModel.form.email}
          onChangeText={(value) => viewModel.setField('email', value)}
        />
        <AppInput
          label="Telefone"
          keyboardType="phone-pad"
          placeholder="(84) 99999-9999"
          value={viewModel.form.phone}
          onChangeText={(value) => viewModel.setField('phone', value)}
        />
        <AppInput
          label="Senha"
          secureTextEntry
          autoComplete="new-password"
          placeholder="1234"
          value={viewModel.form.password}
          onChangeText={(value) => viewModel.setField('password', value)}
        />

        {viewModel.error ? <Text style={styles.error}>{viewModel.error}</Text> : null}

        <AppButton title="Criar conta e entrar" onPress={viewModel.submit} disabled={viewModel.loading} />
        {viewModel.loading ? <ActivityIndicator color={palette.primary700} /> : null}

        <Text style={styles.footerText}>
          Ja possui cadastro?{' '}
          <Link href={'/login' as Href} style={styles.footerLink}>
            Voltar para login
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
  grid: {
    gap: 14,
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
