import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from '../Home';
import Calender from '../Calender';
import Profile from '../Profile';
import Track from '../Track';
import Diary from '../Diary';


const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#354f52', // Border/Shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#84a98c',
        tabBarInactiveTintColor: '#354f52',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'circle'; // Default icon

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-today';
          } else if (route.name === 'Track') {
            iconName = 'add';
            // Make the Track icon bigger and distinct if desired
            if (focused) size = 32;
          } else if (route.name === 'Diary') {
            iconName = 'book';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Calendar" component={Calender} />
      <Tab.Screen name="Track" component={Track} />
      <Tab.Screen name="Diary" component={Diary} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
