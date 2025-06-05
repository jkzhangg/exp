import { Platform, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';

export const openSettings = async () => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('打开设置失败:', error);
  }
}; 