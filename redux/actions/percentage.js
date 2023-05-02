export const setPercentage = (percent) => async(dispatch) =>{
    dispatch({ 
        type: 'SET_PERCENT', 
        payload: {percent} 
    })
}