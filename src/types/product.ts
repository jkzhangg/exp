export interface Product {
  id: string;
  name?: string;
  imageUrl?: string;
  quantity: number;
  createdAt: number; // Unix timestamp
}

export interface InventoryRecord {
  id: string;
  productId: string;
  quantity: number;
  timestamp: number; // Unix timestamp
} 