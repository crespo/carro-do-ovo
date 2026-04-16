import { Colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider, useCart } from '@/context/CartContext';
import { StoreProvider } from '@/context/StoreContext';
import CartScreen from '@/screens/CartScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import EggDetailScreen from '@/screens/EggDetailScreen';
import LoginScreen from '@/screens/LoginScreen';
import OrderConfirmationScreen from '@/screens/OrderConfirmationScreen';
import SelectEggsScreen from '@/screens/SelectEggsScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import CreateListingScreen from '@/screens/producer/CreateListingScreen';
import ProducerDashboardScreen from '@/screens/producer/ProducerDashboardScreen';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function CartIcon({ navigation }: { navigation: any }) {
    const { totalItems } = useCart();
    return (
        <Pressable onPress={() => navigation.navigate('Cart')} hitSlop={12}>
            <View>
                <Ionicons name="cart-outline" size={24} color={Colors.lightText} />
                {totalItems > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: Colors.primaryAccent500,
                        borderRadius: 8,
                        minWidth: 16,
                        height: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 3,
                    }}>
                        <Text style={{
                            fontFamily: 'fredoka',
                            fontSize: 10,
                            color: Colors.primary800,
                            lineHeight: 14,
                        }}>
                            {totalItems > 99 ? '99+' : totalItems}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

function AppNavigator() {
    const { user, logout } = useAuth();
    const isProducer = user?.role === 'producer';

    const logoutBtn = (
        <Pressable onPress={logout} hitSlop={12}>
            <Ionicons name="log-out-outline" size={24} color={Colors.lightText} />
        </Pressable>
    );

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: Colors.lightText,
                contentStyle: { backgroundColor: Colors.backgroundColorInner },
            }}
        >
            {user == null ? (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            ) : isProducer ? (
                // ── Producer routes ───────────────────────────────────────────
                <>
                    <Stack.Screen
                        name="Home"
                        component={ProducerDashboardScreen}
                        options={{
                            headerBackVisible: false,
                            headerRight: () => logoutBtn,
                        }}
                    />
                    <Stack.Screen
                        name="CreateListing"
                        component={CreateListingScreen}
                    />
                </>
            ) : (
                // ── Buyer routes ──────────────────────────────────────────────
                <>
                    <Stack.Screen
                        name="Home"
                        component={SelectEggsScreen}
                        options={({ navigation }: any) => ({
                            title: 'Comprar Ovos',
                            headerBackVisible: false,
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                                    <CartIcon navigation={navigation} />
                                    {logoutBtn}
                                </View>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="EggDetail"
                        component={EggDetailScreen}
                        options={({ navigation }: any) => ({
                            headerRight: () => <CartIcon navigation={navigation} />,
                        })}
                    />
                    <Stack.Screen
                        name="Cart"
                        component={CartScreen}
                        options={{ title: 'Carrinho' }}
                    />
                    <Stack.Screen
                        name="Checkout"
                        component={CheckoutScreen}
                        options={{ title: 'Finalizar Compra' }}
                    />
                    <Stack.Screen
                        name="OrderConfirmation"
                        component={OrderConfirmationScreen}
                        options={{ title: 'Pedido Confirmado', headerBackVisible: false }}
                    />
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
            <StoreProvider>
                <CartProvider>
                    <AppNavigator />
                </CartProvider>
            </StoreProvider>
        </AuthProvider>
    );
}
