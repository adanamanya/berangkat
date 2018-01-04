import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Tabs,
    Tab,
    DeckSwiper,
    Thumbnail,
    Card,
    CardItem,
    List,
    ListItem,
    Spinner

} from 'native-base';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { firebaseApp } from '../components/firebase';
import LocalStorage from 'react-native-local-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
const { width, height } = Dimensions.get('window');


export default class Loginscreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            status: '',
        };
        this.login = this.login.bind(this);
    }

    render() {
        return (
            <View style={styles.container} >
                <Content>
                <StatusBar hidden={true} barStyle='light-content'/>
                <Image source={require('../src/img/bg4.jpg')} style={styles.backgroundd} resizeMode='cover' loaded={this.state.loaded}>
                        <View style={styles.wrapper}>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-person-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TextInput
                                    placeholder='Email'
                                    onChangeText={(text) => this.setState({email: text})}
                                    value={this.state.email}
                                    placeholderTextColor='#FFFFFF'
                                    style={styles.input}
                                />
                            </View> 
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Icon name="ios-lock-outline" {...smolIcon} resizeMode='contain' />
                                </View>
                                <TextInput 
                                    placeholderTextColor='#FFFFFF'
                                    placeholder='Password'
                                    onChangeText={(text) => this.setState({password: text})}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    style={styles.input}
                                />
                            </View>
                            <TouchableOpacity activeOpacity={.5}>
                                <View>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={this.login} >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </View>
                            </TouchableOpacity>
                            <View  style={styles.signupWrap}>
                                <Text style={{color: '#FFF'}} >Don't have an account yet?</Text>
                                <TouchableOpacity onPress={this.goToSignUp} activeOpacity={.5} >
                                    <Text style={styles.signupLinkText}>Sign up here.</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Image>
                </Content>
            </View>
        );
    }

    login() {
       firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).
       then(function() {
            const uid = firebaseApp.auth().currentUser.uid;
           Actions.menudefault({type: 'reset'});
            LocalStorage.save('loggedin', 'true');
        }, (error) => {
            alert('Login Failed. Please try again');
        });
    }

    
        goToSignUp() {
        Actions.SignUp({type: 'reset'});
    }


    
}
const iconStyles = {    //style the icons
    size: 100,
    color: '#FFFFFF',
};

const smolIcon = {
    size: 25,
    color: '#FFF',
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
    backgroundd: {
        width,
        height,
    },
    markWrap: {
        flex: 1,
        paddingVertical: 30,
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
        paddingTop: height * 0.49,
        paddingVertical: 30,
    },
    inputWrap: {
        paddingLeft: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#fff9f9'
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    icon: {
        height: 20,
        width: 20,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#FFF',
    },
    forgotPasswordText: {
        color: '#D8D8D8',
        backgroundColor: 'transparent',
        textAlign: 'right',
        paddingRight: 15,
        paddingTop: 7,
    },
    signupWrap: {
        paddingTop: 15,
        marginBottom:-30,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#536DFE',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    button2: {
        backgroundColor: '#FFF',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color:'#FFF',
        fontSize: 18,
    },
    buttonText2: {
        color:'#000',
        fontSize: 18,
    },
    accountText: {
        color: '#D8D8D8'
    },
    signupLinkText: {
        color: '#FFF',
        marginLeft: 5,
        textDecorationLine: 'underline', 
    }
});