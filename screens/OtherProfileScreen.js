import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useRoute } from '@react-navigation/native'
// import LoadIcon from '../../images/loading.gif'
import Info from '../components/profile/Info'
import Posts from '../components/profile/Posts'
import Saved from '../components/profile/Saved'
import { getProfileUsers } from '../redux/actions/profileAction'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OtherProfileScreen = ({navigation}) => {
  const { profile, auth } = useSelector(state => state)
  const dispatch = useDispatch()
  const route = useRoute()

  const { id } = route.params
  const [saveTab, setSaveTab] = useState(false)

  useEffect(() => {
    if (profile.ids.every(item => item !== id)) {
      dispatch(getProfileUsers({ id, auth }))
    }
  }, [id, auth, dispatch, profile.ids, profile.posts[0]?.posts])

  const handleLogout = async() => {
    await AsyncStorage.removeItem('firstLogin')
    await AsyncStorage.removeItem('refreshtoken')
    await AsyncStorage.removeItem('accesstoken')
    navigation.replace('LoginScreen')
    // console.log('Hello')
}

  return (
    <View style={{ backgroundColor: 'black' }}>
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {auth.user._id === id && (
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setSaveTab(false)}
          >
            <Text style={{ fontWeight: saveTab ? 'normal' : 'bold', color: 'white', fontSize: 20, padding: 10 }}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSaveTab(true)}>
            <Text style={{ fontWeight: saveTab ? 'bold' : 'normal', color: 'white', fontSize: 20, padding: 10  }}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {profile.loading ? (
        // <Image source={LoadIcon} style={{ width: 200, height: 200 }} />
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={{backgroundColor: 'black'}}>
          {saveTab ? (
            <Saved auth={auth} dispatch={dispatch} />
          ) : (
            <Posts
              from={'thisUser'}
              auth={auth}
              profile={profile}
              dispatch={dispatch}
              id={id}
              navigation={navigation}
            />
          )}
        </ScrollView>
      )}
    </View>
  )
}

export default OtherProfileScreen
