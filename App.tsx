import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { StatusBar } from 'react-native';
import { Theme } from './src/constants/theme';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />
      <BottomTabNavigator />
    </NavigationContainer>
  );
} 