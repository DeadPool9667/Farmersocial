import { POST_TYPES } from '../actions/postAction'
import { EditData, DeleteData, GLOBALTYPES } from '../actions/globalTypes'

const initialState = {
    loading: false,
    posts: [],
    result: 0,
    page: 2,
    msg: null
}

const postReducer = (state = initialState, action) => {
    switch (action.type){
        case POST_TYPES.CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        case POST_TYPES.LOADING_POST:
            return {
                ...state,
                loading: action.payload
            };
        case POST_TYPES.GET_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                page: action.payload.page,
                msg: action.payload.msg
            };
        case POST_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
        case POST_TYPES.DELETE_POST:
            return {
                ...state,
                posts: DeleteData(state.posts, action.payload._id)
            };
        case GLOBALTYPES.ERROR:
            return{
                ...state,
                msg: action.payload
            }
        case GLOBALTYPES.CLEAR_ERROR:
            return{
                ...state,
                msg: null
            }
        default:
            return state;
    }
}

export default postReducer