import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface ScannerOverlayProps {
  isScanning: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isScanning }) => {
  return (
    <View style={styles.container}>
      {/* 上方遮罩 */}
      <View style={styles.overlayTop} />

      <View style={styles.centerRow}>
        {/* 左侧遮罩 */}
        <View style={styles.overlaySide} />

        {/* 扫描框 */}
        <View style={[
          styles.scanFrame,
          isScanning && styles.scanFrameActive
        ]}>
          {/* 扫描框四角 */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        {/* 右侧遮罩 */}
        <View style={styles.overlaySide} />
      </View>

      {/* 下方遮罩 */}
      <View style={styles.overlayBottom} />
    </View>
  );
};

const WINDOW_WIDTH = Dimensions.get('window').width;
const SCAN_FRAME_SIZE = WINDOW_WIDTH * 0.7;
const CORNER_SIZE = 20;
const CORNER_WIDTH = 4;
const CORNER_COLOR = '#00ff00';
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  centerRow: {
    flexDirection: 'row',
    height: SCAN_FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanFrameActive: {
    borderColor: CORNER_COLOR,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: CORNER_COLOR,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: CORNER_COLOR,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: CORNER_COLOR,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: CORNER_COLOR,
  },
}); 