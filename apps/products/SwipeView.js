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
    Icon,
    Tabs,
    Tab,
    DeckSwiper,
    Thumbnail,
    Card,
    CardItem,
    List,
    ListItem,
    Spinner,
    H3,
    H2,
    CheckBox
} from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import DoubleClick from 'react-native-double-click';
import Modal from 'react-native-modalbox';
import { firebaseApp } from '../components/firebase';
import * as firebase from 'firebase';
import { Kaede } from 'react-native-textinput-effects';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window');

var hotelzz;

export default class Menu extends Component {
     componentWillMount() {
        this.currentUser = firebase.auth().currentUser;
        console.log(this.currentUser);
        console.log(this.currentUser.uid);
        this.setState({
            uid: this.currentUser.uid
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            spinnerColor: 'transparent',
            searchVisible: false,
            selectedItem: undefined,
            modalVisible: false,
            loading: true,
            search: '',
            hotels: {
            }
        };
    }

    search() {
        this.setState({
            spinnerColor: 'blue',
            loading: true
        });

        var that = this;
        return fetch('https://travelokadbjkt.firebaseio.com/hotel/'+this.state.search+'.json')
            .then((response) => response.json())
            .then((responseJson) => {
                that.setState({
                    hotels: responseJson,
                    loading: false,
                    searchVisible: true
                });
                this.state.hotels = this.state.hotels.bind(this);
                return responseJson.Search;
            })
            .catch((error) => {
                that.setState({
                    loading: false
                });
            });
            
    }
 setModalVisible(visible, x) {
    console.log(x.Nama);
    this.setState({
      modalVisible: visible,
      selectedItem: x
    })
    console.log(!this.state.selectedItem);
    this.refs.modal.open();
  }
    render() {
        return (
            <View style={styles.container}>
            <Modal
          ref={"modal"}
          position={"center"}
          swipeToClose={true}
          style={styles.modal}
          isOpen={this.state.modalVisible}
         
          >
          <View>
             <Button style={{ backgroundColor: 'transparent', justifyContent: 'flex-end'}}  onPress={() => this.setState({modalVisible: false})}><Text style={{color:'white'}}>Tap to close</Text></Button>
            { !this.state.selectedItem ? <View /> :
            <Card style={[styles.cardSize]}>
              <CardItem style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
                <H2 style={styles.header}>{this.state.selectedItem.Nama}</H2>
              </CardItem>
              <CardItem style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
                <Image style={styles.modalImage} source={{uri: this.state.selectedItem.img6}} />
              </CardItem>
              <ListItem >
              <Thumbnail style={styles.imageStyle} source={require('../src/img/ma.jpg')} />
              <Body>
                <Text style={{color:'black'}}>Harga MisterAladin: {this.state.selectedItem.Harga1 == '' ? 'Not Available' : this.state.selectedItem.Harga1}</Text>
                <Text note>View more..</Text>
              </Body>
            </ListItem>
            <ListItem >
              <Thumbnail style={styles.imageStyle} source={require('../src/img/Traveloka.png')} />
              <Body>
                <Text style={{color:'black'}}>Harga Traveloka: {this.state.selectedItem.hargatraveloka == '' ? 'Not Available' : this.state.selectedItem.hargatraveloka}</Text>
                <Text note>View more..</Text>
              </Body>
            </ListItem>
          </Card>
          }
          </View>
        </Modal>
                <Header hasTabs style={{ backgroundColor: '#00bfa5'}} iosStatusbar="light-content"
                androidStatusBarColor='#00bfa5' >
                    <Left>
                        <Button transparent onPress={this._goBack}>
                            <Icon ios="ios-arrow-back" android="ios-arrow-back" style={{color: '#FFF'}} />
                        </Button>
                    </Left>
                    <Title style={{color: '#FFF', paddingTop: 13}} >Travel</Title>
                    <Right />
                </Header>
                <Container style={{marginBottom: -25}} >
                    <Content>
                    {/*<Image source={hotel} resizeMode="contain" />*/}
                        <Text style={styles.searchText} >Search for hotels...</Text>
                        <Kaede
                            value={this.state.search}  onChangeText={(text) => this.setState({search:text})} onSubmitEditing={()=>this.search()}
                            label={'Destination'}
                        />
                        <Button onPress={ () => this.search() } style={{alignSelf: 'center', marginTop: 15}} >
                            <Text style={{color: '#FFF', fontWeight: 'bold'}} >Search</Text>
                        </Button>
                           
                    </Content>
                </Container>
                <Container style={{marginTop: -170}} >
                     
                    {this.state.loading? <Spinner color={this.state.spinnerColor} /> : 
                        <DeckSwiper
                         dataSource={this.state.hotels}
                         renderItem={(hotel) =>
                            <DoubleClick onClick={this.right.bind(this, hotel.Nama, hotel.img1)} >
                                <Card style={styles.card}>
                                    <CardItem>
                                        <Text style={styles.cardText}>{hotel.Nama}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Image style={{width: width * 0.92, height: height * 0.25, borderRadius: 8}} source={{uri: hotel.img1}} />
                                    </CardItem>
                                    <CardItem>
                                    
                                    <Icon style={{color: 'blue'}} name="ios-pricetag" />
                                    <Text style={styles.cardIconText}>Harga Mulai dari: {hotel.Harga1}</Text>
                                    <Button onPress={() => this.setModalVisible(true, hotel)} info style={{ marginLeft: 35, height: 50, width: 120, borderRadius:9 }} >
                                    <Text style={{ color: '#FFF', fontSize: 16}} >View More</Text>
                                    </Button>  
                                    </CardItem>
                                </Card>
                            </DoubleClick>}
                        /> }
                </Container>
            </View>
        );
        
    }
    _goBack = () => {
       Actions.tabbar({type: 'reset'});
  }
   right(hotel, img) {
       firebaseApp.database().ref('users/' + this.state.uid + '/fav/' + hotel).set({
          hotel,
          img
        })
        alert(`added to favorites ${hotel}`);
        alert(`added to favorites ${img}`);
        console.log()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
     modalButton: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  modal: {
    justifyContent: 'center',
    borderRadius:5,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
   card:{
    width:-20,
    height:410,
    borderRadius:5,
    borderWidth:1,
    borderColor:"#e1e1e1",
    position:"absolute",
    left:10,
    top:70,
    backgroundColor:"#fff"
  },
  cardInfo:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    height:60,
    paddingLeft:20,
    paddingRight:5
  },
  cardText:{
    fontSize:18,
    fontWeight:"500",
    color:"#423e39"
  },
  cardIcon:{
    flexDirection:"row"
  },
  cardIconContainer:{
    width:50,
    flexDirection:"row",
    alignItems:"center",
  },
  cardIconText:{
    paddingLeft:5,
    fontWeight:"500",
    fontSize:14
  },

    searchText: {
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6a7989',
    },
    butonz: {
        alignSelf: 'center',
    },
    hotel: {
        alignSelf: 'stretch',
        flex: 1,
    },
    background: {
        width,
        height,
    },
    header : {
        marginLeft: -5,
        marginTop: 5,
        marginBottom: (Platform.OS==='ios') ? -7 : 0,
        lineHeight: 24,
        color: '#5357b6'
    },
   negativeMargin: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingLeft: 16
  },
     modalImage: {
    marginTop: -20,
    resizeMode: 'contain',
    width: width * 0.9,
    height: height * 0.35
  },
    bold: {
        fontWeight: '600'
    }
});