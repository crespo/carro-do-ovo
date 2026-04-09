import { useApp } from '@/src/context/AppContext';
import { Href, router } from 'expo-router';
import { startTransition, useState } from 'react';

type AuthMode = 'login' | 'signup';

type AuthForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const initialState: AuthForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

export function useAuthViewModel(mode: AuthMode) {
  const { login, signUp } = useApp();
  const [form, setForm] = useState<AuthForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setField(field: keyof AuthForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit() {
    try {
      setLoading(true);
      setError('');

      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.firstName || !form.lastName || !form.phone) {
          throw new Error('Preencha nome, sobrenome e telefone para concluir o cadastro.');
        }

        await signUp(form);
      }

      startTransition(() => {
        router.replace('/home' as Href);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel continuar.');
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    setField,
    submit,
  };
}
