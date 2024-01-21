import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';

import AppNavigation from './src/navigations/appNavigation';
import {ToastProvider, ToastOptions} from 'react-native-toast-notifications';
import Toast from './src/components/toast';

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ToastProvider
        placement="bottom"
        duration={1500}
        animationType="zoom-in"
        animationDuration={250}
        swipeEnabled={true}
        renderType={{
          custom_type: toast => (
            <View
              style={{
                backgroundColor: '#1E1C1C',
                paddingHorizontal: Helper.normalize(18),
                paddingVertical: Helper.normalize(10),
                borderRadius: Helper.normalize(18),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: Helper.normalize(20),
                  fontWeight: '500',
                }}>
                {toast.message}
              </Text>
            </View>
          ),
        }}>
        <AppNavigation />
      </ToastProvider>
    </SafeAreaView>
  );
}

export default App;
