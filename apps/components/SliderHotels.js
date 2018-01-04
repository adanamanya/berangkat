import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../components/SliderEntry.style';
import {Actions} from "react-native-router-flux";
import { ParallaxImage } from 'react-native-snap-carousel';
import _ from 'lodash';
import rnfirebase from '../components/rnfirebase';
export default class SliderHotels extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    Harga1: PropTypes.string,
    hotel_name: PropTypes.string,
    url_image_traveloka: PropTypes.string,
    url_image_misteraladin: PropTypes.string,
    harga_traveloka: PropTypes.string,
    harga_misteraladin: PropTypes.string
  };

  get image() {
    const { data: { url_image_misteraladin, url_image_traveloka }, parallax, parallaxProps, even } = this.props;

    return parallax ? (
      <ParallaxImage 
        source={{ uri: url_image_traveloka == 'NA' ? url_image_misteraladin : url_image_traveloka }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={[styles.image, { position: 'relative' }]}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image 
        source={{ uri: Img_src }}
        style={styles.image}
      />
    );
  }

  render() {
    const { data: { hotel_name, harga_traveloka, harga_misteraladin }, even } = this.props;

    const uppercaseTitle = hotel_name ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
       >
        { hotel_name.toUpperCase() }
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={ 
          
          () => {
           rnfirebase.analytics().logEvent('hotels_slider_press');
            //this.gomovies(uppercasetitle)
            Actions.HotelDetails({ hotel: hotel_name })
            //Actions.movieloading({ tititKuda: title})
          }}
       >
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {} ]} >
          {this.image}
          <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]} >
          { uppercaseTitle }
          <Text style={[styles.subtitle, even ? styles.subtitleEven : {}]} >
            Harga Mulai: {harga_traveloka == 'NA'? harga_misteraladin : harga_traveloka}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
   gohotel(){
        Actions.hoteldetails({hotel: hotel_name});
    }
}