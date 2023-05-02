import { Image, StyleSheet, Text, View, TouchableOpacity, Button, TextInput, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements'
import { postFooterIcons } from '../../data/posts'
import CustomCarousel from './Carousel'
import { likePost, savePost, unLikePost, unSavePost } from '../../redux/actions/postAction'
import { useDispatch, useSelector } from 'react-redux'
import Comments from '../comments/Comments'
import { Modal, Portal, Provider } from 'react-native-paper';
import InputComment from '../InputComment'


const Post = ({post, navigation}) => {
    const { auth, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [saved, setSaved] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if(post.likes.find(like => like._id === auth.user._id)){
            setIsLike(true)
        }else{
            setIsLike(false)
        }
    }, [post.likes, auth.user._id])

    const handleLike = async () => {
        if(loadLike) return;
        setLoadLike(true)
        await dispatch(likePost({post, auth, socket}))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if(loadLike) return;
        setLoadLike(true)
        await dispatch(unLikePost({post, auth, socket}))
        setLoadLike(false)
    }

    useEffect(() => {
        if(auth.user.saved.find(id => id === post._id)){
            setSaved(true)
        }else{
            setSaved(false)
        }
    },[auth.user.saved, post._id])

    const handleSavePost = async () => {
        if(saveLoad) return;
        
        setSaveLoad(true)
        await dispatch(savePost({post, auth}))
        setSaveLoad(false)
    }

    const handleUnSavePost = async () => {
        if(saveLoad) return;

        setSaveLoad(true)
        await dispatch(unSavePost({post, auth}))
        setSaveLoad(false)
    }

    const handleClostComment = () => {
        setVisible(true)
    }

  return (
    <View>
        <Divider width={1} orientation='vertical'/>
        <PostHeader post={post} navigation={navigation} />
        {/* <CustomModal visible={visible} setVisible={setVisible} /> */}
        { post.images && post.images.length > 0 && <PostImage post={post} />}
        <View style={{marginHorizontal: 15, marginTop: 10}}>
            <Caption post={post} />
            <PostFooter 
                handleSavePost={handleSavePost} 
                handleUnSavePost={handleUnSavePost} 
                handleLike={handleLike} 
                handleUnLike={handleUnLike} 
                isLike={isLike} 
                saved={saved}
                handleClostComment={handleClostComment}
            /> 
            <Likes post={post} />
            {/* <CommentSection post={post} /> */}
            <InputComment post={post} />
            <Comments navigation={navigation} post={post} />
        </View>
    </View>
  )
}

const CustomModal = ({visible, setVisible}) => {
  
    const hideModal = () => setVisible(false);

    const [content, setContent] = useState('')

    const handleSubmit = () => {
        console.log('Hola')
    }
  
    return (
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'black', borderRadius: 20}}>
            <TouchableOpacity style={{zIndex:10}} onPress={hideModal}>
                <View style={styles.cancelButton}><Text style={styles.cross}>x</Text></View>
            </TouchableOpacity>
            <TextInput
                placeholder='write your comment here'
                placeholderTextColor='gray'
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
                style={{color: "white"}}
            /> 
          <Button onPress={handleSubmit} title="Post" />
        </Modal>
      </Portal>
    );
  };
  
const PostHeader = ({post, navigation}) => (
    <View style={{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        margin: 5, 
        alignItems:'center'
        }}
    >
        <TouchableOpacity onPress={() => navigation.navigate('OtherProfileScreen', {id: post.user._id})}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* {post.profile_picture && <Image source={{uri: source.profile_picture}} />}             */}
                <Image source={{uri: post.user.avatar}} style={styles.story} />           
                <Text style={{color: 'white', marginLeft: 5, fontWeight: '700'}}>{post.user.username}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={{color: 'white', fontWeight: '900'}}>...</Text>
        </TouchableOpacity>
    </View>
)

const PostImage = ({post}) => (
    <View
        style={{
            width: '100%',
            height: 450
        }}
        
    >
    <CustomCarousel imageArr={post.images} />
    {/* <Image source={{uri: post.images[0]?.url}} style={{height: '100%', resizeMode: 'cover'}} /> */}
    </View> 
)

const PostFooter = ({saved, isLike, handleSavePost, handleUnSavePost, handleLike, handleUnLike, handleClostComment}) => (
    
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
            <Icon imgStyle={styles.footerIcon} 
                imgUrl={isLike ? postFooterIcons[0].likedimageUrl :postFooterIcons[0].imageUrl} 
                functi={isLike ? handleUnLike : handleLike}
            />
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[1].imageUrl} functi={handleClostComment} />
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[2].imageUrl} />
        </View>
        <View>
            <Icon functi={saved ? handleUnSavePost : handleSavePost} imgStyle={styles.footerIcon} imgUrl={saved ? postFooterIcons[3].savedImageUrl:postFooterIcons[3].imageUrl} />
        </View>
    </View>
)

const Icon = ({imgStyle, imgUrl, functi}) => (
    <TouchableOpacity onPress={functi}>
        <Image style={imgStyle} source={{uri: imgUrl}} />
    </TouchableOpacity>
)

const Likes = ({post}) => (
    <View style={{flexDirection: 'row', marginTop: 4}}>
        <Text style={{color: 'white', fontWeight: '600'}}>
            {post.likes.length} likes
        </Text>
    </View>
)

const Caption = ({post}) => (
    <View style={{margin: 5}}> 
        <Text style={{color: 'white', fontSize: 20}}>
            {post.content}
        </Text>
    </View>
)

// const Comments = ({post, navigation}) =>(
//     <>
//     {post.comments.map((comment, index) => (
//         <View key={index} style={{flexDirection: 'row', marginTop: 5}}>
//             <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {id: comment.user._id})}>
//                 <Text style={{color: 'white'}} >
//                     <Text style={{fontWeight: '600'}}>{comment.user.username}</Text>{' '}
//                     {comment.content}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     ))}
//     </>
// )

const CommentSection = ({post}) => (
    <View style={{marginTop: 5}}>
        {!!post.comments.length &&
            (<Text style={{color: 'gray'}}>
                View {post.comments.length > 1 ? 'all' : ''} {post.comments.length}{' '}
                {post.comments.length > 1 ? 'comments' : 'comment'}
            </Text>)
        }
    </View>
)

export default Post

const styles = StyleSheet.create({
    story:{
        width: 35,
        height:35,
        borderRadius: 50,
        marginLeft: 6,
        borderWidth: 1.5,
        borderColor: '#ff8501'
    },

    footerIcon:{
        width: 33,
        height: 33,
        margin: 5
    },
    cancelButton:{
        backgroundColor: '#FF3250',
        width: 30,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cross:{
        color: 'white',
        position: 'absolute'
    }
})