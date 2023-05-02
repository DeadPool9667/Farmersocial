import React, { useEffect } from 'react'
import { Dimensions, Text, View } from 'react-native'
import Post from './home/Post'

const PostThumb = ({posts, result, navigation}) => {
    const { height: SCREEN_HEIGHT } = Dimensions.get('window')

    if(result === 0) return (<View style={{height: SCREEN_HEIGHT/1.4, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white'}}>No Post</Text></View>
)
    for(let i=0; i<posts.length; i++){
        if(posts[i].user[0]){
            posts[i].user = posts[i].user[0]
        }
    }

    // useEffect(() => {
    // }, [posts])

    return (
        <View style={{height:'100%'}}>
            {
                posts.map(post => (
                    <Post key={post._id} post={post} navigation={navigation} />
                ))
            }
        </View>
    )
}

export default PostThumb
