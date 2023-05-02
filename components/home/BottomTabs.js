import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Divider } from 'react-native-elements'

export const bottomTabIcons = [
    {
        name: 'Home',
        active: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/home',
        inactive: 'https://img.icons8.com/fluency-systems-regular/144/ffffff/home'
    },
    {
        name: 'Search',
        active: 'https://img.icons8.com/ios-filled/500/ffffff/search--v1',
        inactive: 'https://img.icons8.com/ios/500/ffffff/search--v1'
    },
    {
        name: 'Profile',
        active: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/home',
        inactive: 'https://img.icons8.com/fluency-systems-regular/144/ffffff/home'
    }
]

const BottomTabs = ({icons, user, navigation}) => {
    const [activeTab, setActiveTab] = useState('Home')

    const handlePress = (icon) => {
        setActiveTab(icon.name)
        if(icon.name === 'Profile'){
            return navigation.navigate('ProfileScreen', {id: user._id})
        }
        
        if(icon.name === 'Home'){
            return navigation.navigate('HomeScreen')
        }
        
        if(icon.name === 'Search'){
            return navigation.navigate('DiscoverScreen')
        }
    }

    const Icon = ({icon}) => (
        <TouchableOpacity onPress={() => handlePress(icon)}>
            <Image source={{uri: icon.name === 'Profile' ? user.avatar :(activeTab === icon.name ? icon.active : icon.inactive)}} 
                style={[styles.icon, icon.name === 'Profile' ? styles.profilePic() : null,
                activeTab === 'Profile' && icon.name === activeTab ? styles.profilePic(activeTab) : null
            ]} 
            />
        </TouchableOpacity>
    )

  return (
    <View style={styles.wrapper}>
        <Divider width={1} orientation='vertical' />
        <View style={styles.container}>
        {
            icons.map((icon, index) => (
                <Icon key={index} icon={icon} />
            ))
        }
        </View>
    </View>
  )
}

export default BottomTabs

const styles = StyleSheet.create({
    wrapper:{
        position: 'absolute',
        width: '100%',
        bottom: '0%',
        zIndex: 999,
        backgroundColor: '#000'
    },

    container:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        paddingTop: 10
    },

    icon:{
        width: 30,
        height: 30,
        // margin: 5
    },

    profilePic: (activeTab = '') => ({
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: activeTab === 'Profile' ? 2 : 0
    })
})