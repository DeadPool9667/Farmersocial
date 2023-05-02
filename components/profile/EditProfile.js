import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileAction'

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import * as ImagePicker from 'expo-image-picker';
import { Dimensions, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const EditProfile = ({onEdit,setOnEdit}) => {
    const { height: SCREEN_HEIGHT } = Dimensions.get('window')

    const initState = {
        fullname: '', mobile: '', address: '', website: '', story: '', gender: ''
    }

    const bs = useRef()
    const fall = new Animated.Value(1)

    const [userData, setUserData] = useState(initState)
    const { fullname, mobile, address, website, story, gender } = userData

    const [avatar, setAvatar] = useState('')
    const [displayImage, setDisplayImage] = useState('')

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    // console.log(bs.current)

    useEffect(() => {
        setUserData(auth.user)

        // console.log('onedit====', onEdit)
        // console.log('ref===',bs.current)


        onEdit && bs.current.snapTo(0)

        if(bs.current.snapTo(1)){
            setOnEdit(false)
        }

    }, [auth.user, onEdit])


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
        });


        if (!result.canceled) {
            setAvatar(result.assets[0]);
            setDisplayImage(result.assets[0].uri);
        // console.log('imagedetails======',result.assets)
        }
    };

    const handleInput = name => text => {
        setUserData({ ...userData, [name]: text });
    };
    
    const handleSubmit = () => {
        // console.log(userData)
        dispatch(updateProfileUser({ userData, avatar, auth }));
    };

    const renderInner = () => (
        <KeyboardAvoidingView style={styles.panel}>
            <ScrollView>
                <TouchableOpacity onPress={() => pickImage()}>
                    <Image source={{ uri: displayImage ? displayImage : 'https://static.thenounproject.com/png/3445536-200.png' }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                </TouchableOpacity>
        
                <View>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Name</Text>
                    <TextInput 
                        value={fullname}
                        style={{color: 'white', backgroundColor: '#211e3b', borderRadius: 10, padding: 10}}
                        onChangeText={handleInput('fullname')}
                    />
                </View>
                <View style={{marginTop: 15}}>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Bio</Text>
                    <TextInput 
                        value={story}
                        style={{color: 'white', backgroundColor: '#211e3b', borderRadius: 10, padding: 10}}
                        onChangeText={handleInput('story')}
                        multiline
                        numberOfLines={5}
                    />
                </View>
                
                <View style={{marginTop: 15}}>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Mobile</Text>
                    <TextInput 
                        value={mobile}
                        style={{color: 'white', backgroundColor: '#211e3b', borderRadius: 10, padding: 10}}
                        onChangeText={handleInput('mobile')}
                    />
                </View>
                
                {/* <View style={{marginTop: 15}}>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Address</Text>
                    <TextInput 
                        value={address}
                        style={{color: 'white', backgroundColor: '#211e3b', borderRadius: 10, padding: 10}}
                        onChangeText={handleInput('address')}
                    />
                </View> */}
        
                <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: 'blue', borderRadius: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center', height:35}}>
                    <Text style={{color: 'white'}}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
      )
      
      const renderHeader = () => (
        <KeyboardAvoidingView style={styles.header}>
          <View style={styles.panelHeader}>
              <View style={styles.panelHandle}>
              </View>
          </View>
        </KeyboardAvoidingView>
      )

    return (
            <BottomSheet
                ref={bs}
                snapPoints={[600, 0]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={false}
            />
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    button: {
      height: 50,
      borderRadius: 25,
      aspectRatio: 1,
      backgroundColor: 'white',
      opacity: 0.6,
    },
    header:{
        backgroundColor: 'gray',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader:{
        alignItems: 'center'
    },
    panelHandle:{
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#080529',
        paddingTop: 20,
        height: '100%',
      },
  });

export default EditProfile
