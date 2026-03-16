import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function RatingLabel({ vendorRating }: any) {
    return (
        <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={Colors.primaryAccent600} />
            <Text style={styles.rating}>{vendorRating}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: Colors.secondaryAccent800,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 16,
    },
    rating: {
        fontFamily: 'fredoka',
        letterSpacing: 1,
        fontSize: 12,
        color: Colors.primaryAccent800,
    },
});
