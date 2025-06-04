import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Theme } from '../constants/theme';
import { StorageService } from '../services/storage';
import { Product, ProductWithStock } from '../types';

export const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const allProducts = await StorageService.getAllProducts();
      const productsWithStock = await Promise.all(
        allProducts.map(async (product) => ({
          ...product,
          currentStock: await StorageService.getProductStock(product.id),
        }))
      );
      setProducts(productsWithStock);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.medium,
  },
  title: {
    fontSize: Theme.typography.title,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.medium,
  },
  listContainer: {
    flexGrow: 1,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.medium,
    backgroundColor: '#fff',
    borderRadius: Theme.borderRadius.medium,
    marginBottom: Theme.spacing.small,
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
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.small / 2,
  },
  productBarcode: {
    fontSize: Theme.typography.caption,
    color: Theme.colors.secondaryText,
  },
  stockInfo: {
    marginLeft: Theme.spacing.medium,
  },
  stockText: {
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
  },
  stockNumber: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.large,
  },
  emptyText: {
    fontSize: Theme.typography.body,
    color: Theme.colors.secondaryText,
  },
}); 