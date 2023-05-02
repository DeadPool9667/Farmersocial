import React, { useState, useEffect } from 'react'
import PostThumb from '../PostThumb'
// import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { PROFILE_TYPES } from '../../redux/actions/profileAction'
import { Dimensions, ScrollView, Text, View } from 'react-native'

const Posts = ({auth, id, dispatch, profile, navigation}) => {

    const { height: SCREEN_HEIGHT } = Dimensions.get('window')

    const [posts, setPosts] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        profile.posts.forEach(data => {
            if(data._id === id){
                setPosts(data.posts)
                setResult(data.result)
                setPage(data.page)
            }
        })
    },[profile.posts[0]?.posts, id])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`user_posts/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, page: page + 1, _id: id}
        dispatch({type: PROFILE_TYPES.GET_POSTS, payload: newData})
        setLoad(false)
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
      }

      
    useEffect(() => {
    }, [page])

    return (
        <ScrollView  onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore()
            }
          }} style={{height:'100%', backgroundColor: 'black'}}>
            <PostThumb navigation={navigation} posts={posts} result={result} />
  
            {
                load && <Text style={{color: 'white'}}>Loading...</Text>
            }

            
            {/* <LoadMoreBtn result={result} page={page}
            load={load} handleLoadMore={handleLoadMore} /> */}
            
        </ScrollView>
    )
}

export default Posts
