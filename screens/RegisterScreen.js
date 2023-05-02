import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { postDataAPI } from '../utils/fetchData';
import { urlPath } from '../components/URL';
import Toast from 'react-native-toast-message';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { register } from '../redux/actions/authAction';

const RegisterScreen = ({navigation}) => {
  const { auth, alert } = useSelector(state => state);
  const dispatch = useDispatch();

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

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

  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorBody, setErrorBody] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);
  const [hashValue, setHashValue] = useState('');

  const [userConfirmed, setUserConfirmed] = useState(false);
  const [userConfirmedNotif, setUserConfirmedNotif] = useState(false);

  const [page, setPage] = useState(1);

  const initialState = { 
    fullname: '', username:'', mobile: '', otp:'', email: '', gender: 'male', language: 'english', qualification: 'farmer'
  }
  const [userData, setUserData] = useState(initialState);
  const { fullname, username, mobile, otp, email, password, cf_password } = userData;

  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const handleSignup = () => {
    console.log(userData)
    dispatch(register(userData))
  }

  let timer;
  useEffect(() => {
    if (startTimer) {
      timer = setInterval(() => {
        setSeconds(seconds - 1);

        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }

        if (minutes === 0 && seconds === 0) {
          setStartTimer(false);
        }
      }, 1000);
    } else {
      setMinutes(1);
      setSeconds(59);
    }

    return () => clearInterval(timer);
  });

  const handleNavigate = async() => {
    let at = await AsyncStorage.getItem("accesstoken")
    if(at){
      navigation.replace('Home')
    }
  }

  useEffect(() => {
    handleNavigate()    
  }, [auth.token]);

  useEffect(() => {
    if(alert.error){
      setError(true);

      setTimeout(() => {
        if(alert.error === "User with these details already exists"){
          setErrorTitle('Mobile number or Email or Username already exists');
        } else{
          setErrorTitle('Error');
        }
        setErrorBody(`${alert.error}`);
        setError(false);
      }, 3000);
    }
  }, [alert])

  
  const decreasePage = () => {
    if (page === 1) return;

    if (page > 1) {
      setPage(page - 1);
    }
  }

  const increasePage = () => {
    if (page === 3 && !userConfirmed) return;

    if (page < 4) {
      setPage(page + 1);
    }
  }

  const getOtp = async() => {

    if (mobile.length !== 10) {
      setErrorTitle('Invalid Mobile Number');
      setErrorBody('Mobile number must be 10 digits long');
      setError(true);

      setTimeout(() => {
        setErrorTitle('');
        setErrorBody('');
        setError(false);
      }, 3000);

      return;
    }

    const post = { phone: mobile };
    const body = JSON.stringify(post);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      let res = await axios.post(`${urlPath}/api/getOtp`, body, config);
      setHashValue(res.data.data.hash);
      setStartTimer(true);
    } catch(err){
        console.log(err)
    }

    setOtpSent(true)
    setTimeout(() => {
        setOtpSent(false)
      }, 3000)

    return
}

const handleOtpChange = name => async(value) => {
    if(value.length > 6){
        value = value.slice(0,6)
    }
    setUserData({...userData, [name]:value})

    

    if(value.length === 6){
        const post = {phone: mobile, [name]: value, hash: hashValue}
        const body = JSON.stringify(post)
        const config = {
            headers:{
                "Content-Type": "application/json"
            }
        }
        try{
            let res = await axios.post(`${urlPath}/api/verifyOtp`, body, config)
            if(res?.data.message === 'User Confirmed'){
                setUserConfirmed(true)
                setUserConfirmedNotif(true)
                setStartTimer(false)
                setTimeout(() => {
                    setUserConfirmedNotif(false)
                  }, 3000)
            }
        } catch(err){
            console.log(err.response.data.message)
            setErrorTitle(err.response.data.message)
            setErrorBody('wrong OTP entered')
            setError(true)
            setStartTimer(false)

            setTimeout(() => {
                setErrorTitle('')
                setError(false)
              }, 3000)
        }
    }
}

const handleChangeInput = (name,value) => {
  console.log(name, value)
    setUserData({...userData, [name]:value})
}

const handleChangeTextInput = name => value => {
    setUserData({...userData, [name]:value})
}

const handleSubmit = () => {
    // dispatch(register(userData))
}

return (
    <View style={styles.container}>
        {error && showToast({title:errorTitle,body:errorBody}, setError, "error")}
        {otpSent && showToast({title:"OTP sent",body:"OTP has been sent"}, setOtpSent, "success")}
        {userConfirmedNotif && showToast({title:"Number Verified",body:"Mobile Number has been verified"}, setUserConfirmedNotif, "success")}
        {/* {error && <Toast msg={{title:errorTitle,body:errorBody}} handleShow={() => setError(false)} bgColor="error" />}
        {otpSent && <Toast msg={{title:"OTP sent ",body:"OTP has been sent"}} handleShow={() => setOtpSent(false)} bgColor="success" />}
        {userConfirmedNotif && <Toast msg={{title:"Number Verified",body:"Mobile Number has been verified"}} handleShow={() => setUserConfirmedNotif(false)} bgColor="success" />} */}
        <View style={{zIndex: 10}}>
          {errorTitle && <Toast />}
        </View>
        <View style={{width: SCREEN_WIDTH/1.2, height: SCREEN_HEIGHT, marginTop: 20}}>
            {page === 1 && (
                <View style={{marginTop: 20}}>
                    <Text style={[styles.displayText, {fontSize: 30, fontWeight: 'bold'}]}>Select Language</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 0, marginBottom: 1, marginTop: 20}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton color="cyan" value="english" status={userData.language === 'english' ? 'checked' : 'unchecked'} onPress={() => handleChangeInput('language', 'english')} />
                            {/* <RadioGroup radioButtons={{id: 1, value: 'english'}} onPress={() => handleChangeInput('language', 'english')} /> */}
                            <Text style={[styles.displayText, {fontSize: 20}]}>English</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton color="cyan" value="hindi" status={userData.language === 'hindi' ? 'checked' : 'unchecked'} onPress={() => handleChangeInput('language', 'hindi')} />
                            {/* <RadioGroup radioButtons={{id: 2, value: 'hindi'}} onPress={() => handleChangeInput('language', 'hindi')} /> */}
                            <Text style={[styles.displayText, {fontSize: 20}]}>Hindi</Text>
                        </View>
                    </View>
                </View>
            )}
            {page === 2 && (
                <View>
                    <Text style={[styles.displayText, {fontSize: 30, fontWeight: 'bold'}]}>Select One</Text>
                    <View style={{padding: 15, marginHorizontal: 0, marginBottom: 1, marginTop: 5}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                            <RadioButton color="cyan" value="farmer" status={userData.qualification === 'farmer' ? 'checked' : 'unchecked'} onPress={() => handleChangeInput('qualification', 'farmer')} />
                            {/* <RadioGroup radioButtons={{id: 3, value: 'farmer'}} onPress={() => handleChangeInput('qualification', 'farmer')} /> */}
                            <Text style={[styles.displayText, {fontSize: 20}]}>I am a farmer</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton color="cyan" value="expert" status={userData.qualification === 'expert' ? 'checked' : 'unchecked'} onPress={() => handleChangeInput('qualification', 'expert')} />
                            {/* <RadioGroup radioButtons={{id: 4, value: 'expert'}} onPress={() => handleChangeInput('qualification', 'expert')} /> */}
                            <Text style={[styles.displayText,{fontSize: 20}]}>I am an Agricultural Expert</Text>
                        </View>
                    </View>
                </View>
            )}
            {page === 3 && 
                <View>
                    <View style={styles.otpPhoneContainer}>
                        <Text style={styles.displayText}>Phone Number*</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='numeric' 
                            maxLength={10} 
                            onChangeText={handleChangeTextInput('mobile',mobile)} 
                            value={mobile} 
                        />
                        <Text style={styles.displayText}>
                            We'll never share your number with anyone else.
                        </Text>
                    </View>

                    <View style={styles.getOtpContainer}>
                        {startTimer ?
                        (<TouchableOpacity style={styles.timerButton}>
                            <Text style={styles.displayText}>
                                {minutes < 10 ? '0'+ minutes: minutes}:{seconds < 10 ? '0'+ seconds: seconds}
                            </Text>
                        </TouchableOpacity>) :
                        (<TouchableOpacity onPress={getOtp} style={styles.OTPbutton}>
                            <Text style={styles.buttonText}>Get OTP</Text>
                        </TouchableOpacity>)

                        }
                    </View>

                    <View style={styles.otpTextContainer}>
                        <Text style={styles.displayText}>OTP</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='numeric' 
                            maxLength={6} 
                            onChangeText={handleOtpChange('otp', otp)} 
                            value={otp} 
                        />
                    </View>
                </View>
            }
            {page === 4 && 
                <View>
                    {/* <Text style={styles.mainHeading}>Social Media</Text> */}

                    <View style={styles.formGroup}>
                        <Text style={styles.displayText}>Full Name*</Text>
                        <TextInput 
                            style={[styles.input, alert.fullname && {backgroundColor: '#fd2d6a14'}]} 
                            onChangeText={handleChangeTextInput('fullname', fullname)} 
                            value={fullname} 
                        />
                        {alert.fullname && <Text style={styles.errorText}>{alert.fullname}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.displayText}>User Name*</Text>
                        <TextInput 
                            style={[styles.input, alert.username && {backgroundColor: '#fd2d6a14'}]} 
                            onChangeText={handleChangeTextInput('username', username)} 
                            value={username?.toLowerCase().replace(/ /g, '')} 
                        />
                        {alert.username && <Text style={styles.errorText}>{alert.username}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.displayText}>Email address (optional)</Text>
                        <TextInput 
                            style={[styles.input, alert.email && {backgroundColor: '#fd2d6a14'}]} 
                            onChangeText={handleChangeTextInput('email', email)} 
                            value={email} 
                        />
                        {alert.email && <Text style={styles.errorText}>{alert.email}</Text>}
                    </View>

                    <View style={[styles.row, styles.mb1]}>
                        <View style={styles.radioContainer}>
                            <Text style={styles.displayText}>Male:</Text>
                            <RadioButton 
                                color="cyan"
                                value="male"
                                status={userData.gender === 'male' ? 'checked' : 'unchecked'}
                                onPress={() => handleChangeInput('gender','male')}
                            />
                            {/* <RadioGroup radioButtons={{id: 5, value: 'male'}} onPress={() => handleChangeInput('gender', 'male')} /> */}
                        </View>

                        <View style={styles.radioContainer}>
                            <Text style={styles.displayText}>Female:</Text>
                            <RadioButton
                                color="cyan"
                                value="female"
                                status={userData.gender === 'female' ? 'checked' : 'unchecked'}
                                onPress={() => handleChangeInput('gender','female')}
                            />
                            {/* <RadioGroup radioButtons={{id: 6, value: 'female'}} onPress={() => handleChangeInput('gender', 'female')} /> */}
                        </View>

                        <View style={styles.radioContainer}>
                            <Text style={styles.displayText}>Other:</Text>
                            <RadioButton
                                color="cyan"
                                value="other"
                                status={userData.gender === 'other' ? 'checked' : 'unchecked'}
                                onPress={() => handleChangeInput('gender','other')}
                            />
                            {/* <RadioGroup radioButtons={{id: 7, value: 'other'}} onPress={() => handleChangeInput('gender', 'other')} /> */}
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.button, {width: '80%', marginTop: 20}]} onPress={handleSignup}>
                        <Text>Register</Text>
                    </TouchableOpacity>
                </View>
                }
 
                <View style={{position: 'absolute', width: '100%', bottom: 5}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <TouchableOpacity style={page === 1 ? styles.disableButton : styles.button} onPress={decreasePage} >
                          <Text>Previous</Text>
                      </TouchableOpacity>
                     {page !== 4 &&
                     <TouchableOpacity style={page === 4 || (page === 3 && !userConfirmed ) ? styles.disableButton : styles.button} onPress={increasePage} >
                          <Text>Next</Text>
                      </TouchableOpacity>
                      }
                  </View>
                  <Text>
                      {/* Already have an account? <Link to="/" style={{color: "rgba(0,212,255,1)"}}>Login Now</Link> */}
                  </Text>
                  <Text style={styles.switch}>
                      Already have an account? 
                  </Text>

                  <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.push('LoginScreen')}>
                      <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    },
    radioContainer:{
      flexDirection: 'row'
    },
    displayText:{
      color: 'white',
      fontSize: 20
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
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
      backgroundColor: 'black',
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
      color: 'rgb(3, 244, 252)',
      fontSize: 16,
    },
    signUpButtonText:{
      color: 'rgb(3, 244, 252)',
      fontSize: 16,
    },
    button:{
      backgroundColor: 'rgb(3, 244, 252)',
      padding: 5,
      borderRadius: 5
    },
    disableButton:{
      backgroundColor: '#09b7bd',
      padding: 5,
      borderRadius: 5
    },
    OTPbutton:{
      alignItems: 'center',
      backgroundColor: 'rgb(3, 244, 252)',
      padding: 5,
      borderRadius: 5
    },
    getOtpContainer:{
      marginTop: 20
    },
    otpTextContainer:{
      marginTop: 20
    },
    otpPhoneContainer:{
      marginTop: 20
    },
    formGroup:{
      // backgroundColor: 'red'
    },
    mainHeading:{
      marginTop: 20,
      color: 'white',
      fontWeight: 'bold'
    }
  });

export default RegisterScreen

