import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import LocalStorage from 'react-native-local-storage';
import {
    Content,
    Header,
    Title,
    Button,
    Container
} from 'native-base';


import DateTimePicker from 'react-native-modal-datetime-picker';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseApp } from '../components/firebase';
import * as firebase from 'firebase';
const { width, height } = Dimensions.get('window');
export default class Login extends Component {
   constructor(props) {
    super(props);
     this.state = {
      errMsg: null,
      signUpSuccess: false,
      displayName: '',
      email: '',
      password: '',
      date1: 'Date Of Birth',
    };
    
    this._goTologin = this._goTologin.bind(this);
  }

    
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        date1 = moment(date).format('DD/MM/YYYY').toString();
        this.setState({ date1: moment(date).format('DD/MM/YYYY').toString() });
        alert('A date has been picked11: ', date);
        this._hideDateTimePicker();
    }
 render() {
        const goToLogin = () => Actions.login();
  return (
            <Container >
                <StatusBar hidden={false} barStyle='light-content' />
                <Image source={require('../src/img/bg4.jpg')} style={styles.backgroundd} resizeMode='cover'>
                    <Content>
                        <View style={styles.markWrap}>
                            <Text style={styles.test} >
                                Sign Up
                            </Text>
                        </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-person-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TextInput
                                    onChangeText={(text) => this.setState({ displayName: text })}
                                    value={this.state.displayName}
                                    placeholder='Username'
                                    placeholderTextColor='#FFFFFF'
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-mail-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TextInput
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                    placeholder='Email'
                                    placeholderTextColor='#FFFFFF'
                                    style={styles.input}
                                />
                            </View> 
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-lock-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TextInput 
                                    onChangeText={(text) => this.setState({ password: text })}
                                    value={this.state.password}
                                    placeholderTextColor='#FFFFFF'
                                    placeholder='Password'
                                    style={styles.input}
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-calendar-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TouchableOpacity onPress={this._showDateTimePicker}>
                                    <Text style={styles.inputCalendar}>{this.state.date1}</Text>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this._hideDateTimePicker}
                                />
                                
                            </View> 
                            <TouchableOpacity activeOpacity={.5} onPress={this._goTologin} >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={this._cancel} >
                                <View style={styles.buttonCancel}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </Content>

                </Image>
            </Container>
  );
 }
 _goTologin(){
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      firebase.auth().currentUser.updateProfile({
        displayName: this.state.displayName,
        
      })
      .then(() => {
        const uid = firebase.auth().currentUser.uid
        const name = this.state.displayName
        const email = this.state.email
        
        firebaseApp.database().ref('users/' + uid).set({
          name,
          email,
          uid
        })

        


        this.setState({errMsg: 'Thank you for signing up, wait for a bit to let us sign in into your account.', signUpSuccess: true})

        setTimeout(() => {
          if (firebase.auth().currentUser) {
              alert('SignUp Success');
            Actions.menudefault({type: 'reset'});
          }
        }, 1000)

      })
      .catch((error) => {
        alert('Already Registered');
      })
    })
    .catch((error) => {
        alert('Error');
    })

}
_cancel(){
Actions.loginscreen({type: 'reset'});
}

}
const iconStyles = {    //style the icons
    size: 100,
    color: '#FFFFFF',
};

const smolIcon = {
    size: 25,
    color: '#FFF',
    justifyContent: 'center',
};

const styles = StyleSheet.create({
    test: {
        fontSize: 50,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    container: {
        flex: 1,
    },

    markWrap: {
        flex: 1,
        marginVertical: 120,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mark: {
        width: null,
        height: null,
        flex: 1,
    },
    wrapper: {
        paddingVertical: 15,
    },
    inputWrap: {
        //borderWidth: 1,
        paddingLeft: 12,
        flexDirection: 'row',
        marginVertical: 10,
        marginTop: -7.5,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC'
    },
    iconWrap: {
        width: 35,
        paddingHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    backgroundd: {
        width,
        height,
    },
    icon: {
        height: 20,
        width: 20,
    },
    input: {
        fontSize: 14,
        flex: 1,
        paddingHorizontal: 10,
        color: '#FFF',
        backgroundColor: 'transparent',
    },
    inputCalendar: {
        paddingTop: 7,
        alignItems: 'center',
        fontSize: 14,
        flex: 1,
        paddingHorizontal: 10,
        color: '#FFF',
        backgroundColor: 'transparent',
    }, 
    forgotPasswordText: {
        color: '#D8D8D8',
        backgroundColor: 'transparent',
        textAlign: 'right',
        paddingRight: 15,
        paddingTop: 7,
    },
    signupWrap: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#0091ea',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
    },
    buttonCancel: {
        backgroundColor: '#d81b60',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        
    },
    buttonText: {
        color:'#FFF',
        fontSize: 18,
    },
  accountText: {
    color: '#D8D8D8'
  },
  signupLinkText: {
    color: '#FFF',
    marginLeft: 5,
  }
});