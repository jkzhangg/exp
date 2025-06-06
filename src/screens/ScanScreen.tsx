import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarcodeScanner } from '../components/scanner/BarcodeScanner';
import { StockInForm } from '../components/StockInForm';
import { Theme } from '../constants/theme';
import { useIsFocused } from '@react-navigation/native';
import { Product } from '../types/models';

export const ScanScreen: React.FC = () => {
  const [scanned, setScanned] = useState(false);
  const [productId, setProductId] = useState('');
  const isFocused = useIsFocused();

  // 监听扫描状态变化
  useEffect(() => {
    console.log('[ScanScreen] 扫描状态变化', { scanned });
  }, [scanned]);

  const handleBarCodeScanned = (data: string) => {
    if (scanned) return;
    console.log('[ScanScreen] 处理扫描结果', { data });
    setScanned(true);
    setProductId(data);
  };

  const handleStockInSuccess = () => {
    setScanned(false);
    setProductId('');
  };

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarcodeScanner
          onScan={handleBarCodeScanned}
          isActive={!scanned}
          onError={(error: Error) => {
            console.error('扫描错误:', error);
          }}
        />
      </View>

      <View style={styles.formContainer}>
        <StockInForm
          onSuccess={handleStockInSuccess}
          selectedProduct={productId ? {
            id: productId,
            quantity: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
          } : null}
          mode="add"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  formContainer: {
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
}); 
