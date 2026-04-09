import { AppCard } from '@/src/components/ui/AppCard';
import { palette } from '@/src/theme/palette';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type BrandHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function BrandHero({ eyebrow, title, subtitle }: BrandHeroProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{eyebrow}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Image
          source={require('../../../assets/images/carro-do-ovo/main-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.creamStrong,
    gap: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.primary900,
  },
  badgeText: {
    fontFamily: 'fredoka',
    color: palette.cream,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 34,
    color: palette.primary900,
  },
  subtitle: {
    fontFamily: 'inter',
    fontSize: 15,
    lineHeight: 22,
    color: palette.primary800,
  },
  logo: {
    width: 90,
    height: 90,
  },
});
