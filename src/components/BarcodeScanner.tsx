import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebBarcodeScanner } from './WebBarcodeScanner';
import { NativeBarcodeScanner } from './NativeBarcodeScanner';
import { Theme } from '../constants/theme';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: Error) => void;
  isActive?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  isActive = false,
}) => {
  const [isScanning, setIsScanning] = useState(isActive);

  React.useEffect(() => {
    setIsScanning(isActive);
  }, [isActive]);

  const handleScan = (data: string) => {
    try {
      onScan(data);
    } catch (error) {
      console.error('扫描处理错误:', error);
      onError?.(error instanceof Error ? error : new Error('扫描处理失败'));
    }
  };

  const handleError = (error: Error) => {
    console.error('扫描错误:', error);
    onError?.(error);
  };

  // Web 平台使用 WebBarcodeScanner
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

  // 移动端使用 NativeBarcodeScanner
  return (
    <View style={styles.container}>
      <NativeBarcodeScanner
        isScanning={isScanning}
        onScan={handleScan}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
}); 
