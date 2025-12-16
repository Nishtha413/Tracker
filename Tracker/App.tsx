import 'react-native-gesture-handler';
import React from 'react';

import BottomTabs from './src/nav/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { TrackerProvider } from './src/context/TrackerContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/SignIn';

const Stack = createStackNavigator();

const App = () => {
  return (
    <TrackerProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Main" component={BottomTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </TrackerProvider>
  );
};

export default App;