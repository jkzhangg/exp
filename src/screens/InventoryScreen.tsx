import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { InventoryList } from '../components/InventoryList';
import { StockInForm } from '../components/StockInForm';
import { StorageService } from '../services/StorageService';
import { Product } from '../types/models';
import { Theme } from '../constants/theme';

export const InventoryScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showStockInForm, setShowStockInForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const loadProducts = async () => {
        try {
            const data = await StorageService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('加载库存失败:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setShowStockInForm(true);
    };

    const handleCloseForm = () => {
        setShowStockInForm(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <View style={styles.container}>
            <InventoryList
                products={products}
                onProductSelect={handleProductSelect}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />

            <Modal
                visible={showStockInForm}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseForm}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>修改库存</Text>
                            <TouchableOpacity
                                onPress={handleCloseForm}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>关闭</Text>
                            </TouchableOpacity>
                        </View>
                        <StockInForm
                            onSuccess={() => {
                                handleCloseForm();
                                loadProducts();
                            }}
                            selectedProduct={selectedProduct}
                            mode="edit"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Theme.colors.background,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
    },
    modalTitle: {
        fontSize: Theme.typography.fontSize.lg,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    closeButton: {
        padding: Theme.spacing.sm,
    },
    closeButtonText: {
        color: Theme.colors.primary,
        fontSize: Theme.typography.fontSize.md,
    },
}); 