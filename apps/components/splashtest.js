// Import component
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Geocoder from 'react-native-geocoder';
import axios from 'axios';
import _ from 'lodash';
import * as firebez from 'firebase';
import { Actions } from 'react-native-router-flux';
// Import NativeBase Components
import {
  Header, Left, Body, Right, Button, Icon, Title, Content, Spinner,  Tab, Tabs, TabHeading
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
export default class splashtest extends Component {
  
      constructor(props) {
		super(props);
		this.state = {
		status: false,
        number: null,
        counter: 0
		};
	}
  ComponentDidMount(){
    this.timer = setInterval(()=> this.getMovies(), 100);
}

   

async getMovies(){
this.setState({
status: true
        });
console.log(this.state.status);         
}
  
  render() {
  alert(this.state.status);   
    return (
      <Text>Hello world! {this.state.status}</Text>
    );
  }
}