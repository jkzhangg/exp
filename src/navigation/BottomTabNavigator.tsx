import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InventoryScreen } from '../screens/InventoryScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.secondaryText,
        tabBarStyle: {
          borderTopColor: Theme.colors.border,
          backgroundColor: Theme.colors.background,
        },
        headerStyle: {
          backgroundColor: Theme.colors.background,
        },
        headerTintColor: Theme.colors.text,
      }}
      screenListeners={{
        state: (e) => {
          console.log('[Navigation] 导航状态变化', {
            type: e.type,
            currentRoute: e.data?.state?.routes[e.data?.state?.index],
            timestamp: new Date().toISOString()
          });
        },
        focus: (e) => {
          console.log('[Navigation] 页面获得焦点', {
            target: e.target,
            timestamp: new Date().toISOString()
          });
        },
        blur: (e) => {
          console.log('[Navigation] 页面失去焦点', {
            target: e.target,
            timestamp: new Date().toISOString()
          });
        }
      }}
    >
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: '库存',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
        listeners={{
          focus: () => {
            console.log('[Navigation] 库存页面获得焦点');
          },
          blur: () => {
            console.log('[Navigation] 库存页面失去焦点');
          }
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: '扫描',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
        }}
        listeners={{
          focus: () => {
            console.log('[Navigation] 扫描页面获得焦点');
          },
          blur: () => {
            console.log('[Navigation] 扫描页面失去焦点');
          }
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
        listeners={{
          focus: () => {
            console.log('[Navigation] 设置页面获得焦点');
          },
          blur: () => {
            console.log('[Navigation] 设置页面失去焦点');
          }
        }}
      />
    </Tab.Navigator>
  );
}; 