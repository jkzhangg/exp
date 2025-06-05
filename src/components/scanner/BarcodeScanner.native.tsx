import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, BarcodeScanningResult, Camera } from 'expo-camera';
import { Theme } from '../../constants/theme';
import { BarcodeScannerProps } from './BarcodeScanner';

export function BarcodeScanner({ onScan, onError, isActive = false }: BarcodeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 请求摄像头权限
    const requestCameraPermission = useCallback(async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            setError(null);
        } catch (err) {
            console.error('[BarcodeScanner] 摄像头权限错误:', err);
            setHasPermission(false);
            setError('请授予摄像头权限以启用扫描功能');
        }
    }, []);

    // 处理扫描结果
    const handleBarCodeScanned = useCallback(({ data }: BarcodeScanningResult) => {
        if (/^\d{13}$/.test(data)) {
            console.log('[BarcodeScanner] 扫描到有效的 EAN-13:', data);
            onScan(data);
        } else {
            console.warn('[BarcodeScanner] 无效的条形码或非 EAN-13 格式');
        }
    }, [onScan]);

    // 初始化权限
    useEffect(() => {
        requestCameraPermission();
    }, [requestCameraPermission]);

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
            {isActive && hasPermission && (
                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13'],
                    }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanArea}>
                            <View style={[styles.corner, styles.cornerTL]} />
                            <View style={[styles.corner, styles.cornerTR]} />
                            <View style={[styles.corner, styles.cornerBL]} />
                            <View style={[styles.corner, styles.cornerBR]} />
                            <View style={styles.scanLine} />
                            <View style={styles.guideLine} />
                        </View>
                        <Text style={styles.tipText}>
                            请将条形码对准扫描框
                        </Text>
                    </View>
                </CameraView>
            )}
        </View>
    );
}

const SCAN_AREA_WIDTH = 300;
const SCAN_AREA_HEIGHT = SCAN_AREA_WIDTH / 1.5; // EAN-13 条形码的标准宽高比

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
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
    errorContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    retryButton: {
        backgroundColor: Theme.colors.primary,
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        marginTop: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 