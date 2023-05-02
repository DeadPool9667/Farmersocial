import React, { useState } from 'react';
import { View, Image, Dimensions, FlatList, Text } from 'react-native';

import { Video } from 'expo-av';

const CustomCarousel = ({imageArr}) => {
    const dimensions = Dimensions.get('window');
    const screenWidth = dimensions.width;
    const screenHeight = dimensions.height;

    const [currentIndex, setCurrentIndex] = useState(0);

    // const [index, setIndex] = React.useState(0)
    // const isCarousel = React.useRef(null)
    
    let data = [{url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}, {url: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__480.jpg'}]

    const handleScroll = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffset / viewSize);
        setCurrentIndex(index);
      };

  return (
    <View style={{ flex: 1}}>
    <FlatList
        style={{
            flex: 1,
            width: screenWidth,
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={imageArr}
        renderItem={({ item }) => (        
        <View style={{width: screenWidth}}>
            {     
            item.url.match(/video/)
                ?  <Video
                      source={{uri:item.url}}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      useNativeControls
                      resizeMode="contain"
                      shouldPlay={false}
                      isLooping={true}
                      style={{ height: '100%'}}
                    />
                :
                <Image
                    source={{uri:item.url}}
                    style={{height: '100%', resizeMode: 'contain'}}
                />
            }
        </View>
      )}
      onScroll={handleScroll}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
    {imageArr.map((_, index) => (
        <View
            key={index}
            style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: index === currentIndex ? 'gray' : 'white',
                margin: 5,
            }}
            />
            ))}
    </View>
  </View>

    // <View>
    //     <Carousel
    //     layout="tinder"
    //     layoutCardOffset={9}
    //     ref={isCarousel}
    //     data={imageArr}
    //     renderItem={CarouselCardItem}
    //     sliderWidth={SLIDER_WIDTH}
    //     itemWidth={ITEM_WIDTH}
    //     onSnapToItem={(index) => setIndex(index)}
    //     useScrollView={true}
    //     />
    //     <Pagination
    //     dotsLength={imageArr.length}
    //     activeDotIndex={index}
    //     carouselRef={isCarousel}
    //     dotStyle={{
    //         width: 10,
    //         height: 10,
    //         borderRadius: 5,
    //         marginHorizontal: 0,
    //         backgroundColor: 'rgba(0, 0, 0, 0.92)'
    //     }}
    //     inactiveDotOpacity={0.4}
    //     inactiveDotScale={0.6}
    //     tappableDots={true}
    //     />
    // </View>
  )
}

export default CustomCarousel

// const styles = StyleSheet.create({})




