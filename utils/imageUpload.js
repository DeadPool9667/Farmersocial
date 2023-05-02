import axios from "axios"
import mime from "mime"
import { urlPath } from "../components/URL"

export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    if(file.size > 1024 * 1024) // 1mb
    err = "The largest image size is 1mb."

    if(file.type !== 'image/jpeg' && file.type !== 'image/png' )
    err = "Image format is incorrect."
    
    return err;
}


export const imageUpload = async (images) => {
    // let imgArr = [];
    const formData = new FormData()

    for(const item of images){
        // console.log('imageUpload.js item =============', item)

        if(item.camera){
            formData.append("files", item.camera)
        }else{
            formData.append("files", {uri:item.uri, type: mime.getType(item.uri), name: item.uri.split("/").pop()})
        } 
    } 

    // console.log('formData===',formData)

    const res = await axios.post(`${urlPath}/request/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },      
    })

    const {data} = res

    return data.fileArray;
}