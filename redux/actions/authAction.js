import { GLOBALTYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const login = (data) => async (dispatch) => {
    // console.log(data)
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)
        // console.log(res.data.access_token)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        AsyncStorage.setItem("firstLogin", JSON.stringify(true))
        AsyncStorage.setItem("refreshtoken", res.data.refresh_token)
        AsyncStorage.setItem("accesstoken", res.data.access_token)
      
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const loginOtp = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('loginOtp', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        AsyncStorage.setItem("firstLogin", true)
        AsyncStorage.setItem("refreshtoken", res.data.refresh_token)

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}


export const refreshToken = () => async (dispatch) => {
    const firstLogin = AsyncStorage.getItem("firstLogin")
    if(firstLogin){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        try {
            const res = await postDataAPI('refresh_token')
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) => {
    const check = valid(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg})

    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        const res = await postDataAPI('register', data)
        console.log(res)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        AsyncStorage.setItem("firstLogin", true)
        AsyncStorage.setItem("refreshtoken", res.data.refresh_token)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
    } catch (err) {
        console.log(err)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: 'User with these details already exists'
            } 
        })
    }
}


export const logout = () => async (dispatch) => {
    try {
        await AsyncStorage.removeItem('firstLogin')
        await AsyncStorage.removeItem('refreshtoken')
        await AsyncStorage.removeItem('accesstoken')

        await postDataAPI('logout')
        dispatch({ 
            type: GLOBALTYPES.LOGOUT
        })
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}