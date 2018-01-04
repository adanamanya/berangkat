import React, { Component } from 'react';
import { AppRegistry,StyleSheet, Text, View, ScrollView, Image, Dimensions, AsyncStorage, Alert, StatusBar, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { Body, Left, Right, Container, Button, Title, Header, Content, Icon } from 'native-base';
const { height, width } = Dimensions.get('window');
import { Gravatar, GravatarApi } from 'react-native-gravatar';

import Modal from 'react-native-modalbox';

const GRID = (width / 3) - 2;
import Storage from 'react-native-storage';
import {Actions} from "react-native-router-flux";
import backAndroid, {
  exitApp
} from 'react-native-back-android';
import {storage} from '../components/storage';

import * as firebase from 'firebase';
import { firebaseApp } from '../components/firebase';
const background = require('../src/img/bg2.jpg');

const iconStyles = {    // style the icons
    size: 100,
    color: '#FFFFFF',
};

const smolIcon = {
    size: 25,
    color: '#FFF',
};

const imguri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQecIROJPkPLfG-PwKKhSNAeL520r_QpiJocVUTXAWSCUpzU85FCcVDXc';

let goblok;

const styles = StyleSheet.create({
    profPic: {
        marginTop: 20,
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: 'transparent'
    },
    topSection: {
        backgroundColor: 'transparent',
        height: 185,
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    imageGrid: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    image: {
        height: GRID,
        width: GRID,
        marginBottom: 2,
        backgroundColor: 'transparent'
    },
    name: {
        marginTop: 10,
        fontSize: 18
    },
    test: {
        fontSize: 50,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    container: {
        flex: 1,
    },
    containermodal: {
        flex: 1,
        paddingBottom: -200
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
        paddingTop: 170,
        paddingVertical: 30,
    },
    inputWrap: {
        paddingLeft: 12,
        flexDirection: 'row',
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC'
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
        paddingTop: 30,
        marginBottom:-30,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#e8eaf6',
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
        textDecorationLine: 'underline', 
    }
});

export default class LogandProf extends Component {
constructor(props) {
        super(props);
        // setting up state for login
        this.state = {
            email: '',
            password: '',
            status: '',
            uname: '',
            emailretrieve: '',
            currentUser: null,
            isLogin: '',
            modalVisible: null
        };
        this.login = this.login.bind(this);

        this.state.currentUser = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isLogin: true, setModalVisible: false });
                goblok = false;
                console.log(this.state.setModalVisible);
            } else {
                this.setState({ isLogin: false, setModalVisible: true });
                goblok = true;
                console.log(this.state.setModalVisible);
            }
        });

        // Setting getting loggedin value for login and profile screen
        // if (firebase.auth().currentUser === 'undefined') {
        //     this.setState({
        //         loggedIn: false
        //     });
        //     console.log('is undefined');
        // } else {
        //     this.setState({
        //         loggedIn: true
        //     });
        // }
    }

    componentDidMount() {
        this.state.currentUser = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isLogin: true, modalVisible: false, uname: user.displayName, emailretrieve: user.email, email: user.email });
                goblok = false;
                console.log(this.state.modalVisible);
            } else {
                this.setState({ isLogin: false, modalVisible: true });
                goblok = true;
                console.log(this.state.modalVisible);
            }
        });
        console.log(goblok);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });

    }
login() {
       firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).
       then(function() {
            const that = this;
            const uid = firebaseApp.auth().currentUser.uid;
            alert(`Welcome${uid}`);
            storage.save({
            key: 'userid',
            data: uid,
            enableCache: true,
            expires: null
             });

            // LocalStorage.save('loggedin', true);
            firebaseApp.database().ref(`/users/${  uid}`).once('value').then((snapshot) => {
            const username = snapshot.val().name;
            const email = snapshot.val().email;

            that.currentUser = firebase.auth().currentUser;
            console.log(uid);
            that.setState({
                uname: that.currentUser.displayName,
                emailretrieve: that.currentUser.email,
            });
        });
        }, (error) => {
            alert('Login Failed. Please try again');
        });
        this.setModalVisible(!this.state.modalVisible);
    }

    checkModalVisible() {
        return this.state.setModalVisible();
    }

    logout = () => {
        firebase.auth().signOut().
        then(() => {
            Alert.alert('Signed Out');
            goblok = true;
        }, (error) => {
            Alert.alert(error);
        });
        this.setModalVisible(!this.state.modalVisible);
    };
render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#e8eaf6' }} >
                    <Body>
                        <Title style={{color: 'white'}} >
                            Profile
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.logout} >
                            <Icon style={{color: 'white'}} name="settings" />
                        </Button>
                    </Right>


                </Header>
                <View style={styles.topSection}>
                    <Gravatar options={{
                        email: this.state.email,
                        parameters: { "size": "100"},
                        secure: true
                    }}
                    style={styles.profPic}
                    />
                    <Text>{this.state.uname}</Text>
                    <Text style={{ fontSize: 12 }} >{this.state.emailretrieve}</Text> 
                </View>
                <Content>
                    <View style={styles.imageGrid}>
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                        <Image source={{ uri: imguri }} style={styles.image} />
                    </View>
                </Content>
            <Modal
                animationDuration={0}
                transparent={false}
                isOpen={this.state.modalVisible}
                swipeToClose={false}
                onRequestClose={() => {alert('Modal has been closed.')}}
            >
                <View style={styles.containermodal} >
                    <StatusBar hidden={false} barStyle="light-content" />
                    <Image source={background} style={styles.backgroundd} resizeMode="cover" loaded={this.state.loaded}>
                            <View style={styles.wrapper}>
                                <View style={styles.inputWrap}>
                                    <View style={styles.iconWrap}>
                                        <Icon name="ios-person-outline" {...smolIcon} resizeMode="contain" />
                                    </View>
                                    <TextInput
                                        placeholder="Email"
                                        onChangeText={(text) => this.setState({ email: text })}
                                        value={this.state.email}
                                        placeholderTextColor="#FFFFFF"
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <View style={styles.iconWrap}>
                                        <Icon name="ios-lock-outline" {...smolIcon} resizeMode="contain" />
                                    </View>
                                    <TextInput
                                        placeholderTextColor="#FFFFFF"
                                        placeholder="Password"
                                        onChangeText={(text) => this.setState({ password: text })}
                                        value={this.state.password}
                                        secureTextEntry={true}
                                        style={styles.input}
                                    />
                                </View>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <View>
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} onPress={this.login} >
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Sign In</Text>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.signupWrap}>
                                    <Text style={{ color: '#FFF' }} >Don't have an account yet?</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }} activeOpacity={0.5} >
                                        <Text style={styles.signupLinkText}>Sign up here.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </Image>
                </View>
            </Modal>
        </Container>
        );
    }

}
