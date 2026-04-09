import { palette } from '@/src/theme/palette';
import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, scrollable, contentContainerStyle }: ScreenProps) {
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          style={styles.fill}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, styles.fill, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
});
