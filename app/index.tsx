import LoginScreen from '@/screens/LoginScreen';
import SelectEggsScreen from '@/screens/SelectEggsScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function Index() {
    const [loaded, error] = useFonts({
        fredoka: require('@/assets/fonts/Fredoka-Bold.ttf'),
        inter: require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#854413' },
                headerTintColor: '#f8ecdc',
                contentStyle: { backgroundColor: '#fcf3e3' },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name="Home"
                component={SelectEggsScreen}
                options={{ headerBackVisible: false }}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}
