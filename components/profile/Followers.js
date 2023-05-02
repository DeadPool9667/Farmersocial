import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import FollowBtn from '../FollowBtn';
import { useSelector } from 'react-redux';
import UserCard from '../UserCard';

const Followers = ({ users, setShowFollowers }) => {
  const { auth } = useSelector(state => state);
  
  return (
    <View style={{flex: 1, position: 'absolute', backgroundColor: 'gray', margin: 50, top: 50, borderRadius: 10}}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>Followers</Text>
        <View style={{ width: '90%', height: 1, backgroundColor: 'gray', marginTop: 5 }} />
      </View>

      <ScrollView style={{}}>
        {
          users.map(user => (
            <UserCard key={user._id} user={user} setShowFollowers={setShowFollowers}>
              {
                auth.user._id !== user._id && <FollowBtn user={user} />
              }
            </UserCard>
          ))
        }
      </ScrollView>

      <TouchableOpacity onPress={() => setShowFollowers(false)} style={{ position: 'absolute', right: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>&times;</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Followers;
