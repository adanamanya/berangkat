
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Icon, Header, Left, Right, Title, Content, Button, Card, CardItem, Spinner, List, ListItem, H3, H2, Thumbnail, Body } from 'native-base';
import Icon2 from '../../node_modules/react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modalbox';
import DoubleClick from 'react-native-double-click';
import { Kaede } from 'react-native-textinput-effects';
import rnfirebase from '../components/rnfirebase';
import * as firebase from 'firebase';
import { firebaseApp } from '../components/firebase';
import Geocoder from 'react-native-geocoder';
const { width, height } = Dimensions.get('window');

export default class testingmodal extends Component {
  constructor() {
    super();
    this.state = {
      spinnerColor: 'white',
      selectedItem: undefined,
      modalVisible: false,
      loading: true,
      search: '',
      hotels: {}
    };
  }
   componentWillMount() {
        this.currentUser = firebase.auth().currentUser;
        console.log(this.currentUser);
        console.log(this.currentUser.uid);
        this.setState({
            uid: this.currentUser.uid
        })
    }

    componentDidMount(){
      this.getCoordinates();
    }

    getCoordinates() {
      this.watchId = navigator.geolocation.getCurrentPosition(
       (position) => {
        const location = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
        };
        this.getCity(location);
       },
       (error) => console.error('Error: ', error),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
       }
       getCity(location) {
        var myloc = [];
        Geocoder.geocodePosition(location)
         .then(res => {
          this.setState({
          kecamatan: res[0].locality.toString() // access from response.data.results[0].formatted_address
          })
         })
         .then(() => {
          console.log(this.state.kecamatan);
          // setTimeout(() => Actions.menu({ kecamatan: this.state.kecamatan }), 3000);
         })
         .catch(error => console.log('Error: ', error));
         }   

getbycity() {
    this.setState({ loading: true, spinnerColor: 'green'});
    const hotelRef = rnfirebase.firestore().collection('hotel');
    const queryRef = hotelRef.where("location", "==", this.state.city.toString());
    let allhotels = [];
    let sortedHotels = [];
    queryRef.get()
  .then(snapshot => {
    console.log('then pertama')
    snapshot.forEach(doc => {
      allhotels.push(doc.data());
    });
  })
  .then(() => {
    console.log('then kedua');
    sortedHotels = _.sortBy(allhotels, 'harga_traveloka');
    this.setState({ hotels: sortedHotels, loading: false })
    // sortedHotels.forEach(hotel => {
    //   console.log(hotel.harga_misteraladin);
    //   this.setState({ hotels: hotel, loading: false });
    //})
  })
  .catch(err => {
    console.log('Error getting movies: ', err);
    Alert.alert('Error', 'Error : ' + err);
    
  });
      
}


  search() {
    this.setState({
        spinnerColor: 'blue',
        loading: true
    });

    return fetch('https://travelokadbjkt.firebaseio.com/hotel/'+this.state.search.toLowerCase()+'.json')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                hotels: responseJson,
                loading: false
            });
            return responseJson.Search;
        })
        .catch((error) => {
            this.setState({
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
      <Container>
         <Header hasTabs style={{ backgroundColor: '#00bfa5'}} iosStatusbar="light-content"
          androidStatusBarColor='#00bfa5' >
         <Left>
         <Button transparent onPress={() => Actions.menudefault({type:'reset'})}>
          <Icon ios="ios-arrow-back" android="ios-arrow-back" style={{color: '#FFF'}} />
          </Button>
         </Left>
           <Title style={{color: '#FFF', paddingTop: 13}} >Hotel</Title>
          <Right>
            <Button transparent onPress={this._swipe} >
            <Icon2 style={{color: '#FFFF', fontSize:22}} name="cards" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Text style={styles.searchText} >Search for hotels...</Text> 
          <Kaede
            value={this.state.city}
            onChangeText={(text) => this.setState({ city: text })}
            onSubmitEditing={() => this.getbycity()}
            label={'Search by City'}
          />
          <Button onPress={() => this.getbycity()} style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20, backgroundColor: '#21d4fd' }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>SEARCH</Text>
          </Button>
          {
            this.state.loading ? <Spinner color={this.state.spinnerColor} /> :
            <List visible={false} dataArray={this.state.hotels} renderRow={(hotel) => 
              <DoubleClick onClick={this.fav.bind(this, hotel.hotel_name, hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka)} >
                <Card>
                  <CardItem>
                    <Text>{hotel.hotel_name}</Text>
                  </CardItem>
                  <CardItem cardBody>
                    <Image style={{ width: width * 0.987, height: height * 0.25 }} source={{uri: hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka}} />
                  </CardItem>
                  <CardItem>
                    <Text>Harga Mulai dari: {hotel.harga_traveloka == 'NA'? hotel.harga_misteraladin : hotel.harga_traveloka}</Text>
                    <Button onPress={ 
                      () => {
                       rnfirebase.analytics().logEvent('view_hotel_details');
                        //this.gomovies(uppercasetitle)
                        Actions.HotelDetails({ hotel: hotel.hotel_name })
                        //Actions.movieloading({ tititKuda: title})
                      }} info style={{ marginLeft: 35 }} >
                      <Text style={{ color: '#FFF'}} >View More</Text>
                    </Button>
                  </CardItem>
                </Card>
                </DoubleClick>
              } 
            />
          }

        </Content>
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
      </Container>
    );
  }
    _goBack = () => {
       Actions.pop({});
  }
   _swipe=() =>{
      Actions.swipe({});
    }
  fav(hotel, img) {
       firebaseApp.database().ref('users/' + this.state.uid + '/favhotel/' + hotel).set({
          hotel,
          img
        })
        alert(`added to favorites ${hotel}`);
        alert(`added to favorites ${img}`);
        console.log()
    }

}
const styles = StyleSheet.create({
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
  cardSize: {
    height: 450,
    width: width * 0.9
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btn: {
    backgroundColor: "transparent",
    margin: 10,
    color: "#778899",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  searchText: {
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a7989',
    justifyContent: 'center',
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
    paddingTop: 5,
    color: '#5357b6',
    marginBottom: 10
  },
  modalImage: {
    marginTop: -20,
    resizeMode: 'contain',
    width: width * 0.9,
    height: height * 0.40
  },
  bold: {
    fontWeight: '600'
  },
  negativeMargin: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingLeft: 10
  }
});