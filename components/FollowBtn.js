import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TouchableOpacity } from 'react-native';
import { follow, unfollow } from '../redux/actions/profileAction';

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);

  const { auth, profile, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
    return () => setFollowed(false);
  }, [auth.user.following, user._id]);

  const handleFollow = async () => {
    if (load) return;

    setFollowed(true);
    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  const handleUnFollow = async () => {
    if (load) return;

    setFollowed(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  return (
    <>
      {followed ? (
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5,
            marginLeft: 15
          }}
          onPress={handleUnFollow}>
          <Text style={{ color: '#fff',}}>UnFollow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
          }}
          onPress={handleFollow}>
          <Text style={{ color: '#fff' }}>Follow</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default FollowBtn;
