import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, InventoryRecord } from '../types/models';
import { getAvailableStorage } from '../utils/helpers';

const STORAGE_KEYS = {
  PRODUCTS: 'products',
  INVENTORY_RECORDS: 'inventory_records',
  BACKUP: 'backup',
  LAST_BACKUP_DATE: 'last_backup_date'
};

// 最小可用存储空间（10MB）
const MIN_STORAGE_SPACE = 10 * 1024 * 1024;

/**
 * 存储服务类
 */
export class StorageService {
  /**
   * 保存商品信息
   */
  static async saveProduct(product: Product): Promise<void> {
    // 检查存储空间
    if (!(await this.checkStorageSpace())) {
      throw new Error('存储空间不足');
    }

    try {
      const products = await this.getAllProducts();
      const existingIndex = products.findIndex(p => p.id === product.id);
      
      if (existingIndex >= 0) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('保存商品失败:', error);
      throw new Error('保存商品失败');
    }
  }

  /**
   * 获取单个商品信息
   */
  static async getProduct(id: string): Promise<Product | null> {
    try {
      const products = await this.getAllProducts();
      return products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('获取商品失败:', error);
      throw new Error('获取商品失败');
    }
  }

  /**
   * 更新商品信息
   */
  static async updateProduct(product: Product): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const index = products.findIndex(p => p.id === product.id);
      
      if (index === -1) {
        throw new Error('商品不存在');
      }

      products[index] = product;
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('更新商品失败:', error);
      throw new Error('更新商品失败');
    }
  }

  /**
   * 获取所有商品
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取所有商品失败:', error);
      throw new Error('获取所有商品失败');
    }
  }

  /**
   * 添加库存记录
   */
  static async addInventoryRecord(record: InventoryRecord): Promise<void> {
    // 检查存储空间
    if (!(await this.checkStorageSpace())) {
      throw new Error('存储空间不足');
    }

    try {
      const records = await this.getInventoryRecords();
      records.push(record);
      await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY_RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('添加库存记录失败:', error);
      throw new Error('添加库存记录失败');
    }
  }

  /**
   * 获取所有库存记录
   */
  static async getInventoryRecords(): Promise<InventoryRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取库存记录失败:', error);
      throw new Error('获取库存记录失败');
    }
  }

  /**
   * 清理过期数据
   */
  static async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    try {
      const now = new Date();
      const records = await this.getInventoryRecords();
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        const diffTime = Math.abs(now.getTime() - recordDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysToKeep;
      });

      await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY_RECORDS, JSON.stringify(filteredRecords));
    } catch (error) {
      console.error('清理数据失败:', error);
      throw new Error('清理数据失败');
    }
  }

  /**
   * 检查存储空间是否足够
   */
  private static async checkStorageSpace(): Promise<boolean> {
    const availableSpace = await getAvailableStorage();
    return availableSpace > MIN_STORAGE_SPACE;
  }

  /**
   * 创建数据备份
   */
  static async createBackup(): Promise<void> {
    try {
      // 检查存储空间
      if (!(await this.checkStorageSpace())) {
        throw new Error('存储空间不足');
      }

      // 获取所有数据
      const products = await this.getAllProducts();
      const records = await this.getInventoryRecords();

      // 创建备份对象
      const backup = {
        products,
        records,
        timestamp: new Date().toISOString()
      };

      // 保存备份
      await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_BACKUP_DATE, new Date().toISOString());
    } catch (error) {
      console.error('创建备份失败:', error);
      throw new Error('创建备份失败');
    }
  }

  /**
   * 从备份恢复数据
   */
  static async restoreFromBackup(): Promise<void> {
    try {
      // 获取备份数据
      const backupJson = await AsyncStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backupJson) {
        throw new Error('没有可用的备份');
      }

      const backup = JSON.parse(backupJson);

      // 恢复数据
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(backup.products));
      await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY_RECORDS, JSON.stringify(backup.records));
    } catch (error) {
      console.error('恢复备份失败:', error);
      throw new Error('恢复备份失败');
    }
  }

  /**
   * 获取上次备份时间
   */
  static async getLastBackupDate(): Promise<Date | null> {
    try {
      const dateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_BACKUP_DATE);
      return dateStr ? new Date(dateStr) : null;
    } catch (error) {
      console.error('获取上次备份时间失败:', error);
      return null;
    }
  }

  /**
   * 检查是否需要备份（超过24小时未备份）
   */
  static async shouldBackup(): Promise<boolean> {
    const lastBackup = await this.getLastBackupDate();
    if (!lastBackup) return true;

    const now = new Date();
    const timeDiff = now.getTime() - lastBackup.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= 24;
  }
} 