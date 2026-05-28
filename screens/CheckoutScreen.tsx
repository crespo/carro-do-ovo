import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type PaymentMethod = 'card' | 'pix' | 'boleto';

function SectionTitle({ children }: { children: string }) {
    return <Text style={styles.sectionTitle} accessibilityRole="header">{children}</Text>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );
}

function StyledInput(props: React.ComponentProps<typeof TextInput> & { accessibilityLabel?: string }) {
    return <TextInput style={styles.input} placeholderTextColor={Colors.secondary800} {...props} />;
}

function formatCardNumber(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

export default function CheckoutScreen({ navigation }: any) {
    const { totalPrice, totalItems, clearCart } = useCart();

    // Address
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');

    // Payment
    const [method, setMethod] = useState<PaymentMethod>('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    function validate(): boolean {
        if (!street.trim() || !number.trim() || !city.trim()) {
            Alert.alert('Endereço incompleto', 'Preencha rua, número e cidade.');
            return false;
        }
        if (method === 'card') {
            const digits = cardNumber.replace(/\D/g, '');
            if (digits.length < 16) {
                Alert.alert('Cartão inválido', 'Número do cartão incompleto.');
                return false;
            }
            if (!cardName.trim()) {
                Alert.alert('Cartão inválido', 'Informe o nome no cartão.');
                return false;
            }
            if (expiry.replace(/\D/g, '').length < 4) {
                Alert.alert('Cartão inválido', 'Data de validade incompleta.');
                return false;
            }
            if (cvv.length < 3) {
                Alert.alert('Cartão inválido', 'CVV inválido.');
                return false;
            }
        }
        return true;
    }

    async function handlePay() {
        if (!validate()) return;
        setIsLoading(true);
        // Simulate payment processing delay
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        clearCart();
        navigation.navigate('OrderConfirmation', {
            orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
            total: totalPrice,
        });
    }

    const paymentMethods: { key: PaymentMethod; label: string; icon: any; available: boolean }[] = [
        { key: 'card', label: 'Cartão', icon: 'card-outline', available: true },
        { key: 'pix', label: 'PIX', icon: 'qr-code-outline', available: false },
        { key: 'boleto', label: 'Boleto', icon: 'document-text-outline', available: false },
    ];

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <SectionTitle>Endereço de Entrega</SectionTitle>

                <Field label="Rua / Avenida">
                    <StyledInput value={street} onChangeText={setStreet} placeholder="Ex: Rua das Flores" accessibilityLabel="Rua ou avenida" />
                </Field>

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Field label="Número">
                            <StyledInput value={number} onChangeText={setNumber} placeholder="123" keyboardType="number-pad" accessibilityLabel="Número do endereço" />
                        </Field>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Field label="Bairro">
                            <StyledInput value={neighborhood} onChangeText={setNeighborhood} placeholder="Centro" accessibilityLabel="Bairro" />
                        </Field>
                    </View>
                </View>

                <Field label="Cidade">
                    <StyledInput value={city} onChangeText={setCity} placeholder="São Paulo" accessibilityLabel="Cidade" />
                </Field>

                <SectionTitle>Forma de Pagamento</SectionTitle>

                <View style={styles.methodRow} accessibilityRole="radiogroup">
                    {paymentMethods.map((m) => (
                        <Pressable
                            key={m.key}
                            style={[
                                styles.methodChip,
                                method === m.key && styles.methodChipActive,
                                !m.available && styles.methodChipDisabled,
                            ]}
                            onPress={() => {
                                if (!m.available) {
                                    Alert.alert('Em breve', `${m.label} estará disponível em breve!`);
                                    return;
                                }
                                setMethod(m.key);
                            }}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: method === m.key, disabled: !m.available }}
                            accessibilityLabel={m.available ? m.label : `${m.label}, em breve`}
                        >
                            <Ionicons
                                name={m.icon}
                                size={20}
                                color={method === m.key ? Colors.lightText : Colors.secondary800}
                                accessibilityElementsHidden
                                importantForAccessibility="no"
                            />
                            <Text style={[styles.methodLabel, method === m.key && styles.methodLabelActive]}>
                                {m.label}
                            </Text>
                            {!m.available && (
                                <Text style={styles.soonBadge}>em breve</Text>
                            )}
                        </Pressable>
                    ))}
                </View>

                {method === 'card' && (
                    <View style={styles.cardForm}>
                        <Field label="Número do cartão">
                            <StyledInput
                                value={cardNumber}
                                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                                placeholder="0000 0000 0000 0000"
                                keyboardType="number-pad"
                                maxLength={19}
                                accessibilityLabel="Número do cartão"
                            />
                        </Field>
                        <Field label="Nome no cartão">
                            <StyledInput
                                value={cardName}
                                onChangeText={(t) => setCardName(t.toUpperCase())}
                                placeholder="NOME COMO NO CARTÃO"
                                autoCapitalize="characters"
                                accessibilityLabel="Nome no cartão"
                            />
                        </Field>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Field label="Validade">
                                    <StyledInput
                                        value={expiry}
                                        onChangeText={(t) => setExpiry(formatExpiry(t))}
                                        placeholder="MM/AA"
                                        keyboardType="number-pad"
                                        maxLength={5}
                                        accessibilityLabel="Validade do cartão, mês e ano"
                                    />
                                </Field>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Field label="CVV">
                                    <StyledInput
                                        value={cvv}
                                        onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="000"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        maxLength={4}
                                        accessibilityLabel="Código de segurança CVV"
                                    />
                                </Field>
                            </View>
                        </View>
                        <View style={styles.mockNotice}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={13}
                                color={Colors.secondary800}
                                accessibilityElementsHidden
                                importantForAccessibility="no"
                            />
                            <Text style={styles.mockNoticeText}>
                                Ambiente de testes — nenhum dado real é processado.
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.orderSummary}>
                    <Text style={styles.summaryLabel}>
                        {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </Text>
                    <Text style={styles.summaryTotal}>Total: R$ {totalPrice.toFixed(2)}</Text>
                </View>

                <Button onPress={handlePay}>
                    {isLoading ? 'Processando...' : `Pagar R$ ${totalPrice.toFixed(2)}`}
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 4,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontFamily: 'fredoka',
        fontSize: 20,
        color: Colors.primary500,
        letterSpacing: 1,
        marginTop: 16,
        marginBottom: 8,
    },
    field: {
        gap: 5,
        marginBottom: 10,
    },
    label: {
        fontFamily: 'inter',
        fontSize: 13,
        color: Colors.darkText,
    },
    input: {
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.secondary600,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: 'inter',
        fontSize: 15,
        color: Colors.primary800,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    methodRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    methodChip: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.secondary600,
        backgroundColor: Colors.secondaryAccent600,
        gap: 4,
    },
    methodChipActive: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary800,
    },
    methodChipDisabled: {
        opacity: 0.5,
    },
    methodLabel: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.darkText,
    },
    methodLabelActive: {
        color: Colors.lightText,
        fontFamily: 'fredoka',
    },
    soonBadge: {
        fontFamily: 'inter',
        fontSize: 9,
        color: Colors.secondary800,
        backgroundColor: Colors.secondary500,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 6,
    },
    cardForm: {
        gap: 0,
    },
    mockNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    mockNoticeText: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
        flex: 1,
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.secondaryAccent500,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        marginTop: 8,
        borderWidth: 2,
        borderColor: Colors.secondary600,
    },
    summaryLabel: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.darkText,
    },
    summaryTotal: {
        fontFamily: 'fredoka',
        fontSize: 20,
        color: Colors.primary500,
        letterSpacing: 1,
    },
});
