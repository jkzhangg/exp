import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Theme } from '../constants/theme';
import { StorageService } from '../services/storage';
import { generateId } from '../utils/id';
import { Product } from '../types';

interface ProductFormProps {
  barcode?: string;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  barcode = '',
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [currentBarcode, setCurrentBarcode] = useState(barcode);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !currentBarcode.trim()) {
      Alert.alert('错误', '商品名称和条码不能为空');
      return;
    }

    try {
      setLoading(true);
      const newProduct: Product = {
        id: generateId(),
        name: name.trim(),
        barcode: currentBarcode.trim(),
        description: description.trim(),
        category: category.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await StorageService.saveProduct(newProduct);
      Alert.alert('成功', '商品添加成功');
      onSuccess?.();
      
      // 清空表单
      setName('');
      setDescription('');
      setCategory('');
      setCurrentBarcode('');
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('错误', '添加商品失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>商品名称 *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="请输入商品名称"
            placeholderTextColor={Theme.colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>商品条码 *</Text>
          <TextInput
            style={styles.input}
            value={currentBarcode}
            onChangeText={setCurrentBarcode}
            placeholder="请输入商品条码"
            placeholderTextColor={Theme.colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>商品分类</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="请输入商品分类"
            placeholderTextColor={Theme.colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>商品描述</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="请输入商品描述"
            placeholderTextColor={Theme.colors.secondaryText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? '添加中...' : '添加商品'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  form: {
    padding: Theme.spacing.medium,
  },
  formGroup: {
    marginBottom: Theme.spacing.medium,
  },
  label: {
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.small,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Theme.borderRadius.small,
    padding: Theme.spacing.medium,
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
    alignItems: 'center',
    marginTop: Theme.spacing.medium,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Theme.typography.body,
    fontWeight: 'bold',
  },
}); 