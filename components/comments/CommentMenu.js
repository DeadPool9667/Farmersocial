import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { deleteComment } from '../../redux/actions/commentAction';


const CommentMenu = ({post, comment, setOnEdit, setIsEdit}) => {

    const { width: SCREEN_WIDTH } = Dimensions.get('window')

    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    const handleRemove = () => {
        if(post.user._id === auth.user._id || comment.user._id === auth.user._id){
            dispatch(deleteComment({post, auth, comment, socket}));
        }
    }

    const MenuItem = () => {
        return(
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setOnEdit(true)} style={{backgroundColor: '#05f782', padding: 5, marginRight: 5}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemove} style={{backgroundColor: '#fa0c60', padding: 5}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>Remove</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{left:SCREEN_WIDTH/2, position: 'absolute', width: SCREEN_WIDTH, flexDirection: 'row'}}>
            {
                (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
                <View style={{flexDirection: 'row'}}>
                    {/* <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontSize: 20, color: 'white'}}>more_vert</Text>
                    </TouchableOpacity> */}

                    <View style={{zIndex: 1, marginRight: 5}}>
                        {
                            post.user._id === auth.user._id
                            ? comment.user._id === auth.user._id
                                ? MenuItem()
                                : (<TouchableOpacity onPress={handleRemove} style={{backgroundColor: '#fa0c60', padding: 5}}>
                                    <Text style={{fontWeight: 'bold', color: 'white'}}>Remove</Text>
                                </TouchableOpacity>)
                            : comment.user._id === auth.user._id && MenuItem()
                        }
                    </View>
                    <View style={{backgroundColor: 'gray', zIndex: 1}}>
                        <TouchableOpacity onPress={() => setIsEdit(false)} style={{padding: 5}}>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            
        </View>
    )
}

export default CommentMenu;
