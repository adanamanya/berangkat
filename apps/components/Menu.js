// Import component
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Geocoder from 'react-native-geocoder';

import Icon2 from '../../node_modules/react-native-vector-icons/FontAwesome';
import Icon3 from '../../node_modules/react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import _ from 'lodash';
import * as firebez from 'firebase';
import { Actions } from 'react-native-router-flux';
// Import NativeBase Components
import {
  Header, Left, Body, Right, Button, Icon, Text, Title, Content, Spinner,  Tab, Tabs, TabHeading
} from 'native-base';

// Components for Gradient
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AwesomeAlert from 'react-native-awesome-alerts';
// Import Slider
import SliderEntry from '../components/SliderEntry';
import SliderHotels from '../components/SliderHotels';
import SliderNews from '../components/SliderNews';
import Modal from 'react-native-modalbox';
import ReactNativeParallaxHeader from 'react-native-parallax-header';

// Styling Import
import { sliderWidth, itemWidth } from '../components/SliderEntry.style';
import styles, { colors } from '../components/index.style';
import rnfirebase from '../components/rnfirebase';
import { firebaseApp } from '../components/firebase';
import LocalStorage from 'react-native-local-storage';

// Slide index to display
const SLIDER_MOVIE_FIRST_ITEM = 1;
const SLIDER_HOTEL_FIRST_ITEM = 0;
const SLIDER_NEWS_FIRST_ITEM = 0;
const { width, height } = Dimensions.get('window');
const queryString = require('query-string');
const tabProps = {
  tabStyle: {backgroundColor: '#FFF'},
  tabBarUnderlineStyle: { backgroundColor: '#21d4fd' }
};
export default class App extends Component {
    
  constructor(props) {
    super(props);
 
    this.state = {
      kecamatan: this.props.kecamatan,
      sliderMovieActiveSlide: SLIDER_MOVIE_FIRST_ITEM,
      sliderMovieRef: null,
      movies: [],
      loadingData: true,
      loadingMovie: true,
      hotels: [],
      loadingHotel: true,
      sliderHotelActiveSlide: SLIDER_HOTEL_FIRST_ITEM,
      sliderHotelRef: null,
      news: [],
      loadingNews: true,
      sliderNewsActiveSlide: SLIDER_NEWS_FIRST_ITEM,
      sliderNewsRef: null,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      radius: 10,
      currentMovieDetail: {},
      loadingMovieDetail: true,
      modalVisible: false,
      currentMovieDetailTmdb: {},
      error: null,
      title: '',
      showAlert: false,
      kota:{},
      kotaq:[]
    }
  }
    componentWillMount() {
    this.currentUser = firebez.auth().currentUser;
    
    //  this.getmoviesnp();
  }
  
  componentDidMount() {
    this.getcurrentcity();
    this.getNews();
    // this.getnearhotels();
    rnfirebase.analytics().setCurrentScreen('main_menu');
    rnfirebase.analytics().setUserProperty('user','user' + this.currentUser.uid.toString());
  }

  componentWillUnmount()
  {
    this.getcurrentcity();
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
   console.log(this.state.kota.toString().substr(0,this.state.kota.toString().indexOf(' ')));
   this.getmoviesnp();
   this.getnearhotels();
})
}

 async getmoviesnp() {
    //console.log(this.state.city.toString().substr(0,this.state.city.toString().indexOf(' ')));
    //movies
    this.setState({ loading: true, spinnerColor: 'green'});
    const moviesnpref = rnfirebase.firestore().collection('moviesnp');
    // const queryRef = moviesnpref.where("city", "==", this.state.kota.toString().substr(0,this.state.kota.toString().indexOf(' ')));
    const queryRef = moviesnpref.where("city", "==", this.state.kota.toString());
    let allmovies = [];
    let sortedmovies = [];
    queryRef.get()
  .then(snapshot => {
    console.log('then pertama')
    snapshot.forEach(doc => {
      allmovies.push(doc.data());
    });
  })
  .then(() => {
    console.log('then kedua');
    sortedmovies = _.sortBy(allmovies, 'title');
    this.setState({ movies: sortedmovies, loadingMovie: false });
     console.log(this.state.movies);
  })
  .catch(err => {
    console.log('Error getting movies: ', err);
    Alert.alert('Error', 'Error getting movies: ' + err);
    
  });
  
      
}

 async getnearhotels() {
    this.setState({ loading: true, spinnerColor: 'green'});
    const hotelref = rnfirebase.firestore().collection('hotel');
    const queryRef = hotelref.where("location", "==", this.state.kota.toString().toLowerCase());
    let allhotels = [];
    let sortedhotel = [];
    queryRef.limit(6).get()
  .then(snapshot => {
    console.log('then pertama')
    snapshot.forEach(doc => {
      allhotels.push(doc.data());
    });
  })
  .then(() => {
    console.log('then kedua');
    sortedhotel = _.sortBy(allhotels, 'url_image_misteraladin');
    this.setState({ hotels: sortedhotel, loadingHotel: false });
     console.log(this.state.hotels);
  })
  .catch(err => {
    console.log('Error getting movies: ', err);
    Alert.alert('Error', 'Error getting movies: ' + err);
    
  });
      
}

 async getNews() {
    axios.get('https://travelokadbjkt.firebaseio.com/news.json')
    .then((response) => {
      const data = _.values(response.data);
      this.setState({ news: data, loadingNews: false });
      console.log(this.state.news);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  _renderMovies ({item, index}, parallaxProps) {
     
    return (
      <SliderEntry 
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  _renderHotels ({item, index}, parallaxProps) {
    return (
      <SliderHotels
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  _renderNews ({item, index}, parallaxProps) {
    return (
      <SliderNews
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }
  movies(){
    Actions.MovieList({kecamatan: this.state.kecamatan});
  }
  hotels(){
    Actions.swipe({});
  }
  news(){
    Actions.news({});
  }
 get moviesDisplay() {
  //alert(this.state.city.toString().substr(0,this.state.city.toString().indexOf(' ')));
    const { sliderMovieActiveSlide, sliderMovieRef } = this.state;
    return (
      <View style={styles.movieContainer}>
        <Text style={styles.title}>Now Playing</Text>
        <Text style={styles.subtitle}>
          Movies playing right now near you!
        </Text>
        <TouchableOpacity onPress={ () => {
           rnfirebase.analytics().logEvent('search_movie_press');
            this.movies()}}>
          <Text style={[styles.hotelSubtitle, { textDecorationLine: 'underline' }]}>Search for theaters</Text>
        </TouchableOpacity>
        <Carousel
          ref={ (c) => { if(!this.state.sliderMovieRef) { this.setState({ sliderMovieRef: c }); } }}
          data={this.state.movies}
          renderItem={this._renderMovies}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_MOVIE_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.6}
          enableMomentum={true}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          scrollEndDragDebounceValue={Platform.OS === 'android' ? 0 : 10}
          onSnapToItem={ (index) => this.setState({ sliderMovieActiveSlide: index }) }
        />
      </View>
    );
  }

  get hotelsDisplay() {

    const { sliderHotelActiveSlide, sliderHotelRef } = this.state;
    return (
      <View style={styles.movieContainer}>
        <Text style={styles.hotelTitle}>Nearest Hotels</Text>
        <Text style={styles.hotelSubtitle}>
          Looking for a place to spend the night?
        </Text>
        <TouchableOpacity onPress={ () => {
          rnfirebase.analytics().logEvent('search_movie_press');
           this.hotels()}}>
         <Text style={[styles.hotelSubtitle, { textDecorationLine: 'underline' }]}>Search for hotels</Text>
       </TouchableOpacity>
        <Carousel
          ref={ (c) => { if(!this.state.sliderHotelRef) { this.setState({ sliderHotelRef: c }); } }}
          data={this.state.hotels}
          renderItem={this._renderHotels}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_HOTEL_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.6}
          enableMomentum={false}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          scrollEndDragDebounceValue={Platform.OS === 'android' ? 0 : 10}
          onSnapToItem={ (index) => this.setState({ sliderHotelActiveSlide: index }) }
        />
        <TouchableOpacity>
          <Text style={[styles.hotelSubtitle, { textDecorationLine: 'underline' }]}>Search for hotels</Text>
        </TouchableOpacity>
      </View>
    )
  }

  get newsDisplay() {
    const { sliderNewsActiveSlide, sliderNewsRef } = this.state;

    return (
        
      <View style={styles.movieContainer}>
        <Text style={styles.newsTitle}>Latest News</Text>
        <Text style={styles.hotelSubtitle}>
          Get the freshest news, right here, right now
        </Text>
        <TouchableOpacity onPress={ () => {
          rnfirebase.analytics().logEvent('see_more_news');
           this.news()}}>
         <Text style={[styles.hotelSubtitle, { textDecorationLine: 'underline' }]}>more news</Text>
       </TouchableOpacity>
        <TouchableOpacity>
        <Carousel
          ref={ (c) => { if(!this.state.sliderHotelRef) { this.setState({ sliderHotelRef: c }); } }}
          data={this.state.news}
          renderItem={this._renderNews}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_NEWS_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.6}
          enableMomentum={false}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          scrollEndDragDebounceValue={Platform.OS === 'android' ? 0 : 10}
          onSnapToItem={ (index) => this.setState({ sliderHotelActiveSlide: index }) }
        /></TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.hotelSubtitle, { textDecorationLine: 'underline' }]}>Read all news</Text>
        </TouchableOpacity>
      </View>
    )
  }

  get gradient() {
    return (
      <LinearGradient 
        colors={[colors.background1, colors.background2]}
        start={{ x: 1, y: 0}}
        end={{ x: 0, y: 1}}
      />
    );
  }
  render() {
    
    return (
      
      <View style={styles.container}>
      
        <Header hasTabs style={{ backgroundColor: '#ffffff'}} iosStatusbar="light-content"
          androidStatusBarColor='#dfe3ee' >
          <Left />
          <View>
            <Text style={styles.headerTitle}>Berangkat </Text>
            </View>
            <Right>
            <Button transparent onPress={ 
              () => {rnfirebase.analytics().logEvent('viewprofile');
                Actions.profile({kecamatan: this.state.kecamatan, type: 'reset'})
              }} >
                <Icon2 style={{color: '#21d4fd', fontSize:22}} name="user" />
            </Button>
            </Right>
        </Header>
        
          <Tabs {...tabProps}  locked>
          <Tab   heading={ <TabHeading style = {{backgroundColor: '#FFF'}} ><Icon3 style={{fontSize:22}} name="local-movies" /><Text style={{color:'#000'}}>  Movies</Text></TabHeading>}>
          <LinearGradient
            colors={[colors.background1, colors.background2]}
            style={styles.linearGradient}
            start={{ x: 1, y: 0}}
            end={{ x: 0, y: 1}}
            >
            
          {
            this.state.loadingMovie ? <Spinner color={'white'} /> :
            <View>
              { this.moviesDisplay }
            </View>
          }
          </LinearGradient>
          </Tab>
          
           <Tab  heading={  <TabHeading  style = {{backgroundColor: '#FFF'}}><Icon2 style={{fontSize:18}} name="building" /><Text style={{color:'#000'}}>  Hotels</Text></TabHeading>}>
          <LinearGradient
            colors={['#FFF', '#EEE', '#DDD']}
          >
          {
            this.state.loadingHotel ? <Spinner color={'white'} /> :
            <View>
              { this.hotelsDisplay }
            </View>
          }
          </LinearGradient>
          </Tab>
           <Tab heading={ <TabHeading style = {{backgroundColor: '#FFF'}}><Icon2 style={{fontSize:18}} name="newspaper-o" /><Text style={{color:'#000'}}>  News</Text></TabHeading>}>
            <LinearGradient
            colors={['#FFF', '#EEE', '#DDD']}
          >
          <View style={{ borderBottomColor: '#BBB', borderBottomWidth: 1, marginHorizontal: 20 }} />
          
          {
            this.state.loadingNews ? <Spinner color={'white'} /> :
            <View>
              { this.newsDisplay }
            </View>
          }
          </LinearGradient>
          </Tab>
          </Tabs>
          
      </View>
    );
  }
}
