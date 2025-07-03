import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';

const CameraCapture = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const cameraRef = useRef<Camera | null>(null);
  const router = useRouter();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImages(prev => [...prev, photo.uri]);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const proceed = () => {
    router.push({ pathname: '/(pages)/reviewColors', params: { images: JSON.stringify(capturedImages) } });
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.captureText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ color: 'green', fontSize: 24, textAlign: 'center' }}>CameraCapture</Text>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={(ref) => {
          cameraRef.current = ref;
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Capture face {capturedImages.length + 1} of 6</Text>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={capturedImages.length >= 6}
        >
          <Text style={styles.captureText}>📸 Capture</Text>
        </TouchableOpacity>
        {capturedImages.length === 6 && (
          <TouchableOpacity style={styles.proceedButton} onPress={proceed}>
            <Text style={styles.captureText}>✅ Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CameraCapture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  captureText: {
    fontSize: 18,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
