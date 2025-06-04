export interface Product {
  id: string;
  name: string;
  barcode: string;
  description?: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
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