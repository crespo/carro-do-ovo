import { Colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider, useCart } from '@/context/CartContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { StoreProvider } from '@/context/StoreContext';
import CartScreen from '@/screens/CartScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import EggDetailScreen from '@/screens/EggDetailScreen';
import LoginScreen from '@/screens/LoginScreen';
import MyOrdersScreen from '@/screens/MyOrdersScreen';
import OrderConfirmationScreen from '@/screens/OrderConfirmationScreen';
import SelectEggsScreen from '@/screens/SelectEggsScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import CreateListingScreen from '@/screens/producer/CreateListingScreen';
import ProducerDashboardScreen from '@/screens/producer/ProducerDashboardScreen';
import ReceivedOrdersScreen from '@/screens/producer/ReceivedOrdersScreen';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function OrdersIcon({ navigation, target }: { navigation: any; target: 'MyOrders' | 'ReceivedOrders' }) {
    return (
        <Pressable
            onPress={() => navigation.navigate(target)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={target === 'MyOrders' ? 'Meus pedidos' : 'Pedidos recebidos'}
        >
            <Ionicons name="receipt-outline" size={24} color={Colors.lightText} />
        </Pressable>
    );
}

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
    const { user, logout, isInitializing } = useAuth();
    const isProducer = user?.role === 'producer';

    if (isInitializing) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.backgroundColorInner,
                }}
            >
                <ActivityIndicator size="large" color={Colors.primary500} />
            </View>
        );
    }

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
                        options={({ navigation }: any) => ({
                            headerBackVisible: false,
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                                    <OrdersIcon navigation={navigation} target="ReceivedOrders" />
                                    {logoutBtn}
                                </View>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="CreateListing"
                        component={CreateListingScreen}
                    />
                    <Stack.Screen
                        name="ReceivedOrders"
                        component={ReceivedOrdersScreen}
                        options={{ title: 'Pedidos Recebidos' }}
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
                                    <OrdersIcon navigation={navigation} target="MyOrders" />
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
                    <Stack.Screen
                        name="MyOrders"
                        component={MyOrdersScreen}
                        options={{ title: 'Meus Pedidos' }}
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
                <OrdersProvider>
                    <CartProvider>
                        <AppNavigator />
                    </CartProvider>
                </OrdersProvider>
            </StoreProvider>
        </AuthProvider>
    );
}
