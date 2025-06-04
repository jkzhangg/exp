import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity } from 'react-native';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Theme } from '../constants/theme';

interface WebBarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: Error) => void;
  isActive?: boolean;
}

declare global {
  interface Window {
    setTimeout: typeof setTimeout;
  }
}

const WebBarcodeScanner: React.FC<WebBarcodeScannerProps> = ({
  onScan,
  onError,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Camera permission error:', err);
      setHasPermission(false);
      setError('请授予摄像头权限以启用扫描功能');
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      requestCameraPermission();
    }
  }, []);

  const stopScanning = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('[WebBarcodeScanner] 停止视频轨道:', track.label);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (readerRef.current) {
      console.log('[WebBarcodeScanner] 清理扫描器');
      readerRef.current = null;
    }
  };

  const startScanning = async () => {
    if (!hasPermission || !isActive) return;
    setIsScanning(true);

    try {
      if (!videoRef.current || typeof window === 'undefined' || !window.navigator?.mediaDevices?.getUserMedia) {
        throw new Error('浏览器不支持视频设备');
      }

      // 创建扫描器实例
      console.log('[WebBarcodeScanner] 创建 BrowserMultiFormatReader 实例');
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      // 请求摄像头权限
      console.log('[WebBarcodeScanner] 请求摄像头权限...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;

      // 设置视频源
      videoRef.current.srcObject = stream;
      console.log('[WebBarcodeScanner] 设置视频源完成');

      // 等待视频加载
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            console.log('[WebBarcodeScanner] 视频元数据加载完成');
            resolve();
          };
        }
      });

      // 播放视频
      await videoRef.current.play();
      console.log('[WebBarcodeScanner] 视频开始播放');

      // 开始扫描
      console.log('[WebBarcodeScanner] 开始扫描');
      await reader.decodeFromStream(
        stream,
        videoRef.current,
        (result) => {
          if (result && isActive) {
            console.log('[WebBarcodeScanner] 扫描成功:', result.getText());
            onScan(result.getText());
            stopScanning(); // 扫描成功后停止
          }
        }
      );

      setIsInitialized(true);
      setError(null);
    } catch (error) {
      console.error('[WebBarcodeScanner] 初始化失败:', error);
      setError('初始化摄像头失败，请重试');
      onError?.(error as Error);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      stopScanning();
    }
  }, [isActive]);

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
            setIsInitialized(false);
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
      </View>
      {!isScanning && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={startScanning}
        >
          <Text style={styles.scanButtonText}>开始扫描</Text>
        </TouchableOpacity>
      )}
      {isScanning && (
        <TouchableOpacity
          style={[styles.scanButton, styles.stopButton]}
          onPress={stopScanning}
        >
          <Text style={styles.scanButtonText}>停止扫描</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
});

export { WebBarcodeScanner }; 