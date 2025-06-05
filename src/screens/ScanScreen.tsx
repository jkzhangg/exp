import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Platform, Dimensions, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { BarCodeScanner } from 'expo-barcode-scanner';

// 条形码类型说明
const BARCODE_TYPES = {
  [BarCodeScanner.Constants.BarCodeType.ean13]: {
    name: 'EAN-13',
    description: '13位标准商品条码，常见于零售商品',
    example: '6901234567892',
  },
  [BarCodeScanner.Constants.BarCodeType.ean8]: {
    name: 'EAN-8',
    description: '8位商品条码，用于小包装商品',
    example: '69123456',
  },
  [BarCodeScanner.Constants.BarCodeType.upc_a]: {
    name: 'UPC-A',
    description: '12位通用商品条码，主要用于北美',
    example: '123456789012',
  },
  [BarCodeScanner.Constants.BarCodeType.code128]: {
    name: 'Code 128',
    description: '高密度字母数字条码',
    example: 'ABC-123456',
  },
};

export const ScanScreen: React.FC = () => {
  const [scaning, setScaning] = useState(false);
  const [productId, setProductId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleBarCodeScanned = useCallback(async (data: string) => {
    console.log('扫描回调被触发');
    console.log('扫描数据:', data);

    try {
      // 防止重复扫描
      if (lastScanned === data) {
        console.log('跳过重复扫描:', data);
        return;
      }
      
      const debugMessage = `
扫描数据: ${data}
时间: ${new Date().toLocaleTimeString()}
      `.trim();
      
      console.log('处理成功，更新界面...');
      console.log(debugMessage);
      
      setDebugInfo(debugMessage);
      setLastScanned(data);
      setScaning(true);
      setProductId(data);
      setIsCameraActive(false);
      setScanError('');
      
      console.log('扫描处理完成');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('扫描处理错误:', errorMessage);
      setScanError('扫描处理失败');
      setDebugInfo('扫描处理失败: ' + errorMessage);
    }
  }, [lastScanned]);

  const handleScanError = useCallback((error: Error) => {
    console.error('扫描错误:', error);
    setScanError('扫描出错');
    setDebugInfo('扫描错误: ' + error.message);
  }, []);

  const handleRescan = useCallback((id: string) => {
    console.log('扫描结果:', id);
    setProductId(id);
    setScaning(false);
    setIsCameraActive(true);
    setLastScanned('');
    setScanError('');
  }, []);

  const handleSubmit = useCallback(() => {
    // TODO: 处理提交逻辑
    console.log('提交商品ID:', productId);
  }, [productId]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.cameraContainer}>
        {isCameraActive && (
          <BarcodeScanner
            isActive={scaning}
            onScan={handleRescan}
          />
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScaning(true)}
        >
          <Text style={styles.buttonText}>
            {scaning ? '正在扫描...' : '开始扫描'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={productId}
            onChangeText={setProductId}
            placeholder="商品编码"
            placeholderTextColor="#666"
            keyboardType="default"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !productId && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!productId}
        >
          <Text style={styles.buttonText}>入库</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelp(true)}
        >
          <Text style={styles.buttonText}>条码类型说明</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showHelp}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>支持的条形码类型</Text>
            <ScrollView style={styles.modalScroll}>
              {Object.entries(BARCODE_TYPES).map(([type, info]) => (
                <View key={type} style={styles.barcodeTypeItem}>
                  <Text style={styles.barcodeTypeName}>{info.name}</Text>
                  <Text style={styles.barcodeTypeDesc}>{info.description}</Text>
                  <Text style={styles.barcodeTypeExample}>示例: {info.example}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.buttonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CORNER_SIZE = 30;
const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = Math.min(width * 0.8, 300);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 16/9,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  controlsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scanButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 3,
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  helpButton: {
    width: '80%',
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: '80%',
  },
  barcodeTypeItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  barcodeTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  barcodeTypeDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  barcodeTypeExample: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default ScanScreen; 
