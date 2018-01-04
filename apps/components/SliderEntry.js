import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../components/SliderEntry.style';
import {Actions} from "react-native-router-flux";
import { ParallaxImage } from 'react-native-snap-carousel';
import rnfirebase from '../components/rnfirebase';

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    url: PropTypes.string,
    title: PropTypes.string,
    img: PropTypes.string
  };
 

  get image() {
    const { data: { img }, parallax, parallaxProps, even } = this.props;
    
      return parallax ? (
      <ParallaxImage 
        source={{ uri: img }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={[styles.image, { position: 'relative' }]}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image 
        source={{ uri: image.img }}
        style={styles.image}
      />
    );
  }

  render() {
    const { data: { title, url }, even } = this.props;

    const uppercasetitle = title ? (
      <Text
        style={[{textDecorationLine: 'underline' },styles.title, even ? styles.titleEven : {}]}
       >
        { title.toUpperCase() }
      </Text>
    ) : false;

    return (
      <View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={ 
          
          () => {
           rnfirebase.analytics().logEvent('movie_slider_press');
            //this.gomovies(uppercasetitle)
            Actions.MovieReview({ pelem: title})
            //Actions.movieloading({ tititKuda: title})
          }}
       >
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {} ]} >
          {this.image}
          <View style={[ styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]} >
          { uppercasetitle }
        </View>
      </TouchableOpacity>
      </View>
    );
  }
  gomovies(title){
    console.log(title)
    console.log(this.props.data.title)
    const tititKuda = toString(this.props.data.title);
        Actions.MovieReview({ taiKucing: data});
    }
}
