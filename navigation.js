import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from './screens/HomeScreen'
import NewPostScreen from './screens/NewPostScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import ProfileScreen from './screens/ProfileScreen'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import { urlPath } from './components/URL'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DiscoverScreen from './screens/DiscoverScreen'
import { bottomTabIcons } from './components/home/BottomTabs'
import OtherProfile from './screens/OtherProfileScreen'
import MessageScreen from './screens/MessageScreen'
import UserMessageScreen from './screens/UserMessageScreen'
import RegisterScreen from './screens/RegisterScreen'

const Stack = createStackNavigator()

const Tab = createBottomTabNavigator()

const screenOptions = {
    headerShown: false
} 

const ENDPOINT = urlPath

const BottomTabNav = () => {

    const { auth } = useSelector(state => state)

    return(
        <Tab.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle:{
                    backgroundColor: 'black'
                }
            }}
        >
            <Tab.Screen name='HomeScreen' component={HomeScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image 
                            style={{width:30, height:30}}
                            source={{uri: focused ? bottomTabIcons[0].active : bottomTabIcons[0].inactive}}
                            resizeMode='contain'
                        />
                    </View>
                )
            }}
            />
            <Tab.Screen name='DiscoverScreen' component={DiscoverScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image 
                            style={{width:30, height:30}}
                            source={{uri: focused ? bottomTabIcons[1].active : bottomTabIcons[1].inactive}}
                            resizeMode='contain'
                        />
                    </View>
                )
            }} />
            <Tab.Screen initialParams={{id: auth.user._id}} name='ProfileScreen' component={ProfileScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image 
                            style={{width:30, height:30, borderRadius: 50, borderWidth: focused ? 2 : 0, borderColor: 'white'}}
                            source={{uri: auth.user.avatar}}
                            resizeMode='contain'
                        />
                    </View>
                ),
                tabBarVisible: false,
            }}/>
            
            <Tab.Screen initialParams={{id: auth.user._id}} name='OtherProfileScreen' component={OtherProfile} options={{
               tabBarButton: () => null,
               tabBarVisible: false,
            }}/>
            
            <Tab.Screen name='NewPostScreen' component={NewPostScreen} options={{
               tabBarButton: () => null,
               tabBarVisible: false,
            }}/>
            
            <Tab.Screen initialParams={{id: auth.user._id}} name='MessageScreen' component={MessageScreen} options={{
               tabBarButton: () => null,
               tabBarVisible: false,
            }}/>
            
            <Tab.Screen name='UserMessageScreen' component={UserMessageScreen} options={{
               tabBarButton: () => null,
               tabBarVisible: false,
            }}/>
        </Tab.Navigator>
    )
}

const SignedInStack = () => {
    const dispatch = useDispatch()

    useEffect(() => {
      const socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] })
      dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
  
      return () => socket.close()
  
    },[dispatch])

    return(
    <NavigationContainer>
        <Stack.Navigator 
            initialRouteName='LoginScreen' 
            screenOptions={screenOptions}
        >
            <Stack.Screen name ='LoginScreen' component={LoginScreen} />
            <Stack.Screen name ='RegisterScreen' component={RegisterScreen} />
            <Stack.Screen name ='Home' component={BottomTabNav} />
        </Stack.Navigator>
    </NavigationContainer>
    )
}


// const SignedOutStack = () => (
//     <NavigationContainer>
//         <Stack.Navigator 
//             initialRouteName='LoginScreen' 
//             screenOptions={screenOptions}
//         >
//             <Stack.Screen name ='LoginScreen' component={LoginScreen} />
//             <Stack.Screen name ='SignUpScreen' component={SignUpScreen} />
//         </Stack.Navigator>
//     </NavigationContainer>
// )

export default SignedInStack

// const styles = StyleSheet.create({})