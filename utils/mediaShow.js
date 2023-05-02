import { Image } from "react-native"
import { Video } from 'expo-av';

export const imageShow = (src) => {
    return(
        <Image source={{uri: src}} alt="images" className="img-thumbnail"
        style={{width: 20, height: 20}} />
    )
}

export const videoShow = (src) => {
    return(
        <Video
            source={{uri:src}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            useNativeControls
            resizeMode="contain"
            shouldPlay={false}
            isLooping={false}
            style={{ height: '100%'}}
        />
    )
}