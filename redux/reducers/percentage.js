import { GLOBALTYPES } from '../actions/globalTypes'

const initialState={
    percent: '0'
}

const percentageReducer = (state = initialState, action) => {
    switch (action.type){
        case 'SET_PERCENT':
            return action.payload;
        default:
            return state;
    }
}


export default percentageReducer