import React from 'react';
import { Actions } from 'react-native-router-flux';
import {StyleSheet, View, Image, Dimensions, Alert, Card, ImageBackground, TouchableOpacity} from 'react-native';
import rnfirebase from '../components/rnfirebase';
const { width, height } = Dimensions.get('window');
import { Kaede } from 'react-native-textinput-effects';
import Modal from 'react-native-modalbox';
import _ from 'lodash';
import Swiper from 'react-native-deck-swiper';
import { Spinner, Content, Container, Header, Left, Right, Title, Icon, Button, Text } from 'native-base';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Icon2 from '../../node_modules/react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
import { firebaseApp } from '../components/firebase';
import Geocoder from 'react-native-geocoder';
import DoubleClick from 'react-native-double-click';
import styles from '../components/MovieDetail.style';
export default class App extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      backgroundColor:'transparent',
      city: '',
      selectedCity: '',
      hotels: {},
      textInputValue: '',
      spinnerColor: 'transparent',
      loading: true,
      selectedhotels: '',
      loadinghotels: false,
      radius: 10,
      currentHotelDetail: {},
      loadingHotelDetail: true,
      swipeAnimationDuration:5,
    }
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
    this.setState({ hotels: sortedHotels, loading: false });
  })
  .catch(err => {
    console.log('Error getting movies: ', err);
    Alert.alert('Error', 'Error getting movies: ' + err);
    
  });
      
}

  render() {
    
    return (
      <View style={styles.container}>
       <Header hasTabs style={{ backgroundColor: '#00bfa5'}} iosStatusbar="light-content"
          androidStatusBarColor='#00bfa5' >
         <Left>
          <Button transparent onPress={() => Actions.menudefault({type:'reset'})}>
          <Icon ios="ios-arrow-back" android="ios-arrow-back" style={{color: '#FFF'}} />
          </Button>
         </Left>
        <Title style={{color: '#FFF', paddingTop: 13}} >Hotel</Title>
          <Right>
              <Button transparent onPress={this._list} >
              <Icon2 style={{color: '#FFFF', fontSize:22}} name="cards-variant" />
              </Button>
          </Right>
        </Header>
      <View style={{marginBottom:-170, flex:1}}>
      <Content>
          <Text style={styles.searchText} >Search for hotels...</Text> 
          <Kaede
            value={this.state.city}
            onChangeText={(text) => this.setState({ city: text })}
            onSubmitEditing={() => this.getbycity()}
            label={'Search by City'}
          />
          <Button title="Press Me" onPress={() => this.getbycity()} style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20, backgroundColor: '#21d4fd' }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Search</Text>
          </Button>
        </Content>
        </View>
        <View style={{marginBottom: -20, marginTop:-240, height:50, flex:1}}>
          {this.state.loading? <Spinner color={this.state.spinnerColor} /> : 
          <Swiper
          backgroundColor="transparent"
          swipeAnimationDuration={1000}
          cards={this.state.hotels}
          cardIndex={0}
          renderCard={hotel => {
            return (
              <HideWithKeyboard>
              <DoubleClick onClick={this.fav.bind(this, hotel.hotel_name, hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka)} >
              <View style={[styles.swipeHotel, styles.shadowGanteng]} resizeMode="cover" >
                <View  >
                  <View style={{ alignItems: 'flex-start' }}>
                    <ImageBackground source={{uri: hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka}} style={{ height: height * 0.625 / 2, width: width * 0.8, borderTopRightRadius: 2.5, borderTopLeftRadius: 2.5, borderBottomLeftRadius: 2.5, borderBottomRightRadius: 2.5 }} resizeMode="cover">
                     <TouchableOpacity onPress={ 
                      () => {
                       rnfirebase.analytics().logEvent('view_hotel_details');
                        //this.gomovies(uppercasetitle)
                        Actions.HotelDetails({ hotel: hotel.hotel_name })
                        //Actions.movieloading({ tititKuda: title})
                      }}> 
                     <View style={{ height: height * 0.625 / 2, width: width * 0.8, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ backgroundColor: 'transparent', color: '#FFF', textAlign: 'center', paddingHorizontal: 20, fontFamily: 'Avenir Next', fontSize: 30}} >
                          {hotel.hotel_name.toUpperCase()}
                        </Text>
                      </View>
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                  <Text style={[styles.swipeScheduleText, {paddingTop: 10}]} >LOCATION</Text>
                  <Text style={{ fontFamily: 'Avenir Next', marginHorizontal: 20}} >
                    {hotel.location}
                  </Text>
                  <Text style={styles.swipeScheduleText} >HARGA MULAI DARI</Text>
                  <Text style={{ fontFamily: 'Avenir Next', marginHorizontal: 20}} >
                  {hotel.harga_traveloka == 'NA'? hotel.harga_misteraladin : hotel.harga_traveloka}
                  </Text>
                  <Text style={styles.swipeScheduleText} >RATING</Text>
                  <Text style={{ fontFamily: 'Avenir Next', marginHorizontal: 20}} >
                    {hotel.rating}
                  </Text>
                </View>
              </View>
              </DoubleClick>
              </HideWithKeyboard>
            );
          }}
        />
        //                 <Swiper
        //                 backgroundColor={this.state.backgroundColor}
        //                 swipeAnimationDuration={this.state.swipeAnimationDuration}
        //                  cards={this.state.hotels}
        //                  renderCard={(hotel) =>{
        //                    return(
        //                       <HideWithKeyboard>
        //                       <DoubleClick onClick={this.fav.bind(this, hotel.hotel_name, hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka)} >
        //                         <View style={styles.card}>
                                  
        //                           <Image style={{ width: width * 0.88, height: height * 0.32, marginTop: -30}} source={{uri: hotel.url_image_traveloka == 'NA' ? hotel.url_image_misteraladin : hotel.url_image_traveloka}}/>
        //                           <Text style={styles.cardText}>{hotel.hotel_name}</Text> 
        //                           <Text style={styles.cardText2}>Harga mulai dari: {hotel.harga_traveloka == 'NA'? hotel.harga_misteraladin : hotel.harga_traveloka}</Text> 
        //                         </View>
        //                         </DoubleClick>
        //                         </HideWithKeyboard>
        //                    ) 
        //                      }}
        //                 />
       }
            </View>
            </View>
      
    );
  }
    _goBack = () => {
      Actions.menudefault({});
  }
   _list = () => {
       Actions.list({});
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

// const styles = StyleSheet.create({
//    container: {
//     flex: 1,
//     backgroundColor:"#f7f7f7",

//   },
//   card: {
//     flex: 1,
//     width:360,
//     height:320,
//     borderRadius:6,
//     borderWidth:1,
//     borderColor:"#e1e1e1",
//     position:"absolute",
//     backgroundColor:"#fff",
//     alignSelf: 'center',
//     justifyContent:'center'
//   },
//   text: {
//     textAlign: 'center',
//     alignSelf: 'center',
//     fontSize: 50,
//     backgroundColor: 'transparent'
//   },
//   cardText:{
//     alignSelf: 'center',
//     fontSize:15,
//     fontWeight:"500",
//     color:"#423e39",
//     justifyContent: 'center',
//   },
//    cardText2:{
//     fontSize:13,
//     fontWeight:"500",
//     color:"#423e39",
//     marginTop: 15,
//     alignSelf:'center'
//   },
//    searchText: {
//     paddingTop: 15,
//     paddingBottom: 15,
//     alignItems: 'center',
//     alignSelf: 'center',
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#6a7989',
//     justifyContent: 'center',
//   },
//   thumbnail: {
//     height: 300,
//   },
//   noMoreCards: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// })