import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { postFooterIcons } from '../data/posts'

const LikeButton = ({isLike, handleLike, handleUnLike}) => {

    return (
        <>
            {
                isLike ?
                (<TouchableOpacity onPress={handleUnLike}>
                    <Image style={{width: 20, height: 20}} source={{uri: postFooterIcons[0].likedimageUrl}} />
                </TouchableOpacity>)
                
                : (<TouchableOpacity onPress={handleLike}>
                    <Image style={{width: 20, height: 20}} source={{uri: postFooterIcons[0].imageUrl}} />
                </TouchableOpacity>)
            }
        </>
    )
}

export default LikeButton
