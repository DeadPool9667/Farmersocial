import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Avatar from './Avatar';

import Icon from 'react-native-vector-icons/MaterialIcons'

const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg }) => {

  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (setShowFollowers) setShowFollowers(false);
    if (setShowFollowing) setShowFollowing(false);
  };

  const showMsg = (user) => {
    return (
      <>
        <View style={{}}>
          <Text>{user.text}</Text>
        </View>
        {user.media.length > 0 && (
          <View>
            <Text>{user.media.length}</Text>
            <Icon color="white" name="image" size={20} />
          </View>
        )}
        {user.call && (
          <Icon
            name={
              user.call.times === 0
                ? user.call.video
                  ? 'videocam-off'
                  : 'phone-disabled'
                : user.call.video
                ? 'videocam'
                : 'call'
            }
            size={20}
          />
        )}
      </>
    );
  };

  return (
    <View style={{width:300, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
      <View>
        <TouchableOpacity onPress={handleCloseAll}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar src={user.avatar} height={30} width={20} />
            <View style={{ marginLeft: 10 }}>
              <Text stylr={{color: 'white', padding: 10}}>{user.username}</Text>
              <Text style={{ opacity: 0.7, color: 'white' }}>
                {msg ? showMsg(user) : user.fullname}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default UserCard;
