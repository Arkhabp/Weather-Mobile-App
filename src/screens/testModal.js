import React, {useRef, useCallback} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';

const ModalTest = () => {
  const modalRef = useRef(<Modalize />);

  const openModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.open();
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text onPress={openModal}>{'Open Modal'}</Text>
        <Modalize ref={modalRef}>
          <View style={{padding: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', lineHeight: 34}}>
              {'This is a modal'}
            </Text>
            <Text>
              {
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et euismod nisl. Nulla facilisi. Aenean et mi volutpat, iaculis libero non, luctus quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur euismod dapibus metus, eget egestas quam ullamcorper eu.'
              }
            </Text>
          </View>
        </Modalize>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
});

export default ModalTest;
