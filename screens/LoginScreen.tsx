import Button from '@/components/Button';
import Card from '@/components/Card';
import Dash from '@/components/Dash';
import FormInput from '@/components/FormInput';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen({ navigation }: any) {
    const [password, setPassword] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    console.log(password);

    function loginButtonHandler() {
        navigation.navigate('Home');
    }

    function signUpButtonHandler() {
        navigation.navigate('SignUp');
    }
    function changePasswordHiddenStateHandler() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    return (
        <ScrollView style={styles.screen}>
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
                                placeholder="raul@ovo.tech"
                            />
                        </FormInput>

                        <FormInput label={'Senha'}>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    autoComplete="current-password"
                                    secureTextEntry={isPasswordHidden ? true : false}
                                    style={{ flex: 1 }}
                                    onChangeText={(text: any) => setPassword(text)}
                                />
                                <Pressable onPress={changePasswordHiddenStateHandler}>
                                    {isPasswordHidden ?
                                        <Ionicons name="eye-off" size={28} />
                                    :   <Ionicons name="eye" size={28} />}
                                </Pressable>
                            </View>
                        </FormInput>

                        <Dash />

                        <Button onPress={loginButtonHandler}>Entre</Button>
                        <Button onPress={signUpButtonHandler} color={'secondary'}>
                            Cadastre-se
                        </Button>
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
    eyeIcon: {
        height: 30,
        width: 30,
    },
});
