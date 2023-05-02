import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup' // used for form validation
import { Formik } from 'formik' //used for form validation
import { TouchableOpacity } from 'react-native-gesture-handler'
import {Dimensions} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'


import * as ImagePicker from 'expo-image-picker';
import { setPercentage } from '../../redux/actions/percentage'
import axios from 'axios'
import { urlPath } from '../URL'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { createPost, updatePost } from '../../redux/actions/postAction'
import mime from 'mime'

let data = new FormData()

// PLACEHOLDER_IMG = 'https://wallpapers.com/images/hd/cool-neon-blue-profile-picture-u9y9ydo971k9mdcf.jpg'
PLACEHOLDER_IMG = 'https://static.vecteezy.com/system/resources/previews/007/567/154/original/select-image-icon-vector.jpg'

const uploadPostSchema = Yup.object().shape({
    imageUrl: Yup.string().url().required('A URL is required'),
    caption: Yup.string().max(2200, 'Caption has reached the character limit')
})


const FormikPostUploader = () => {
    const { auth, theme, status, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG)
    const [images, setImages] = useState([])

    const [content, setContent] = useState('')

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type: mime});
    };


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        aspect: [4, 3],
        quality: 1,
        });


        if (!result.canceled) {
            setImages(result.assets);
        // console.log('imagedetails======',result.assets)
        }
    };

    const imageUpload = async (images) => {
        // let imgArr = [];
        const formData = new FormData()
    
        for(const item of images){
            // console.log('imageUpload.js item =============', item)
            if(item.camera){
                let file = dataURLtoFile(`${item.camera}`, 'test.png')
                formData.append("files", file)
            }else{
                formData.append("files", {uri:item.uri, type: mime.getType(item.uri), name: item.uri.split("/").pop()})
            } 
        } 
    
        // console.log('formData=====', formData)

        const res = await axios.post(`${urlPath}/request/upload`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
              },

            onUploadProgress: (event) => {
                // console.log('uploaded', (event.loaded/event.total)*100)
                let percentage = Math.round((event.loaded/event.total)*100)
                dispatch(setPercentage(percentage))
            },
    
            // onDownloadProgress: event => {
            //     console.log(JSON.stringify(event.currentTarget.response))
            //     const dataChunk = progressEvent.currentTarget.response;
            //  }
        })

        const {data} = res

        return data.fileArray;
    }

    const handleSubmit = async () => {
        // console.log('content=====',content,'images======',images)
        if(status.onEdit){
            let media = []

            const imgNewUrl = images.filter(img => !img.url)
            const imgOldUrl = images.filter(img => img.url)

            if(status.content !== content 
                && imgNewUrl.length !== 0
                && imgOldUrl.length !== status.images.length
            ){
                dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
                if(imgNewUrl.length > 0) media = await imageUpload(images)
                dispatch(updatePost({content, imgOldUrl, auth, status, media}))
            }

        }else{
            dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
            let media = []
            if(images.length > 0) media = await imageUpload(images)
            if(content === '' && media.length === 0){
                console.log('No data to upload')
                return
            }
            dispatch(createPost({content, images, auth, socket, media}))
        }
        

        setContent('')
        setImages([])
        // if(tracks) tracks.stop()
        dispatch({ type: GLOBALTYPES.STATUS, payload: false})
    }

    useEffect(() => {
        if(status.onEdit){
            setContent(status.content)
            setImages(status.images)
        }
    }, [images, status])
    
    const deleteItem = (index) => {
        const updatedImages = [...images]
        updatedImages.splice(index, 1)
        setImages(updatedImages)
    }

  return (
    <>
        <View style={{marginTop: 20}}>
            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => pickImage()}>
                <Image source={{uri: PLACEHOLDER_IMG}} style={{width: 100, height: 100}} />   
                {/* <Text style={{color:'gray', marginLeft:10}}>Tap selected images to delete them</Text> */}
            </TouchableOpacity>

            <TextInput
                placeholder='say something'
                placeholderTextColor='gray'
                style={{color:'white', marginTop: 10}}
                multiline={true}
                value={content}
                onChangeText={(text) => setContent(text)}
            />
            </View>

            <View style={styles.imagesContainer}>
            {images.map((image, index) => (
                <TouchableOpacity onPress={() => deleteItem(index)} key={image.assetId}>
                    <Image source={{uri: image.uri}} style={{width: 100, height: 100}} />
                    <View style={styles.cancelButton}><Text style={styles.cross}>x</Text></View>
                </TouchableOpacity>
            ))}
            </View>

            <Button title='Submit' onPress={() => handleSubmit()} />
    </>
  )
}

export default FormikPostUploader

const styles = StyleSheet.create({
    imagesContainer:{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        width: Dimensions.get('window').width,
        flexWrap: 'wrap'
    },
    cancelButton:{
        backgroundColor: '#FF3250',
        width: 15,
        height: 15,
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