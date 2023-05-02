import { Text, ScrollView, SafeAreaView, StyleSheet, Button, RefreshControl, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Post from '../components/home/Post'
import BottomTabs, { bottomTabIcons } from '../components/home/BottomTabs'
import { useDispatch, useSelector } from 'react-redux'
import { getDiscoverPosts } from '../redux/actions/discoverAction'
import { getDataAPI } from '../utils/fetchData'
import { POST_TYPES } from '../redux/actions/postAction'

const DiscoverScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const { height: SCREEN_HEIGHT } = Dimensions.get('window')

  const { auth, discover } = useSelector(state => state)


  const [load, setLoad] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`post_discover?limit=${discover.page * 9}`, auth.token)

    dispatch({
      type: POST_TYPES.GET_POSTS, 
      payload: {...res.data, page: homePosts.page + 1}
    })

    setLoad(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await dispatch(getDiscoverPosts(auth.token))
    setRefreshing(false)
  }

  const [mounted, setMounted] = useState(true)

  useEffect(()=> {
    if(mounted)
    dispatch(getDiscoverPosts(auth.token))

    return () => {
      setMounted(false)
    }
  },[dispatch, mounted, discover.firstLoad])  

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      {/* <Stories /> */}
      {discover.posts.length > 0 &&
        (<ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {discover.posts.map((post, index) => (
            <Post navigation={navigation} post={post} key={index} />
          ))}
        </ScrollView>)
      }

      {
        discover.loading && <View style={{height:SCREEN_HEIGHT, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text style={{color:'white'}}>Loading...</Text></View>
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

export default DiscoverScreen


