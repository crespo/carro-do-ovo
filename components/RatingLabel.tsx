import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function RatingLabel({ vendorRating }: any) {
    return (
        <View
            style={styles.ratingContainer}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Avaliação ${vendorRating} de 5`}
        >
            {/* a11y: bg trocado para primary500. Ícone primaryAccent500 sobre primary500 = 3.23:1 (>=3:1 OK p/ ícone). Texto lightText = 5.56:1. */}
            <Ionicons
                name="star"
                size={12}
                color={Colors.primaryAccent500}
                accessibilityElementsHidden
                importantForAccessibility="no"
            />
            <Text style={styles.rating}>{vendorRating}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: Colors.primary500,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 16,
    },
    rating: {
        fontFamily: 'fredoka',
        letterSpacing: 1,
        fontSize: 12,
        color: Colors.lightText,
    },
});
