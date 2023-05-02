import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

import AsyncStorage from '@react-native-async-storage/async-storage';

// import * as SecureStore from 'expo-secure-store';

import auth from './authReducer'
import alert from './alertReducer'
import homePosts from './postReducer'
import socket from './socketReducer'
import profile from './profileReducer'
import detailPost from './detailPostReducer'
import status from './statusReducer'
import percentage from './percentage'
import discover from './discoverReducer'
import message from './messageReducer'
import online from './onlineReducer'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth,
    alert,
    homePosts,
    socket,
    profile,
    detailPost,
    status,
    percentage,
    discover,
    message,
    online
})

export default persistReducer(persistConfig, rootReducer)