import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import UserCard from '../UserCard';
import MsgDisplay from './MsgDisplay';
import Icons from '../CustomIcons';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { imageUpload } from '../../utils/imageUpload';
import { addMessage, getMessages, loadMoreMessages, deleteConversation } from '../../redux/actions/messageAction';
// import LoadIcon from '../../images/loading.gif';
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomIcons from '../CustomIcons';

const RightSide = ({id}) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window')

  const { auth, message, socket, peer } = useSelector(state => state);
  const dispatch = useDispatch();
  
//   const route = useRoute();
  const navigation = useNavigation();

//   const { id } = route.params;
  const [user, setUser] = useState({});
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  
  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  useEffect(() => {
    const newData = message.data.find(item => item._id === id);
    if(newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if(id && message.users.length > 0){
      setTimeout(() => {
        refDisplay.current.scrollToEnd({animated: true});
      }, 50);

      const newUser = message.users.find(user => user._id === id);
      if(newUser) setUser(newUser);
    }
  }, [message.users, id]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = '';
    let newMedia = [];

    files.forEach(file => {
      if(!file) return err = 'File does not exist.';

      if(file.size > 1024 * 1024 * 5){
        return err = 'The image/video largest is 5mb.';
      }

      return newMedia.push(file);
    });

    if(err) dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} });
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async () => {
    if(!text.trim() && media.length === 0) return;
    setText('');
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if(media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text, 
      media: newArr,
      createdAt: new Date().toISOString()
    };

    setLoadMedia(false);
    await dispatch(addMessage({msg, auth, socket}));
    if(refDisplay.current) refDisplay.current.scrollToEnd({animated: true});
  };

  useEffect(() => {
    const getMessagesData = async () => {
        if(message.data.every(item => item._id !== id)){
            await dispatch(getMessages({auth, id}))
            setTimeout(() => {
                refDisplay.current.scrollTo({y : 100, animated: true})
            },50)
        }
    }
    getMessagesData()
},[id, dispatch, auth, message.data])


// Load More
useEffect(() => {
    // const observer = new IntersectionObserver(entries => {
    //     if(entries[0].isIntersecting){
    //         setIsLoadMore(p => p + 1)
    //     }
    // },{
    //     threshold: 0.1
    // })

    // observer.observe(pageEnd.current)
},[setIsLoadMore])

useEffect(() => {
    if(isLoadMore > 1){
        if(result >= page * 9){
            dispatch(loadMoreMessages({auth, id, page: page + 1}))
            setIsLoadMore(1)
        }
    }
    // eslint-disable-next-line
},[isLoadMore])

const handleDeleteConversation = () => {
    if(Alert.alert('Do you want to delete?','Are you sure you want to delete the entire conversation?',[
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: () => dispatch(deleteConversation({auth, id}))
        },
      ],{ cancelable: true })){
        return navigation.navigate('MessageScreen')
    }
}

// Call
const caller = ({video}) => {
    const { _id, avatar, username, fullname } = user

    const msg = {
        sender: auth.user._id,
        recipient: _id, 
        avatar, username, fullname, video
    }
    dispatch({ type: GLOBALTYPES.CALL, payload: msg })
}

const callUser = ({video}) => {
    const { _id, avatar, username, fullname } = auth.user

    const msg = {
        sender: _id,
        recipient: user._id, 
        avatar, username, fullname, video
    }

    if(peer.open) msg.peerId = peer._id

    socket.emit('callUser', msg)
}

const handleAudioCall = () => {
    caller({video: false})
    callUser({video: false})
}

const handleVideoCall = () => {
    caller({video: true})
    callUser({video: true})
}

return (
    <>
      <View style={{backgroundColor: 'black', height: 80}}>
        {user.length !== 0 && (
          <UserCard user={user}>
            <View style={{flexDirection: 'row', marginRight: -80}}>
              {/* <TouchableOpacity style={styles.icon} onPress={handleAudioCall}>
                <Icon name="phone" size={24} color="black" />
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.icon} onPress={handleVideoCall}>
                <Icon name="video-camera" size={24} color="black" />
              </TouchableOpacity> */}
  
              <TouchableOpacity style={styles.icon} onPress={handleDeleteConversation}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </UserCard>
        )}
      </View>
  
      <View
        style={{
            height: SCREEN_HEIGHT - 190 ,
            backgroundColor: 'black'
        }}
      >
        <ScrollView ref={refDisplay}>
          <TouchableOpacity
            style={{ marginTop: -25, opacity: 0 }}
            ref={pageEnd}
          >
            <Text>Load more</Text>
          </TouchableOpacity>
  
          {data.map((msg, index) => (
            <View key={index}>
              {msg.sender !== auth.user._id && (
                <View style={styles.otherMessage}>
                  <MsgDisplay user={user} msg={msg} />
                </View>
              )}
  
              {msg.sender === auth.user._id && (
                <View style={styles.youMessage}>
                  <MsgDisplay user={auth.user} msg={msg}  data={data} />
                </View>
              )}
            </View>
          ))}
  
          {loadMedia && (
            <View style={styles.youMessage}>
              <Text style={{color: 'white'}}>Loading...</Text>
            </View>
          )}
        </ScrollView>
    </View>
  
    <View style={{ display: media.length > 0 ? 'flex' : 'none' }}>
    {media.map((item, index) => (
        <View key={index} id="file_media">
        {item.type.match(/video/i) ? (
            videoShow(URL.createObjectURL(item))
        ) : (
            imageShow(URL.createObjectURL(item))
        )}
        <TouchableOpacity onPress={() => handleDeleteMedia(index)}>
            <Text style={styles.closeIcon}>&times;</Text>
        </TouchableOpacity>
        </View>
    ))}
    </View>
  
      <View style={styles.chatInput}>
        <TextInput
          placeholder="Enter your message..."
          value={text}
          onChangeText={(text) => setText(text)}
          style={{
            backgroundColor:'#040404',
            color: 'white',
            flex: 1,
            margin: 10,
            borderRadius: 20,
            padding: 20,
          }}
        />
  
        {/* <View style={{marginTop: 20, marginLeft:10, position: 'absolute'}}>
            <CustomIcons setContent={setText} content={text}/>
        </View> */}
  
        {/* <View style={styles.fileUpload}>
          <TouchableOpacity>
            <Icon name="image" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeMedia}>
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View> */}
  
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={text || media.length > 0 ? false : true}
          style={{ margin: 10, marginTop: 20 }}
        >
          <Icon name="send" size={24} color={text || media.length > 0 ? 'red' : 'grey'} />
        </TouchableOpacity>
      </View>
    </>
  );
  
}

const styles = StyleSheet.create({
    uploadText: {

    },
    otherMessage: {
        backgroundColor: '#81fcb2',
        margin: 5,
        borderRadius: 5,
        padding: 5
    },
    youMessage: {
        backgroundColor: '#3998f7',
        margin: 5,
        borderRadius: 5,
        padding: 5
    },
    closeIcon: {
        backgroundColor: 'blue'
    },
    chatInput: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 90
        // bottom: -30
    },
    fileUpload: {
        flexDirection: 'row',
        margin: 5
    },
    icon:{
        margin: 5
    },
  })

export default RightSide

