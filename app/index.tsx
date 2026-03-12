import LoginScreen from '@/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function Index() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#c9bca4' },
                headerTintColor: 'white',
                contentStyle: { backgroundColor: '#fafafa' },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
