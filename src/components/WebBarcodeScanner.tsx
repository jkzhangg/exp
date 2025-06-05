import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BrowserMultiFormatOneDReader, IScannerControls } from '@zxing/browser';
import { Result, BarcodeFormat, Exception } from '@zxing/library';
import { Theme } from '../constants/theme';

interface WebBarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: Error) => void;
  isActive?: boolean;
}

interface ScannerControls {
  stop: () => void;
}

declare global {
  interface Window {
    setTimeout: typeof setTimeout;
  }
}

// EAN-13 条形码的标准尺寸比例
const EAN13_ASPECT_RATIO = 1.5; // 宽高比
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_AREA_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 300);
const SCAN_AREA_HEIGHT = SCAN_AREA_WIDTH / EAN13_ASPECT_RATIO;

const WebBarcodeScanner: React.FC<WebBarcodeScannerProps> = ({
  onScan,
  onError,
  isActive = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatOneDReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 处理扫描结果
  const handleScanResult = useCallback((result: Result) => {
    const format = result.getBarcodeFormat();
    const text = result.getText();

    // 验证是否为有效的 EAN-13
    if (format === BarcodeFormat.EAN_13 && /^\d{13}$/.test(text)) {
      console.log('[WebBarcodeScanner] 扫描到有效的 EAN-13:', {
        code: text,
        format: 'EAN-13',
        timestamp: new Date().toISOString()
      });
      onScan(text);
    } else {
      console.warn('[WebBarcodeScanner] 无效的条形码或非 EAN-13 格式:', {
        text,
        format,
        isEAN13: format === BarcodeFormat.EAN_13,
        isValidLength: /^\d{13}$/.test(text)
      });
    }
  }, [onScan]);

  // 初始化扫描器
  const initializeReader = useCallback(() => {
    if (!readerRef.current) {
      console.log('[WebBarcodeScanner] 创建扫描器实例');
      const reader = new BrowserMultiFormatOneDReader();
      readerRef.current = reader;
    }
  }, []);

  // 清理资源
  const cleanup = useCallback(() => {
    console.log('[WebBarcodeScanner] 清理资源');

    // 停止视频流
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 清理视频元素
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 清理扫描器
    if (readerRef.current) {
      readerRef.current = null;
    }
  }, []);

  // 初始化视频流
  const initializeVideo = useCallback(async () => {
    try {
      if (!videoRef.current || !readerRef.current) {
        throw new Error('视频元素未就绪');
      }

      console.log('[WebBarcodeScanner] 请求视频流');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      readerRef.current.decodeFromStream(stream, videoRef.current, (result: Result | undefined, error: Exception | undefined, controls: IScannerControls) => {
        console.log(result);
        if(result) {
          handleScanResult(result);
        }
      })
    } catch (error) {
      console.error('[WebBarcodeScanner] 初始化视频失败:', error);
      setError('初始化摄像头失败，请重试');
      onError?.(error instanceof Error ? error : new Error(String(error)));
      cleanup();
    }
  }, [readerRef.current, cleanup, onError]);

  // 请求摄像头权限
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('[WebBarcodeScanner] 摄像头权限错误:', err);
      setHasPermission(false);
      setError('请授予摄像头权限以启用扫描功能');
    }
  }, []);

  // 启动扫描
  const startScanning = useCallback(async () => {
    initializeReader();
    await initializeVideo();
  }, [initializeReader, initializeVideo]);

  // 初始化权限
  useEffect(() => {
    if (Platform.OS === 'web') {
      requestCameraPermission();
    }
    return cleanup;
  }, [requestCameraPermission, cleanup]);

  useEffect(() => {
    if (isActive && hasPermission) {
      startScanning();
    }
  }, [isActive, hasPermission]);

  // 监听扫描状态变化
  // useEffect(() => {
  //   if (isScanning && isVideoReady) {
  //     console.log('[WebBarcodeScanner] 开始扫描');
  //     performScan();
  //   }
  // }, [isScanning, isVideoReady, performScan]);

  if (Platform.OS !== 'web') {
    return null;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            requestCameraPermission();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>请授予摄像头权限以启用扫描功能</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.retryButtonText}>授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <div style={styles.videoWrapper as any}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            autoPlay
            playsInline
            muted
          />
        </div>
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            {/* 扫描区域的四个角 */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* 扫描线 */}
            <View style={styles.scanLine} />

            {/* 辅助线 */}
            <View style={styles.guideLine} />
          </View>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <Text style={styles.tipText}>
            请将条形码对准扫描框
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  videoContainer: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_WIDTH,
    height: SCAN_AREA_HEIGHT,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Theme.colors.primary,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: '100%',
    height: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.8,
  },
  guideLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 1,
    height: '100%',
    backgroundColor: Theme.colors.primary,
    opacity: 0.3,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
  },
  tipText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
  },
  scanButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)' as any,
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { WebBarcodeScanner }; 
