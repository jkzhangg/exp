export interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onError?: (error: Error) => void;
    isActive?: boolean;
}

// 这个文件只导出接口定义，具体实现在 .web.tsx 和 .native.tsx 中

// 导出平台特定的实现
export { BarcodeScanner } from './BarcodeScanner.web'; 