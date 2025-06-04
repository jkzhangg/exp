import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Theme } from '../constants/theme';

const ScanScreen: React.FC = () => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanActive, setScanActive] = useState(true);

  const handleScan = useCallback((barcode: string) => {
    console.log('扫描到条码:', barcode);
    setScanActive(false);
    Alert.alert(
      '扫描成功',
      `条码: ${barcode}`,
      [
        {
          text: '继续扫描',
          onPress: () => setScanActive(true),
        },
        {
          text: '确认',
          onPress: () => {
            // TODO: 处理扫描结果
            console.log('确认扫描结果:', barcode);
          },
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('扫描错误:', error);
    Alert.alert(
      '扫描错误',
      Platform.OS === 'web' 
        ? '请确保已授予摄像头权限，并尝试刷新页面。'
        : '是否切换到手动输入？',
      Platform.OS === 'web'
        ? [
            {
              text: '确定',
              onPress: () => setScanActive(true),
            }
          ]
        : [
            {
              text: '重试',
              onPress: () => setScanActive(true),
            },
            {
              text: '手动输入',
              onPress: () => {
                setScanActive(false);
                setShowManualInput(true);
              },
              style: 'default',
            },
          ],
      { cancelable: false }
    );
  }, []);

  const handleManualSubmit = useCallback(() => {
    if (manualBarcode.trim()) {
      handleScan(manualBarcode.trim());
      setManualBarcode('');
      setShowManualInput(false);
    }
  }, [manualBarcode, handleScan]);

  const handleReset = useCallback(() => {
    setScanActive(true);
    setShowManualInput(false);
  }, []);

  if (showManualInput) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>手动输入条码</Text>
        <TextInput
          style={styles.input}
          value={manualBarcode}
          onChangeText={setManualBarcode}
          placeholder="请输入商品条码"
          placeholderTextColor={Theme.colors.secondaryText}
          keyboardType="number-pad"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleManualSubmit}
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              setShowManualInput(false);
              setScanActive(true);
            }}
          >
            <Text style={styles.secondaryButtonText}>返回扫描</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleManualSubmit}
          >
            <Text style={styles.buttonText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ErrorBoundary onReset={handleReset}>
        <BarcodeScanner
          isActive={scanActive}
          onScan={handleScan}
          onError={handleError}
        />
      </ErrorBoundary>
      {Platform.OS === 'web' && (
        <View style={styles.webTips}>
          <Text style={styles.webTipsText}>
            提示：请确保已授予摄像头权限。如果看不到摄像头画面，请尝试刷新页面。
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.manualButton}
        onPress={() => {
          setScanActive(false);
          setShowManualInput(true);
        }}
      >
        <Text style={styles.manualButtonText}>手动输入</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.title,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.large,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: Theme.borderRadius.small,
    padding: Theme.spacing.medium,
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.medium,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.spacing.medium,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
    minWidth: 120,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.typography.body,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.body,
    fontWeight: 'bold',
  },
  manualButton: {
    position: 'absolute',
    bottom: Theme.spacing.large,
    right: Theme.spacing.medium,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: Theme.typography.body,
  },
  webTips: {
    position: 'absolute',
    top: Theme.spacing.medium,
    left: Theme.spacing.medium,
    right: Theme.spacing.medium,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
  },
  webTipsText: {
    color: '#fff',
    fontSize: Theme.typography.caption,
    textAlign: 'center',
  },
});

export { ScanScreen }; 