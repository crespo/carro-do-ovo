import { useApp } from '@/src/context/AppContext';
import { Href, Redirect } from 'expo-router';

export default function IndexRoute() {
  const { user } = useApp();

  if (user) {
    return <Redirect href={'/home' as Href} />;
  }

  return <Redirect href={'/login' as Href} />;
}
