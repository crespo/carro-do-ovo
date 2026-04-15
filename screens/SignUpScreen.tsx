import Button from '@/components/Button';
import Card from '@/components/Card';
import Dash from '@/components/Dash';
import FormInput from '@/components/FormInput';
import { Colors } from '@/constants/colors';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function SignUpScreen({ navigation }: any) {
    const { signup, isLoading, error, user } = useAuth();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>('buyer');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [validationError, setValidationError] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Criar Conta' });
    }, [navigation]);

    // Quando cadastro for bem-sucedido, navegar para Home
    useEffect(() => {
        if (user) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
    }, [user]);

    function validate(): boolean {
        if (!name.trim()) {
            setValidationError('Informe seu nome.');
            return false;
        }
        if (!surname.trim()) {
            setValidationError('Informe seu sobrenome.');
            return false;
        }
        if (!email.trim() || !email.includes('@')) {
            setValidationError('Informe um email válido.');
            return false;
        }
        if (password.length < 6) {
            setValidationError('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }
        if (password !== confirmPassword) {
            setValidationError('As senhas não coincidem.');
            return false;
        }
        setValidationError('');
        return true;
    }

    async function onSignUpHandler() {
        if (!validate()) return;
        await signup({
            name: name.trim(),
            surname: surname.trim(),
            email: email.trim(),
            password,
            role,
        });
    }

    return (
        <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView style={styles.screen} behavior="position">
                <View style={styles.rootContainer}>
                    <Card>
                        <FormInput label={'Nome'}>
                            <TextInput
                                autoComplete="name"
                                inputMode="text"
                                placeholder="Seu nome..."
                                value={name}
                                onChangeText={setName}
                            />
                        </FormInput>

                        <FormInput label={'Sobrenome'}>
                            <TextInput
                                autoComplete="family-name"
                                inputMode="text"
                                placeholder="Seu sobrenome..."
                                value={surname}
                                onChangeText={setSurname}
                            />
                        </FormInput>

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
                                    autoComplete="new-password"
                                    secureTextEntry={isPasswordHidden}
                                    style={styles.passwordInput}
                                    placeholder="Mínimo 6 caracteres..."
                                    value={password}
                                    onChangeText={setPassword}
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

                        <FormInput label={'Confirmar Senha'}>
                            <TextInput
                                autoComplete="new-password"
                                secureTextEntry={isPasswordHidden}
                                placeholder="Repita sua senha..."
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </FormInput>

                        <Dash />

                        {/* Seleção de perfil */}
                        <Text style={styles.roleLabel}>Você é:</Text>
                        <View style={styles.roleContainer}>
                            <Pressable
                                style={[styles.roleButton, role === 'buyer' && styles.roleSelected]}
                                onPress={() => setRole('buyer')}
                            >
                                <Ionicons
                                    name="basket-outline"
                                    size={22}
                                    color={role === 'buyer' ? Colors.lightText : Colors.primary500}
                                />
                                <Text
                                    style={[
                                        styles.roleText,
                                        role === 'buyer' && styles.roleTextSelected,
                                    ]}
                                >
                                    Comprador
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.roleButton,
                                    role === 'producer' && styles.roleSelected,
                                ]}
                                onPress={() => setRole('producer')}
                            >
                                <Ionicons
                                    name="egg-outline"
                                    size={22}
                                    color={role === 'producer' ? Colors.lightText : Colors.primary500}
                                />
                                <Text
                                    style={[
                                        styles.roleText,
                                        role === 'producer' && styles.roleTextSelected,
                                    ]}
                                >
                                    Produtor
                                </Text>
                            </Pressable>
                        </View>

                        {(validationError || error) ? (
                            <Text style={styles.errorText}>{validationError || error}</Text>
                        ) : null}

                        <Dash />

                        {isLoading ? (
                            <ActivityIndicator size="large" color={Colors.primary500} />
                        ) : (
                            <Button onPress={onSignUpHandler}>Cadastrar</Button>
                        )}
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
        padding: 16,
        justifyContent: 'center',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    roleLabel: {
        fontFamily: 'fredoka',
        fontSize: 18,
        color: Colors.darkText,
        textAlign: 'center',
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: Colors.secondary600,
        backgroundColor: Colors.secondaryAccent600,
    },
    roleSelected: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary600,
    },
    roleText: {
        fontFamily: 'fredoka',
        fontSize: 16,
        color: Colors.darkText,
    },
    roleTextSelected: {
        color: Colors.lightText,
    },
    errorText: {
        color: '#c0392b',
        fontFamily: 'inter',
        fontSize: 13,
        textAlign: 'center',
    },
});
