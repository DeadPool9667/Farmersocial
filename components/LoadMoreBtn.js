import { Button } from 'react-native'

const LoadMoreBtn = ({result, page, load, handleLoadMore}) => {
    return (
        <>
            {
                result < 9 * (page - 1) ? '' : 

                !load && <Button
                onPress={handleLoadMore}>
                    Load more
                </Button>
            }
            
        </>
    )
}

export default LoadMoreBtn
