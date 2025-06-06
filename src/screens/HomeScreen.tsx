import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Theme } from '../constants/theme';
import { StorageService } from '../services/StorageService';
import { Product } from '../types/models';
import { ProductWithStock } from '../types';

export const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const allProducts = await StorageService.getAllProducts();
      const productsWithStock = await Promise.all(
        allProducts.map(async (product) => ({
          ...product,
          barcode: product.id,
          currentStock: await StorageService.getProductStock(product.id),
          createdAt: product.createdAt.getTime(),
          updatedAt: product.updatedAt.getTime()
        }))
      );
      setProducts(productsWithStock as ProductWithStock[]);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderItem = ({ item }: { item: ProductWithStock }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBarcode}>{item.barcode}</Text>
      </View>
      <View style={styles.stockInfo}>
        <Text style={styles.stockText}>
          库存: <Text style={styles.stockNumber}>{item.currentStock}</Text>
        </Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.colors.background,
      padding: Theme.spacing.md,
    },
    title: {
      fontSize: Theme.typography.fontSize.lg,
      color: Theme.colors.text,
      marginBottom: Theme.spacing.md,
    },
    listContainer: {
      flexGrow: 1,
    },
    productItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Theme.spacing.md,
      backgroundColor: '#fff',
      borderRadius: Theme.borderRadius.md,
      marginBottom: Theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: Theme.typography.fontSize.md,
      color: Theme.colors.text,
      marginBottom: Theme.spacing.sm / 2,
    },
    productBarcode: {
      fontSize: Theme.typography.fontSize.sm,
      color: Theme.colors.secondaryText,
    },
    stockInfo: {
      marginLeft: Theme.spacing.md,
    },
    stockText: {
      fontSize: Theme.typography.fontSize.md,
      color: Theme.colors.text,
    },
    stockNumber: {
      color: Theme.colors.primary,
      fontWeight: '700',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Theme.spacing.lg,
    },
    emptyText: {
      fontSize: Theme.typography.fontSize.md,
      color: Theme.colors.secondaryText,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>库存列表</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无商品</Text>
          </View>
        }
      />
    </View>
  );
}; 