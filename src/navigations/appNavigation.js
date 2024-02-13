import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ModalTest from '../screens/testModal';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerMode: 'screen',
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={HomeScreen}
        />
        {/* <Stack.Screen
          name="Modal"
          options={{headerShown: false}}
          component={ModalTest}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
