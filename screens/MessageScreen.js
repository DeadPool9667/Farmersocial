import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import LeftSide from '../components/message/LeftSide';
import RightSide from '../components/message/RightSide';

const MessageScreen = () => {
    const route = useRoute();

    const { id } = route.params;

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, borderRightWidth: 1 }}>
                <LeftSide id={id} />
            </View>
            {/* <View style={{ flex: 2 }}>
                <RightSide id={id} />
            </View> */}
        </View>
    );
};

export default MessageScreen;
