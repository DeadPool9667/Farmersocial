import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authAction';
import Toast from 'react-native-toast-message';

const LoginScreen = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('email');

  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorBody, setErrorBody] = useState('');

  let dispatch = useDispatch()

  const { auth, alert } = useSelector(state => state)

  const showToast = (msg, handleShow, bgColor) => {
    Toast.show({
      type: bgColor,
      text1: msg.title,
      text2: msg.body,
      autoHide: true,
      visibilityTime: 2500,
      onHide: () => handleShow(false)
    })
  }

  const handleLogin = () => {
    if (loginType==='email' && email === '' || password === '') {
        Alert.alert('Input fields cannot be empty');
        return;
      }
    // console.log(`Mobile Number: ${mobileNumber}, OTP: ${otp}`);
      dispatch(login({email, password}))
  };

  const handleNavigate = async() => {
    let at = await AsyncStorage.getItem("accesstoken")
    if(at){
      navigation.replace('Home')
    }
  }

  useEffect(() => {
    if(alert.error){
      setError(true);

      setTimeout(() => {
        setErrorTitle('Error');
        setErrorBody('Invalid details, user does not exist');
        setError(false);
      }, 3000);
    }
  }, [alert])


  useEffect(() => {    
    handleNavigate()  
    }, [auth.token])
  

  const handleLoginTypeSwitch = () => {
    setLoginType(loginType === 'mobile' ? 'email' : 'mobile');
  };

  return (
    <View style={styles.container}>
      {error && showToast({title:errorTitle,body:errorBody}, setError, "error")}
      {errorTitle && <Toast />}
      {loginType === 'mobile' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor='gray'
            keyboardType="numeric"
            value={mobileNumber}
            onChangeText={(text) => setMobileNumber(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor='gray'
            keyboardType="numeric"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor='gray'
            value={email}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor='gray'
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </>
      )}

        <View style={{flexDirection: 'row', marginBottom:15}}>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyleSignUp} onPress={() => navigation.push('RegisterScreen')}>
                <Text style={styles.signUpButtonText}>SignUp</Text>
            </TouchableOpacity>
        </View>

        <Text>Or</Text>
        <Text style={styles.switch} onPress={handleLoginTypeSwitch}>
            Login with {loginType === 'mobile' ? 'Email and Password' : 'Mobile Number and OTP'}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    fontSize: 16,
    color: 'white',
  },
  switch: {
    marginTop: 10,
    color: 'rgb(3, 252, 165)',
    textDecorationLine: 'underline',
  },
  buttonStyle:{
    marginLeft: 5,
    backgroundColor: 'rgb(3, 244, 252)',
    padding: 5,
    borderRadius: 5
  },
  buttonStyleSignUp:{
    marginLeft: 5,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpButtonText:{
    color: 'rgb(3, 244, 252)',
    fontSize: 16,
  }
});

export default LoginScreen;
