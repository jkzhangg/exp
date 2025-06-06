import { Product as BaseProduct } from './models';

export interface Product extends BaseProduct {
  barcode: string;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  quantity: number;
  type: 'in' | 'out';
  note?: string;
  createdAt: number;
}

export interface ProductWithStock extends Product {
  currentStock: number;
} 