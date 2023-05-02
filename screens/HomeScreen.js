import { View, Text, ScrollView, SafeAreaView, StyleSheet, Button, RefreshControl, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../data/posts'
import BottomTabs, { bottomTabIcons } from '../components/home/BottomTabs'
import { useDispatch, useSelector } from 'react-redux'
import {  getPosts, POST_TYPES } from '../redux/actions/postAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDataAPI } from '../utils/fetchData'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import SocketClient from '../SocketClient'

const HomeScreen = ({navigation}) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window')

  const dispatch = useDispatch()

  const { homePosts } = useSelector(state => state)
  const { auth } = useSelector(state => state)

  const [mounted, setMounted] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = async () => {
      const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)

      dispatch({
          type: POST_TYPES.GET_POSTS, 
          payload: {...res.data, page: homePosts.page + 1}
      })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await dispatch(getPosts(auth.token))
    setRefreshing(false)
  }

  const getAuthenticatedData = async() => {
    try {
      // console.log('homeposts====',homePosts)
      dispatch(getPosts(auth.token))
      if(homePosts.msg?.error){
        throw homePosts.msg.error
      }
    } catch (error) {
      dispatch(GLOBALTYPES.CLEAR_ERROR)
      await AsyncStorage.removeItem('firstLogin')
      await AsyncStorage.removeItem('refreshtoken')
      await AsyncStorage.removeItem('accesstoken')
      navigation.replace('LoginScreen')
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  useEffect(()=> {
    if(mounted)
      getAuthenticatedData()

      return () => {
        setMounted(false)
      }
  },[mounted, homePosts.posts.length, homePosts])  


  return (
    <SafeAreaView style={styles.container}>
      <SocketClient />
      <Header navigation={navigation} />
      {/* <Stories /> */}
      {homePosts.posts.length > 0 &&
        (<ScrollView  
          onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore()
          }
        }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {homePosts.posts.map((post, index) => (
            <Post navigation={navigation} post={post} key={index} />
          ))}
        </ScrollView>)
      }

      {
        homePosts.loading && <View style={{height:SCREEN_HEIGHT, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text style={{color:'white'}}>Loading...</Text></View>
      }
      {/* <Button title="Load More" onPress={() => handleLoadMore()} /> */}
      {/* <BottomTabs navigation={navigation} icons={bottomTabIcons} user={auth.user} /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'black',
        flex: 1,
    },
})

export default HomeScreen