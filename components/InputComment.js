import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icons from './CustomIcons';
import { createComment } from '../redux/actions/commentAction';

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('');

    const { auth, socket, theme } = useSelector(state => state);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }

        setContent('');

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        };
        
        dispatch(createComment({post, newComment, auth, socket}));

        if(setOnReply) return setOnReply(false);
    };

    return (
        <View style={styles.container}>
            {children}
            <TextInput 
                style={[
                    styles.input,
                    // {
                    //     filter: theme ? 'invert(1)' : 'invert(0)',
                    //     color: theme ? 'white' : '#111',
                    //     backgroundColor: theme ? 'rgba(0,0,0,.03)' : '',
                    // }
                ]}
                placeholder="Add your comments..."
                placeholderTextColor='gray'
                value={content} 
                onChangeText={text => setContent(text)} 
            />
            <Icons setContent={setContent} content={content} theme={theme} />
            <TouchableOpacity style={styles.postBtn} onPress={handleSubmit}>
                <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 5,
    },
    input: {
        flex: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
        color: 'white',
    },
    postBtn: {
        borderRadius: 25,
        backgroundColor: '#3498db',
        padding: 10,
    },
    postBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InputComment;
