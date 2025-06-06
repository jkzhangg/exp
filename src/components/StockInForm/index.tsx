import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { StorageService } from '../../services/StorageService';
import { Theme } from '../../constants/theme';
import { Product } from '../../types/models';

interface StockInFormProps {
    onSuccess?: () => void;
    selectedProduct?: Product | null;
    mode?: 'add' | 'edit';
}

export const StockInForm: React.FC<StockInFormProps> = ({
    onSuccess,
    selectedProduct,
    mode = 'add'
}) => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            setProductId(selectedProduct.id);
        }
    }, [selectedProduct]);

    const handleSubmit = async () => {
        if (!productId || !quantity) {
            Alert.alert('错误', '请填写商品ID和数量');
            return;
        }

        const quantityNum = parseInt(quantity, 10);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            Alert.alert('错误', '请输入有效的数量');
            return;
        }

        try {
            setIsSubmitting(true);
            const product = await StorageService.getProduct(productId);

            if (product) {
                if (mode === 'edit') {
                    // 修改模式：直接设置新数量
                    await StorageService.updateProduct({
                        ...product,
                        quantity: quantityNum,
                        updatedAt: Date.now()
                    });
                } else {
                    // 入库模式：增加数量
                    await StorageService.updateProduct({
                        ...product,
                        quantity: product.quantity + quantityNum,
                        updatedAt: Date.now()
                    });
                }
            } else if (mode === 'add') {
                // 只有入库模式才允许创建新商品
                await StorageService.saveProduct({
                    id: productId,
                    quantity: quantityNum,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
            } else {
                throw new Error('商品不存在');
            }

            await StorageService.addInventoryRecord({
                id: Date.now().toString(),
                productId,
                quantity: quantityNum,
                type: mode === 'add' ? 'in' : 'edit',
                timestamp: Date.now()
            });

            Alert.alert('成功', mode === 'add' ? '入库操作已完成' : '库存已更新');
            onSuccess?.();
            setProductId('');
            setQuantity('');
        } catch (error) {
            Alert.alert('错误', error instanceof Error ? error.message : '操作失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {mode === 'add' ? '商品入库' : '修改库存'}
            </Text>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>商品ID</Text>
                    <TextInput
                        style={[
                            styles.input,
                            mode === 'edit' && styles.inputDisabled
                        ]}
                        value={productId}
                        onChangeText={setProductId}
                        placeholder="请输入商品ID"
                        editable={!isSubmitting && mode !== 'edit'}
                        placeholderTextColor={Theme.colors.secondaryText}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        {mode === 'add' ? '入库数量' : '当前库存'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={quantity}
                        onChangeText={setQuantity}
                        placeholder={mode === 'add' ? "请输入入库数量" : "请输入库存数量"}
                        keyboardType="numeric"
                        editable={!isSubmitting}
                        placeholderTextColor={Theme.colors.secondaryText}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? '处理中...' : (mode === 'add' ? '确认入库' : '更新库存')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
    },
    title: {
        fontSize: Theme.typography.fontSize.lg,
        fontWeight: '600',
        marginBottom: Theme.spacing.md,
        color: Theme.colors.text,
    },
    form: {
        backgroundColor: Theme.colors.background,
    },
    inputContainer: {
        marginBottom: Theme.spacing.md,
    },
    label: {
        fontSize: Theme.typography.fontSize.sm,
        color: Theme.colors.text,
        marginBottom: Theme.spacing.sm,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.borderRadius.md,
        paddingHorizontal: Theme.spacing.md,
        color: Theme.colors.text,
        backgroundColor: Theme.colors.background,
    },
    inputDisabled: {
        backgroundColor: Theme.colors.border,
        color: Theme.colors.secondaryText,
    },
    submitButton: {
        backgroundColor: Theme.colors.primary,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.md,
        alignItems: 'center',
        marginTop: Theme.spacing.md,
    },
    submitButtonDisabled: {
        backgroundColor: Theme.colors.secondaryText,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: Theme.typography.fontSize.md,
        fontWeight: '500',
    },
}); 