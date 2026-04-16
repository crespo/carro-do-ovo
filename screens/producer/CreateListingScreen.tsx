import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import Egg, { EggCategory } from '@/models/eggs';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
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

const CATEGORIES: { value: EggCategory; label: string }[] = [
    { value: 'caipira', label: 'Caipira' },
    { value: 'branco', label: 'Branco' },
    { value: 'orgânico', label: 'Orgânico' },
    { value: 'colonial', label: 'Colonial' },
    { value: 'outro', label: 'Outro' },
];

const PRESET_IMAGES = [
    'https://images.unsplash.com/photo-1691480158362-d958b907dc35?q=80&w=880&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587486936739-78a3ea5b9b31?q=80&w=880&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?q=80&w=880&auto=format&fit=crop',
];

export default function CreateListingScreen({ route, navigation }: any) {
    const existingEgg: Egg | undefined = route.params?.egg;
    const isEditing = !!existingEgg;

    const { user } = useAuth();
    const { addListing, updateListing } = useStore();

    const [name, setName] = useState(existingEgg?.name ?? '');
    const [price, setPrice] = useState(existingEgg ? String(existingEgg.price) : '');
    const [quantity, setQuantity] = useState(existingEgg ? String(existingEgg.quantity) : '30');
    const [category, setCategory] = useState<EggCategory>(existingEgg?.category ?? 'caipira');
    const [description, setDescription] = useState(existingEgg?.description ?? '');
    const [imageUrl, setImageUrl] = useState(existingEgg?.imageUrl ?? PRESET_IMAGES[0]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: isEditing ? 'Editar Anúncio' : 'Novo Anúncio' });
    }, [navigation, isEditing]);

    function handleSave() {
        if (!name.trim()) {
            Alert.alert('Campo obrigatório', 'Informe o nome do produto.');
            return;
        }
        const parsedPrice = parseFloat(price.replace(',', '.'));
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            Alert.alert('Preço inválido', 'Informe um preço válido.');
            return;
        }
        const parsedQty = parseInt(quantity, 10);
        if (isNaN(parsedQty) || parsedQty <= 0) {
            Alert.alert('Quantidade inválida', 'Informe uma quantidade válida.');
            return;
        }

        const data = {
            name: name.trim(),
            price: parsedPrice,
            quantity: parsedQty,
            category,
            description: description.trim(),
            imageUrl,
        };

        if (isEditing) {
            updateListing(existingEgg.id, data);
        } else {
            addListing(user!.id, user!.name, data);
        }

        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <Text style={styles.sectionTitle}>Produto</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Ex: Ovos Caipiras Premium"
                        placeholderTextColor={Colors.secondary800}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.field, { flex: 1 }]}>
                        <Text style={styles.label}>Preço (R$)</Text>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={setPrice}
                            placeholder="0,00"
                            placeholderTextColor={Colors.secondary800}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={[styles.field, { flex: 1 }]}>
                        <Text style={styles.label}>Qtd. por bandeja</Text>
                        <TextInput
                            style={styles.input}
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="number-pad"
                            placeholderTextColor={Colors.secondary800}
                        />
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.categoryRow}>
                        {CATEGORIES.map((c) => (
                            <Pressable
                                key={c.value}
                                style={[styles.categoryChip, category === c.value && styles.categoryChipActive]}
                                onPress={() => setCategory(c.value)}
                            >
                                <Text style={[styles.categoryText, category === c.value && styles.categoryTextActive]}>
                                    {c.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Fale sobre seus ovos, criação das galinhas, etc."
                        placeholderTextColor={Colors.secondary800}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <Text style={styles.sectionTitle}>Foto</Text>
                <View style={styles.imagePickerRow}>
                    {PRESET_IMAGES.map((url, idx) => (
                        <Pressable
                            key={idx}
                            style={[styles.imageOption, imageUrl === url && styles.imageOptionActive]}
                            onPress={() => setImageUrl(url)}
                        >
                            <Ionicons
                                name={imageUrl === url ? 'checkmark-circle' : 'image-outline'}
                                size={28}
                                color={imageUrl === url ? Colors.primaryAccent500 : Colors.secondary800}
                            />
                            <Text style={styles.imageOptionText}>Foto {idx + 1}</Text>
                        </Pressable>
                    ))}
                </View>
                <Text style={styles.hint}>Upload de fotos próprias será suportado em breve.</Text>

                <View style={styles.saveBtn}>
                    <Button onPress={handleSave}>
                        {isEditing ? 'Salvar Alterações' : 'Publicar Anúncio'}
                    </Button>
                </View>
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
        marginTop: 12,
        marginBottom: 4,
    },
    field: {
        gap: 6,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
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
    textArea: {
        minHeight: 90,
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.secondary600,
        backgroundColor: Colors.secondaryAccent600,
    },
    categoryChipActive: {
        borderColor: Colors.primaryAccent800,
        backgroundColor: Colors.primaryAccent500,
    },
    categoryText: {
        fontFamily: 'inter',
        fontSize: 13,
        color: Colors.darkText,
    },
    categoryTextActive: {
        color: Colors.lightText,
        fontFamily: 'fredoka',
    },
    imagePickerRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    imageOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.secondary600,
        backgroundColor: Colors.secondaryAccent600,
        gap: 4,
    },
    imageOptionActive: {
        borderColor: Colors.primaryAccent800,
        backgroundColor: Colors.primaryAccent600,
    },
    imageOptionText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: Colors.darkText,
    },
    hint: {
        fontFamily: 'inter',
        fontSize: 11,
        color: Colors.secondary800,
        marginBottom: 20,
    },
    saveBtn: {
        marginTop: 8,
    },
});
