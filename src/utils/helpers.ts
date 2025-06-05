/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 格式化日期为 YYYY-MM-DD HH:mm:ss 格式
 */
export const formatDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 获取当前设备的可用存储空间（以字节为单位）
 */
export const getAvailableStorage = async (): Promise<number> => {
  try {
    // 注意：这是一个模拟实现，实际项目中需要根据平台使用特定的API
    // 例如在 React Native 中可以使用 react-native-device-info
    return Number.MAX_SAFE_INTEGER;
  } catch (error) {
    console.error('获取存储空间失败:', error);
    return 0;
  }
}; 