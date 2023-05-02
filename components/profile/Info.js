import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../Avatar';
import EditProfile from './EditProfile';
import FollowBtn from '../FollowBtn';
import Followers from './Followers';
import Following from './Following';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../redux/actions/authAction';
import { useNavigation } from '@react-navigation/native';

const Info = ({ id, auth, profile, dispatch, setOnEdit, onEdit }) => {
  const [userData, setUserData] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const navigation = useNavigation()

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
    // console.log('ussername====',userData[0].username)
  }, [id, auth, dispatch, profile.users]);

  useEffect(() => {
    if (showFollowers || showFollowing) {
      dispatch({ type: GLOBALTYPES.MODAL, payload: true });
    } else {
      dispatch({ type: GLOBALTYPES.MODAL, payload: false });
    }
  }, [showFollowers, showFollowing, dispatch]);

  const Logout = async() => {
     dispatch(logout())
  }

  useEffect(() => {
    if(!auth?.token){
      navigation.replace('LoginScreen')
    }
  }, [auth])

  return (
    <View style={styles.info}>
      {userData.map((user) => (
        <View style={styles.info_container} key={user._id}>
          <Avatar src={user.avatar} height={100} width={100} />

          <View style={styles.info_content}>
            <View style={styles.info_content_title}>
              <Text style={styles.username}>{user.username}</Text>
              {user._id === auth.user._id ? (
                <TouchableOpacity
                  style={onEdit ? styles.btnOutlineInfoClose : styles.btnOutlineInfo}
                  onPress={() => setOnEdit(!onEdit)}
                >
                  <Text style={onEdit ? styles.btnOutlineInfoTextClose : styles.btnOutlineInfoText}>{onEdit ? 'Close' : 'Edit Profile'}</Text>
                </TouchableOpacity>
              ) : (
                <FollowBtn user={user} />
              )}
            </View>

            <View style={styles.follow_btn}>
              <Text
                style={styles.followers}
                onPress={() => setShowFollowers(true)}
              >
                {user.followers.length} Followers
              </Text>
              <Text
                style={styles.following}
                onPress={() => setShowFollowing(true)}
              >
                {user.following.length} Following
              </Text>
            </View>

            {user._id === auth.user._id && (
              <Text style={{color: 'white',}}>
                {user.fullname}{' '}
                <Text style={{color: 'white'}}> {user.mobile}</Text>
              </Text>
            )}
            <Text style={{color: 'white',}}>{user.address}</Text>
            <Text style={{color: 'white',}}>{user.email}</Text>
            {/* <TouchableOpacity
              style={styles.website}
              onPress={() => Linking.openURL(user.website)}
            >
              <Text style={styles.websiteText}>{user.website}</Text>
            </TouchableOpacity> */}
            <Text style={styles.story}>{user.story}</Text>
          </View>

          {showFollowers && (
            <Followers
              users={user.followers}
              setShowFollowers={setShowFollowers}
            />
          )}
          {showFollowing && (
            <Following
              users={user.following}
              setShowFollowing={setShowFollowing}
            />
          )}
        </View>
      ))}
        <TouchableOpacity onPress={() => Logout()}>
          <Icon name="exit-outline" size={24} color="white" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
  },
  info_container: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: 'white',
  },
  info_content: {
    flex: 1,
    paddingHorizontal: 10,
    color: 'white',
  },
  info_content_title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  btnOutlineInfo: {
    borderWidth: 1,
    borderColor: '#1DA1F2',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'white',
  },
  btnOutlineInfoClose: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'white',
  },
  btnOutlineInfoText: {
    color: '#1DA1F2',
  },
  btnOutlineInfoTextClose: {
    color: 'red',
  },
  story:{
    color: 'white',
  },
  followers:{
    color: 'white',
  },
  following:{
    color: 'white',
  }
})

export default Info
