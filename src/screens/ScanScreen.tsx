import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { BarcodeScanner as BarcodeScannerComponent } from '../components/scanner/BarcodeScanner';
import { StorageService } from '../services/StorageService';
import { generateId } from '../utils/helpers';
import { Theme } from '../constants/theme';

export const ScanScreen: React.FC = () => {
  const [scanned, setScanned] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleBarCodeScanned = (data: string) => {
    if (scanned) return;
    setScanned(true);
    setProductId(data);
  };

  const handleSubmit = async () => {
    try {
      if (!productId) {
        Alert.alert('错误', '请先扫描商品或输入商品ID');
        return;
      }

      const quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        Alert.alert('错误', '请输入有效的数量');
        return;
      }

      const product = await StorageService.getProduct(productId);

      if (product) {
        // 更新现有商品
        await StorageService.updateProduct({
          ...product,
          quantity: product.quantity + quantityNum,
        });
      } else {
        // 添加新商品
        await StorageService.saveProduct({
          id: productId,
          quantity: quantityNum,
          createdAt: new Date(),
        });
      }

      // 添加入库记录
      await StorageService.addInventoryRecord({
        id: generateId(),
        productId,
        quantity: quantityNum,
        timestamp: new Date(),
      });

      Alert.alert('成功', '商品入库成功', [
        {
          text: '继续扫描',
          onPress: () => {
            setScanned(false);
            setProductId('');
            setQuantity('1');
          },
        },
      ]);
    } catch (error) {
      console.error('入库失败:', error);
      Alert.alert('错误', '入库失败，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarcodeScannerComponent
          onScan={handleBarCodeScanned}
          isActive={!scanned}
          onError={(error: Error) => {
            console.error('扫描错误:', error);
            Alert.alert('错误', '扫描失败，请重试');
          }}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>商品ID：</Text>
          <TextInput
            style={styles.input}
            value={productId}
            onChangeText={setProductId}
            placeholder="扫描或输入商品ID"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>数量：</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="输入数量"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!productId}
        >
          <Text style={styles.submitButtonText}>
            入库
          </Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>
              重新扫描
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rescanButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  rescanButtonText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
