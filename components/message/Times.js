import React from 'react';
import { Text, View } from 'react-native';

const Times = ({total}) => {
  return (
    <View style={{flexDirection: 'row',backgroundColor: 'white'}}>
      <Text>
        {
          (parseInt(total/3600)).toString().length < 2
          ? '0' + (parseInt(total/3600))
          : (parseInt(total/3600))
        }
      </Text>
      <Text>:</Text>

      <Text>
        {
          (parseInt(total/60)).toString().length < 2
          ? '0' + (parseInt(total/60))
          : (parseInt(total/60))
        }
      </Text>
      <Text>:</Text>

      <Text>
        {
          (total%60).toString().length < 2
          ? '0' + (total%60) + 's'
          : (total%60) + 's'
        }
      </Text>
    </View>
  );
}

export default Times;
