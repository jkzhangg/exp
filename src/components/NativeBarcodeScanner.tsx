import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  Platform,
  Linking,
  View,
  ActivityIndicator,
  Text
} from 'react-native';
import { CameraView } from 'expo-camera';
import { ScannerOverlay } from './ScannerOverlay';

interface NativeBarcodeScannerProps {
  onScan: (barcode: string) => void;
  isScanning: boolean;
  onError?: (error: Error) => void;
}

export const NativeBarcodeScanner: React.FC<NativeBarcodeScannerProps> = ({
  onScan,
  isScanning,
  onError,
}) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const handleCameraReady = useCallback(() => {
    console.log('相机准备就绪');
    setIsCameraReady(true);
    setIsLoading(false);
  }, []);

  const handleMountError = useCallback((event: any) => {
    console.error('相机加载错误:', event);
    setIsLoading(false);
    onError?.(new Error(event.message || '相机加载失败'));
    Alert.alert(
      '相机错误',
      '无法启动相机，请检查设备是否正常。',
      [{ text: '确定' }]
    );
  }, [onError]);

  const handleBarCodeScanned = useCallback((result: { data: string }) => {
    try {
      // 防止重复扫描同一个条码
      if (lastScannedCode === result.data && Date.now() - scanCount < 2000) {
        return;
      }

      console.log('扫描到条码:', result);
      setLastScannedCode(result.data);
      setScanCount(Date.now());
      onScan(result.data);
    } catch (error) {
      console.error('扫描处理错误:', error);
      onError?.(error instanceof Error ? error : new Error('扫描处理失败'));
    }
  }, [onScan, onError, lastScannedCode, scanCount]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>正在初始化相机...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={[StyleSheet.absoluteFill, styles.camera]}
        facing="back"
        onCameraReady={handleCameraReady}
        onMountError={handleMountError}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_e', 'upc_a', 'code128', 'code39'],
        }}
        onBarcodeScanned={isScanning && isCameraReady ? handleBarCodeScanned : undefined}
      />
      <ScannerOverlay isScanning={isScanning && isCameraReady} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 