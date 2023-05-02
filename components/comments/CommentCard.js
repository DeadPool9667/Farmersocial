import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableNativeFeedback } from 'react-native'
import moment from 'moment'

import LikeButton from '../LikeButton'
import CommentMenu from './CommentMenu'
import InputComment from '../InputComment'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../Avatar'
import { updateComment, likeComment, unLikeComment } from '../../redux/actions/commentAction'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const CommentCard = ({children, comment, post, commentId, navigation}) => {
    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [content, setContent] = useState('')
    const [readMore, setReadMore] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [onReply, setOnReply] = useState(false)

    useEffect(() => {
        setContent(comment.content)
        setIsLike(false)
        setOnReply(false)
        if(comment.likes.find(like => like._id === auth.user._id)){
            setIsLike(true)
        }
    },[comment, auth.user._id])

    const handleUpdate = () => {
        if(comment.content !== content){
            dispatch(updateComment({comment, post, content, auth}))
            setOnEdit(false)
        }else{
            setOnEdit(false)
        }
    }

    const handleLike = async () => {
        if(loadLike) return;
        setIsLike(true)

        setLoadLike(true)
        await dispatch(likeComment({comment, post, auth}))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if(loadLike) return;
        setIsLike(false)

        setLoadLike(true)
        await dispatch(unLikeComment({comment, post, auth}))
        setLoadLike(false)
    }

    const handleReply = () => {
        if(onReply) return setOnReply(false)
        setOnReply({...comment, commentId})
    }

    const handleLongPress = () => {
        setIsEdit(true)
    }

    const handleCancel = () => {
        setOnEdit(false)
        setIsEdit(false)
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
    }

    return (
        <View style={[styles.comment_card, styleCard]}>
            {isEdit && <CommentMenu post={post} comment={comment} setIsEdit={setIsEdit} setOnEdit={setOnEdit} />}

            <TouchableOpacity onPress={() => navigation.navigate('OtherProfileScreen', { id: comment.user._id })} style={[styles.comment_card_header,{width:150}]}>
                <Avatar source={{ uri: comment.user.avatar }} size="small-avatar" />
                <Text style={styles.comment_card_username}>{comment.user.username}</Text>
            </TouchableOpacity>

            <TouchableOpacity onLongPress={handleLongPress}>
                <View style={styles.comment_card_content}>
                    <View style={[styles.comment_card_text, {
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    }]}>
                    {onEdit ?
                        <TextInput
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={5}
                        style={{color: "white"}}
                        /> :
                        <View style={{flexDirection: 'row'}}>
                            {comment.tag && comment.tag._id !== comment.user._id &&
                                <TouchableOpacity onPress={() => navigation.navigate('OtherProfileScreen', {id: comment.tag._id})} style={styles.comment_card_tag}>
                                    <Text style={{color: 'white', marginRight: 5}}>@{comment.tag.username}</Text>
                                </TouchableOpacity>
                            }
                            <Text style={{color: 'white'}} numberOfLines={readMore ? undefined : 3}>
                                {content.length < 100 ? content :
                                readMore ? content + ' ' : content.slice(0, 100) + '....'}
                            </Text>
                            {content.length > 100 &&
                                <TouchableOpacity onPress={() => setReadMore(!readMore)} style={styles.comment_card_readMore}>
                                    <Text>{readMore ? 'Hide content' : 'Read more'}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={styles.comment_card_timestamp}>{moment(comment.createdAt).fromNow()}</Text>
                        <Text style={styles.comment_card_likes}>{comment.likes.length} likes</Text>
                        {onEdit ?
                        <>
                            <TouchableOpacity onPress={handleUpdate}>
                                <View style={{backgroundColor: 'gray', borderRadius: 10, padding: 5, marginRight: 5}}>
                                    <Text style={styles.comment_card_update}>update</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel}>
                                <View style={{backgroundColor: 'gray', borderRadius: 10, padding: 5}}>
                                    <Text style={styles.comment_card_cancel}>cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </> :
                        <TouchableOpacity onPress={handleReply}>
                            <Text style={styles.comment_card_reply}>{onReply ? 'cancel' : 'reply'}</Text>
                        </TouchableOpacity>
                        }
                    </View>
                    </View>

                    <View style={styles.comment_card_menu}>
                    <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
                    </View>
                </View>
            </TouchableOpacity>

            {onReply &&
                <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
                    <TouchableOpacity onPress={() => navigation.navigate('OtherProfileScreen', { id: onReply.user._id })} style={styles.comment_card_tag}>
                        <Text>@{onReply.user.username}:</Text>
                    </TouchableOpacity>
                </InputComment>
            }

            {children}
    </View>


);
};

                    


export default CommentCard

const styles = StyleSheet.create({
    comment_card_tag:{
        color: 'white',
    },
    comment_card_menu:{
        color: 'white',
    },
    comment_card_reply:{
        color: 'white',
    },
    comment_card_cancel:{
        color: 'white',
    },
    comment_card_update:{
        color: 'white',
    },
    comment_card_likes:{
        color: 'white',
        marginRight: 5,
    },
    comment_card_timestamp:{
        color: 'white',
        marginRight: 5,
    },
    comment_card_readMore:{
        color: 'white',
    },
    comment_card_text:{
        color: 'white',
    },
    comment_card_content:{
        color: 'white',
        padding: 5,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: 'gray',
        borderBottomColor: 'gray'
    },
    comment_card_header:{
        color: 'white',
    },
    comment_card_username:{
        color: 'white',
    },
    comment_card:{
        backgroundColor: 'black'
    },
})