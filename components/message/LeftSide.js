import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import UserCard from '../UserCard';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction';


const LeftSide = ({id}) => {
    const { auth, message, online } = useSelector(state => state)
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])

    const navigation = useNavigation();
    // const { params: { id } } = useRoute();

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    
    const handleSearch = async e => {
        e.preventDefault()
        if(!search) return setSearchUsers([]);

        try {
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setSearchUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleAddUser = (user) => {
        setSearch('')
        setSearchUsers([])
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}})
        dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        return navigation.navigate('UserMessageScreen', { id: user._id })
    }

    const isActive = (user) => {
        if(id === user._id) return 'active';
        return ''
    }

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversations({auth}))
    },[dispatch, auth, message.firstLoad, message.redDot])

    // Load More
    useEffect(() => {
        // const observer = new IntersectionObserver(entries => {
        //     if(entries[0].isIntersecting){
        //         setPage(p => p + 1)
        //     }
        // },{
        //     threshold: 0.1
        // })

        // observer.observe(pageEnd.current)
    },[setPage])

    useEffect(() => {
        if(message.resultUsers >= (page - 1) * 9 && page > 1){
            dispatch(getConversations({auth, page}))
        }
        dispatch({type:MESS_TYPES.REMOVE_DOT})
    },[message.resultUsers, page, auth, dispatch])
    

    // Check User Online - Offline
    useEffect(() => {
        if(message.firstLoad) {
            dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        }
    },[online, message.firstLoad, dispatch])

  return (
    <>
        {/* <View style={[styles.messageHeader, {marginTop: 40}]}>
            <TextInput 
            style={styles.searchInput}
            value={search}
            placeholder="Enter to Search..."
            onChangeText={(text) => setSearch(text)}
            />

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text>Search</Text>
            </TouchableOpacity>
        </View> */}

        <View style={styles.messageChatList}>
            {
            searchUsers.length !== 0
            ?  <>
                {
                    searchUsers.map(user => (
                    <TouchableOpacity key={user._id} style={[styles.messageUser, isActive(user)]} onPress={() => handleAddUser(user)}>
                        <UserCard user={user} />
                    </TouchableOpacity>
                    ))
                }
                </>
            : <>
                {
                    message.users.map(user => (
                    <TouchableOpacity key={user._id} style={[styles.messageUser, isActive(user)]} onPress={() => handleAddUser(user)}>
                        <UserCard user={user} msg={true}>
                        {
                            user.online
                            ? <View style={styles.onlineDot} />
                            : auth.user.following.find(item => item._id === user._id) && <View style={styles.offlineDot} />
                        }
                        </UserCard>
                    </TouchableOpacity>
                    ))
                }
                </>
            }

            <TouchableOpacity ref={pageEnd} style={{opacity: 0}}>
                <Text>Load More</Text>
            </TouchableOpacity>
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    messageHeader: {},
    searchInput: {},
    searchButton: {},
    messageChatList: {},
    messageUser: {},
    onlineDot: {
        backgroundColor: 'green',
        position: 'absolute',
        left: 15,
        bottom: 40,
        width:10,
        height: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,

    },
    offlineDot: {
        backgroundColor: 'gray',
        position: 'absolute',
        left: 15,
        bottom: 40,
        width:10,
        height: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
  })
export default LeftSide

         
