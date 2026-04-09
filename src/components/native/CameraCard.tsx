import { CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import { palette } from '@/src/theme/palette';
import { RefObject } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';

type CameraCardProps = {
  permissionLabel: string;
  captureLabel: string;
  canCapture: boolean;
  isBusy: boolean;
  photoUri: string | null;
  cameraRef: RefObject<CameraView | null>;
  onRequestPermission: () => void;
  onCapture: () => void;
};

export function CameraCard({
  permissionLabel,
  captureLabel,
  canCapture,
  isBusy,
  photoUri,
  cameraRef,
  onRequestPermission,
  onCapture,
}: CameraCardProps) {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>Camera</Text>
      <Text style={styles.description}>Permissao atual: {permissionLabel}. A captura salva uma foto de teste.</Text>

      {canCapture ? (
        <CameraView ref={cameraRef} style={styles.preview} facing="back" />
      ) : photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.placeholder]}>
          <Text style={styles.placeholderText}>Liberar camera para visualizar.</Text>
        </View>
      )}

      {photoUri ? <Image source={{ uri: photoUri }} style={styles.thumbnail} contentFit="cover" /> : null}

      {!canCapture ? (
        <AppButton title="Liberar camera" onPress={onRequestPermission} disabled={isBusy} variant="secondary" />
      ) : null}

      <AppButton title={captureLabel} onPress={onCapture} disabled={!canCapture || isBusy} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  title: {
    fontFamily: 'fredoka',
    fontSize: 24,
    color: palette.primary900,
  },
  description: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
    lineHeight: 20,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: palette.creamStrong,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'inter',
    fontSize: 14,
    color: palette.primary700,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    backgroundColor: palette.creamStrong,
  },
});
