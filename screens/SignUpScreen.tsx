import Button from '@/components/Button';
import Card from '@/components/Card';
import FormInput from '@/components/FormInput';
import { useLayoutEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function SignUpScreen({ navigation }: any) {
    function onSignUpHandler() {
        navigation.navigate('Login');
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Formulário de Cadastro',
        });
    });

    return (
        <ScrollView style={styles.screen}>
            <KeyboardAvoidingView style={styles.screen} behavior="position">
                <View style={styles.rootContainer}>
                    <Card>
                        <FormInput label={'Nome'}>
                            <TextInput
                                autoComplete="name"
                                inputMode="text"
                                placeholder="Insira seu nome..."
                            />
                        </FormInput>
                        <FormInput label={'Sobrenome'}>
                            <TextInput
                                autoComplete="family-name"
                                inputMode="text"
                                placeholder="Insira seu sobrenome..."
                            />
                        </FormInput>
                        <FormInput label={'Email'}>
                            <TextInput
                                autoComplete="email"
                                inputMode="email"
                                placeholder="Insira seu email..."
                            />
                        </FormInput>
                        <FormInput label={'Senha'}>
                            <TextInput
                                autoComplete="new-password"
                                inputMode="text"
                                placeholder="Insira sua senha..."
                            />
                        </FormInput>
                        <FormInput label={'Confirmar Senha'}>
                            <TextInput
                                autoComplete="new-password"
                                inputMode="text"
                                placeholder="Insira sua senha novamente..."
                            />
                        </FormInput>
                        <Button onPress={onSignUpHandler}>Cadastrar</Button>
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
});
