/**
 * 商品模型
 */
export interface Product {
  id: string;          // 条形码
  name?: string;       // 商品名称
  imageUrl?: string;   // 商品图片URL
  quantity: number;    // 库存数量
  createdAt: Date;     // 创建时间
}

/**
 * 库存记录模型
 */
export interface InventoryRecord {
  id: string;          // 记录ID
  productId: string;   // 商品ID
  quantity: number;    // 变动数量
  timestamp: Date;     // 记录时间
} 