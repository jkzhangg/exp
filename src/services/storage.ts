import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, InventoryRecord } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: '@inventory:products',
  INVENTORY_RECORDS: '@inventory:records',
};

export class StorageService {
  // 产品相关操作
  static async saveProduct(product: Product): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const updatedProducts = [...products, product];
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    try {
      const productsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  static async updateProduct(updatedProduct: Product): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // 库存记录相关操作
  static async saveInventoryRecord(record: InventoryRecord): Promise<void> {
    try {
      const records = await this.getAllInventoryRecords();
      const updatedRecords = [...records, record];
      await AsyncStorage.setItem(
        STORAGE_KEYS.INVENTORY_RECORDS,
        JSON.stringify(updatedRecords)
      );
    } catch (error) {
      console.error('Error saving inventory record:', error);
      throw error;
    }
  }

  static async getAllInventoryRecords(): Promise<InventoryRecord[]> {
    try {
      const recordsJson = await AsyncStorage.getItem(
        STORAGE_KEYS.INVENTORY_RECORDS
      );
      return recordsJson ? JSON.parse(recordsJson) : [];
    } catch (error) {
      console.error('Error getting inventory records:', error);
      return [];
    }
  }

  static async getProductStock(productId: string): Promise<number> {
    try {
      const records = await this.getAllInventoryRecords();
      const productRecords = records.filter(
        (record) => record.productId === productId
      );
      
      return productRecords.reduce((total, record) => {
        return total + (record.type === 'in' ? record.quantity : -record.quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating product stock:', error);
      return 0;
    }
  }

  // 数据迁移和版本控制
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PRODUCTS,
        STORAGE_KEYS.INVENTORY_RECORDS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
} 