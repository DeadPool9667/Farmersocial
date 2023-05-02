import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import { useSelector } from 'react-redux';

const Following = ({ users, setShowFollowing }) => {
  const { auth } = useSelector(state => state);
  
  return (
    <View style={{flex: 1, position: 'absolute', backgroundColor: 'gray', margin: 50, top: 50, borderRadius: 10}}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Following</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', width: '90%' }} />
      </View>

      <ScrollView style={{ padding: 10 }}>
        {users.map(user => (
          <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing}>
            {auth.user._id !== user._id && <FollowBtn user={user} />}
          </UserCard>
        ))}
      </ScrollView>

      <View style={{ position: 'absolute', top: 10, right: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }} onPress={() => setShowFollowing(false)}>
          &times;
        </Text>
      </View>
    </View>
  );
};

export default Following;
