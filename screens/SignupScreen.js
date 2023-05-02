import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const SignupScreen = ({navigation}) => {
  return (
    <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Go Back</Text>
        </TouchableOpacity>
      <Text>SignupScreen</Text>
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({})