import Button from '@/components/Button';
import Card from '@/components/Card';
import FormInput from '@/components/FormInput';
import { Image, KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen({ navigation }: any) {
    function loginButtonHandler() {
        navigation.navigate('Home');
    }

    function signUpButtonHandler() {
        navigation.navigate('SignUp');
    }

    return (
        <View style={styles.rootContainer}>
            <KeyboardAvoidingView behavior="position">
                <Image
                    style={styles.image}
                    source={require('@/assets/images/carro-do-ovo/main-logo.png')}
                />
                <Card>
                    <FormInput label={'Email'}>
                        <TextInput autoComplete="email" inputMode="email" />
                    </FormInput>
                    <FormInput label={'Senha'}>
                        <TextInput autoComplete="current-password" secureTextEntry={true} />
                    </FormInput>

                    <Button onPress={loginButtonHandler} fontSize={16}>
                        Entre
                    </Button>
                    <Button onPress={signUpButtonHandler} color={'secondary'} fontSize={16}>
                        Cadastre-se
                    </Button>
                </Card>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 350,
    },
});
