import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { WebBarcodeScanner } from './WebBarcodeScanner';
import { Theme } from '../constants/theme';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: Error) => void;
  isActive?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  isActive = false,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(isActive);

  useEffect(() => {
    setIsScanning(isActive);
  }, [isActive]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (error) {
          console.error('相机权限请求失败:', error);
          onError?.(error as Error);
          setHasPermission(false);
        }
      })();
    }
  }, [onError]);

  const handleScan = (data: string) => {
    onScan(data);
  };

  const handleError = (error: Error) => {
    console.error('扫描错误:', error);
    onError?.(error);
  };

  if (hasPermission === null && Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>请求相机权限中...</Text>
      </View>
    );
  }

  if (hasPermission === false && Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>无相机访问权限</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <WebBarcodeScanner
          isActive={isScanning}
          onScan={handleScan}
          onError={handleError}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        type={CameraType.back}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.upc_a,
          ],
        }}
        onBarCodeScanned={
          isScanning
            ? (result) => handleScan(result.data)
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  text: {
    color: Theme.colors.text,
    fontSize: Theme.typography.body,
    textAlign: 'center',
  },
});

export { BarcodeScanner }; 
