import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Theme } from '../constants/theme';

interface PermissionStatusProps {
  status: 'loading' | 'denied';
}

export const PermissionStatus: React.FC<PermissionStatusProps> = ({ status }) => {
  return (
    <View style={styles.container}>
      {status === 'loading' ? (
        <>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.text}>正在请求相机权限...</Text>
        </>
      ) : (
        <Text style={styles.text}>请在设置中允许应用访问相机</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  text: {
    marginTop: Theme.spacing.md,
    color: Theme.colors.text,
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
  },
}); 