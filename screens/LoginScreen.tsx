import Button from '@/components/Button';
import Card from '@/components/Card';
import Dash from '@/components/Dash';
import FormInput from '@/components/FormInput';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen({ navigation }: any) {
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [validationError, setValidationError] = useState('');

    function validate(): boolean {
        if (!email.trim()) {
            setValidationError('Informe seu email.');
            return false;
        }
        if (!email.includes('@')) {
            setValidationError('Email inválido.');
            return false;
        }
        if (!password) {
            setValidationError('Informe sua senha.');
            return false;
        }
        setValidationError('');
        return true;
    }

    async function loginButtonHandler() {
        if (!validate()) return;
        await login(email.trim(), password);
    }

    function signUpButtonHandler() {
        navigation.navigate('SignUp');
    }

    return (
        <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView style={styles.screen} behavior="position">
                <View style={styles.rootContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={require('@/assets/images/carro-do-ovo/main-logo.png')}
                        />
                    </View>

                    <Card>
                        <FormInput label={'Email'}>
                            <TextInput
                                autoComplete="email"
                                inputMode="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </FormInput>

                        <FormInput label={'Senha'}>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    autoComplete="current-password"
                                    secureTextEntry={isPasswordHidden}
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••"
                                />
                                <Pressable onPress={() => setIsPasswordHidden((v) => !v)}>
                                    <Ionicons
                                        name={isPasswordHidden ? 'eye-off' : 'eye'}
                                        size={28}
                                        color={Colors.primary500}
                                    />
                                </Pressable>
                            </View>
                        </FormInput>

                        {(validationError || error) ? (
                            <Text style={styles.errorText}>{validationError || error}</Text>
                        ) : null}

                        <Dash />

                        {isLoading ? (
                            <ActivityIndicator size="large" color={Colors.primary500} />
                        ) : (
                            <>
                                <Button onPress={loginButtonHandler}>Entre</Button>
                                <Button onPress={signUpButtonHandler} color={'secondary'}>
                                    Cadastre-se
                                </Button>
                            </>
                        )}

                        <Text style={styles.hintText}>
                            Teste: comprador@teste.com ou produtor@teste.com{'\n'}Senha: 123456
                        </Text>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    rootContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 80,
        marginHorizontal: 16,
    },
    imageContainer: { width: 200, height: 200, marginBottom: 32 },
    image: {
        width: '100%',
        height: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    errorText: {
        color: '#c0392b',
        fontFamily: 'inter',
        fontSize: 13,
        textAlign: 'center',
    },
    hintText: {
        color: Colors.secondary800,
        fontFamily: 'inter',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 4,
    },
});
