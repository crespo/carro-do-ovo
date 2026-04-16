import { Colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import EggDetailScreen from '@/screens/EggDetailScreen';
import LoginScreen from '@/screens/LoginScreen';
import SelectEggsScreen from '@/screens/SelectEggsScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Pressable } from 'react-native';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { user, logout } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: Colors.lightText,
                contentStyle: { backgroundColor: Colors.backgroundColorInner },
            }}
        >
            {user == null ? (
                // Rotas públicas — acessíveis sem autenticação
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            ) : (
                // Rotas protegidas — acessíveis apenas quando autenticado
                <>
                    <Stack.Screen
                        name="Home"
                        component={SelectEggsScreen}
                        options={{
                            headerBackVisible: false,
                            headerRight: () => (
                                <Pressable onPress={logout} hitSlop={12}>
                                    <Ionicons name="log-out-outline" size={24} color={Colors.lightText} />
                                </Pressable>
                            ),
                        }}
                    />
                    <Stack.Screen name="EggDetail" component={EggDetailScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

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
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
