import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

const Header = ({navigation}) => {

    const {message} = useSelector(state => state)

  return (
    <View style={styles.container}>
        <TouchableOpacity>
            <Text style={styles.heading}>Farmer Media</Text>
        </TouchableOpacity>

        <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('NewPostScreen')}>
                <Image
                    source={{
                        uri:'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png'
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                {/* <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}></Text>
                </View> */}
                
                <Image
                    source={{
                        uri:'https://img.icons8.com/fluency-systems-regular/60/ffffff/like--v1.png'
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
                {message.redDot && 
                (<View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}></Text>
                </View>)
                }
                <Image
                    source={{
                        uri:'https://img.icons8.com/fluency-systems-regular/60/ffffff/facebook-messenger.png'
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles= StyleSheet.create({
    container:{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
    },
    heading:{
        color: 'white',
        // resizeMode: 'contain'
    },
    iconsContainer:{
        flexDirection: 'row'
    },
    icon:{
        padding: 10,
        marginLeft:5,
        width: 25,
        height: 25
    },
    unreadBadge:{
        backgroundColor: '#FF3250',
        position: 'absolute',
        left: 20,
        bottom: 15,
        width:10,
        height: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    unreadBadgeText:{
        color: 'white',
        fontWeight: '600'
    }
})

export default Header