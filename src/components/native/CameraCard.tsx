import { CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import { palette } from '@/src/theme/palette';
import { RefObject } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';

type CameraCardProps = {
  title?: string;
  description?: string;
  permissionLabel: string;
  permissionActionLabel?: string;
  placeholderLabel?: string;
  captureLabel: string;
  canCapture: boolean;
  isBusy: boolean;
  photoUri: string | null;
  cameraRef: RefObject<CameraView | null>;
  onRequestPermission: () => void;
  onCapture: () => void;
};

export function CameraCard({
  title = 'Camera',
  description = 'Atualize sua foto',
  permissionLabel,
  permissionActionLabel = 'Liberar camera',
  placeholderLabel = 'Liberar camera para visualizar.',
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
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.status}>Acesso da camera: {permissionLabel}</Text>

      {canCapture ? (
        <CameraView ref={cameraRef} style={styles.preview} facing="back" />
      ) : photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.placeholder]}>
          <Text style={styles.placeholderText}>{placeholderLabel}</Text>
        </View>
      )}

      {photoUri ? <Image source={{ uri: photoUri }} style={styles.thumbnail} contentFit="cover" /> : null}

      {!canCapture ? (
        <AppButton
          title={permissionActionLabel}
          onPress={onRequestPermission}
          disabled={isBusy}
          variant="secondary"
        />
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
  status: {
    fontFamily: 'inter',
    fontSize: 13,
    color: palette.muted,
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
