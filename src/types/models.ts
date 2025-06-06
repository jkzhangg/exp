/**
 * 商品模型
 */
export interface Product {
  id: string;          // 商品ID/条形码
  name?: string;       // 商品名称
  imageUrl?: string;   // 商品图片URL
  description?: string;// 商品描述
  category?: string;   // 商品分类
  quantity: number;    // 库存数量
  createdAt: number;   // 创建时间（时间戳）
  updatedAt: number;   // 更新时间（时间戳）
}

/**
 * 库存记录模型
 */
export interface InventoryRecord {
  id: string;          // 记录ID
  productId: string;   // 商品ID
  quantity: number;    // 变动数量
  type: 'in' | 'out' | 'edit'; // 变动类型：入库/出库/修改
  note?: string;       // 备注
  timestamp: number;   // 记录时间（时间戳）
}

/**
 * 带库存信息的商品模型
 */
export interface ProductWithStock extends Product {
  currentStock: number;// 当前库存
} 