import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function OrderConfirmationScreen({ route, navigation }: any) {
    const orderNumber: string = route.params?.orderNumber ?? '#000000';
    const total: number = route.params?.total ?? 0;

    return (
        <View style={styles.root}>
            <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={64} color={Colors.lightText} />
            </View>

            <Text style={styles.title}>Pedido Confirmado!</Text>
            <Text style={styles.orderNumber}>{orderNumber}</Text>

            <Text style={styles.body}>
                Seu pedido foi recebido e está sendo preparado.{'\n'}
                Em breve você receberá uma atualização.
            </Text>

            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total pago</Text>
                <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>

            <View style={styles.stepRow}>
                {['Pedido recebido', 'Em preparo', 'Enviado', 'Entregue'].map((step, i) => (
                    <View key={step} style={styles.step}>
                        <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
                            {i === 0 && <Ionicons name="checkmark" size={12} color={Colors.lightText} />}
                        </View>
                        <Text style={styles.stepLabel}>{step}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.notice}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.secondary800} />
                <Text style={styles.noticeText}>
                    Acompanhamento de pedidos em tempo real será disponibilizado em breve.
                </Text>
            </View>

            <View style={styles.btnRow}>
                <Button onPress={() => navigation.navigate('Home')}>
                    Continuar Comprando
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        gap: 16,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary500,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderLeftColor: Colors.primary500,
        borderTopColor: Colors.primary500,
        borderRightColor: Colors.primary800,
        borderBottomColor: Colors.primary800,
    },
    title: {
        fontFamily: 'fredoka',
        fontSize: 32,
        color: Colors.primary500,
        letterSpacing: 1,
        textAlign: 'center',
    },
    orderNumber: {
        fontFamily: 'inter',
        fontSize: 18,
        color: Colors.darkText,
        letterSpacing: 2,
    },
    body: {
        fontFamily: 'inter',
        fontSize: 14,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 22,
    },
    totalBox: {
        backgroundColor: Colors.secondaryAccent500,
        borderRadius: 12,
        paddingHorizontal: 28,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 3,
        borderLeftColor: Colors.secondaryAccent600,
        borderTopColor: Colors.secondaryAccent600,
        borderRightColor: Colors.secondaryAccent800,
        borderBottomColor: Colors.secondaryAccent800,
        width: '100%',
    },
    totalLabel: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.secondary800,
    },
    totalValue: {
        fontFamily: 'fredoka',
        fontSize: 28,
        color: Colors.primary500,
        letterSpacing: 1,
    },
    stepRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
    },
    step: {
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    stepDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.secondary500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: {
        backgroundColor: Colors.primaryAccent500,
    },
    stepLabel: {
        fontFamily: 'inter',
        fontSize: 9,
        color: Colors.darkText,
        textAlign: 'center',
    },
    notice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: Colors.secondaryAccent600,
        borderRadius: 8,
        padding: 10,
        width: '100%',
    },
    noticeText: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
        flex: 1,
        lineHeight: 16,
    },
    btnRow: {
        width: '100%',
        marginTop: 8,
    },
});
