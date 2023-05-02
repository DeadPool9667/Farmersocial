import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { urlPath } from '../components/URL';

export const getDataAPI = async (url, token) => {
    // console.log(`sending request to ${urlPath}/api/${url}`, 'token===', token)
    const res = await axios.get(`${urlPath}/api/${url}`, {
        headers: { Authorization: token, "Content-Type" : "application/json"}
    })
    return res;
}

export const postDataAPI = async (url, post, token) => {
    let res
    let refreshtoken = AsyncStorage.getItem("refreshtoken")

    if(url === 'refresh_token'){
        const body = {refreshtoken}

        res = await axios.post(`${urlPath}/api/${url}`, body, {
            headers: { Authorization: token}
        })
        console.log(res)
    } else {
        res = await axios.post(`${urlPath}/api/${url}`, post, {
            headers: { Authorization: token}
        })
    }
    return res;
}

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`${urlPath}/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.put(`${urlPath}/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${urlPath}/api/${url}`, {
        headers: { Authorization: token}
    })
    return res;
}