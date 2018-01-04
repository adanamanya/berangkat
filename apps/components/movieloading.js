//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import Geocoder from 'react-native-geocoder';
import rnfirebase from '../components/rnfirebase';
export default class MovieLoading extends Component {
 constructor(props) {
  super(props);
  this.state = {
    place: {},
    kecamatan: {},
    kota: {}
}
 }

 componentDidMount() {
  this.getCoordinates();
 }

 componentWillMount() {
  navigator.geolocation.clearWatch(this.watchId);
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
   { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 }
  );
 }

 getcurrentcity(){
  console.log(this.state.kecamatan)
  const cityref = rnfirebase.firestore().collection('kelurahan');
  const queryRef = cityref.where("kecamatan", "==", this.state.kecamatan.toString());
  let kotaq = [];
  queryRef.get()
 .then(snapshot => {
  console.log('nyari kelurahanmu')
  snapshot.forEach(doc => {
   kotaq.push(doc.data());
  });
 })
 .then(() => {
   console.log('dapetin kota');
   this.setState({ kotaq: kotaq[0]});
   this.setState({ kota: kotaq[0].kabupaten});
    console.log(this.state.kota);
    alert(this.state.kota);
    // this.getmoviesnp();
    // this.getnearhotels();
 })
 }

 getCity(location) {
  var myloc = [];
  Geocoder.geocodePosition(location)
   .then(res => {
    this.setState({
      kecamatan: res[0].locality.toString() // access from response.data.results[0].formatted_address
    })
   })
  //  .catch(error => console.error('Error: ', error));
  //   axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.lat + ',' + location.lng + '&sensor=true&key=AIzaSyBxcWeYOWlR4-tywkNvVeTGMMl20QznhZM')
  //  .then(response => {
  //   console.log(response);
  //   let city = response.data.results[2].address_components[2].short_name;
  //   if (city.includes('Jakarta')) {
  //    city = 'Jakarta';
  //   }
  //   this.setState({ city: city });
  //  })
   .then(() => {
    console.log(this.state.kecamatan);
    this.getcurrentcity();
    // setTimeout(() => Actions.menu({ kecamatan: this.state.kecamatan }), 3000);
   })
   .catch(error => console.log('Error: ', error));
 }

 render() {
  
  return (
   <LinearGradient
    colors={['#b721ff', '#21d4fd']}
    style={styles.container}
    start={{ x: 1, y: 0}}
    end={{ x:0, y:1 }}
   >
    <Spinner style={styles.spinner} isVisible={true} size={100} type={'9CubeGrid'} color={'#FFF'} />
    <Text style={styles.text} >Hang on, we're preparing some magic for you.</Text>
   </LinearGradient>
  );
 }
}

// define your styles
const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#2c3e50',
 },
 spinner: {
  marginBottom: 50
 },
 text: {
  color: '#FFF',
  backgroundColor: 'transparent',
  marginHorizontal: 50,
  fontSize: 24,
  fontWeight: '600',
  fontFamily: 'Avenir Next',
 }
});