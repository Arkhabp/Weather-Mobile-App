import React from 'react';
import {View, Text} from 'react-native';
import Helper from '../../helper/helper';

const Toast = ({toastMsg}) => {
  return (
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
          fontSize: Helper.normalize(14),
          fontWeight: '500',
        }}>
        {toastMsg}
      </Text>
    </View>
  );
};

export default Toast;
