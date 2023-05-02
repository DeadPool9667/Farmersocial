import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from '../Avatar';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessages } from '../../redux/actions/messageAction';
import Times from './Times';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
// import Icon as IconFfrom 'react-native-vector-icons/FontAwesome'

const MsgDisplay = ({ user, msg, data }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleDeleteMessages = () => {
    if (!data) return;

    Alert.alert('Do you want to delete?','Are you sure you want to delete this message?',[
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: () => dispatch(deleteMessages({ msg, data, auth }))
        },
      ],{ cancelable: true })
  };

  return (
    <>
      <View style={styles.chat_title}>
        <Avatar src={user.avatar} size="small-avatar" />
        <Text>{user.username}</Text>
      </View>

      <View style={styles.you_content}>
        {user._id === auth.user._id && (
          <TouchableOpacity onPress={handleDeleteMessages}>
            <Text style={styles.deleteIcon}>
                <Icon name="restore-from-trash" size={14} color="red" />
            </Text>
          </TouchableOpacity>
        )}

        <View>
          {msg.text && (
            <View
              style={[
                styles.chat_text
              ]}
            >
              <Text>{msg.text}</Text>
            </View>
          )}
          {msg.media.map((item, index) => (
            <View key={index}>
              {item.url.match(/video/i) ? (
                videoShow(item.url)
              ) : (
                imageShow(item.url)
              )}
            </View>
          ))}
        </View>

        {msg.call && (
          <TouchableOpacity
            style={[
              styles.callButton,
              { backgroundColor: '#eee', borderRadius: 10 },
            ]}
          >
            <View style={styles.callIconWrapper}>
              <Text
                style={[
                  styles.callIcon,
                  {
                    fontSize: 25,
                    color: msg.call.times === 0 ? 'crimson' : 'green',
                  },
                ]}
              >
                {msg.call.times === 0
                  ? msg.call.video
                    ? <Icon name="videocam-off" size={24} color="red" />
                    : <Icon name="phone-disabled" size={24} color="red" />
                  : msg.call.video
                  ? <Icon name="videocam" size={24} color="green" />
                  : <Icon name="call" size={24} color="green" />}
              </Text>

              <View style={styles.callInfo}>
                <Text style={styles.callTitle}>
                  {msg.call.video ? 'Video Call' : 'Audio Call'}
                </Text>
                <Text style={styles.callTime}>
                  {msg.call.times > 0 ? (
                    // <Times total={msg.call.times} />
                    new Date(msg.call.times).toLocaleTimeString()
                  ) : (
                    new Date(msg.createdAt).toLocaleTimeString()
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chat_time}>
        <Text>{new Date(msg.createdAt).toLocaleString()}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chat_title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  you_content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginRight: 10,
  },
  chat_text: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '100%',
    marginVertical: 5,
  },
  callButton: {},

  callInfo: {
    flexDirection: 'row'
  },
  callTitle: {},
  callTime: {
    marginLeft: 5
  },
  chat_time: {},
  callIconWrapper: {
    borderRadius: 5,
    padding: 10
  },
})

export default MsgDisplay
   
