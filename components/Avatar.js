import React from 'react'
import { Image } from 'react-native'
import { useSelector } from 'react-redux'

const Avatar = ({src, height, width}) => {
    
    return (
        <Image source={{uri:src}} alt="avatar" style={{height: height, width: width, borderRadius: height}} />
    )
}

export default Avatar
