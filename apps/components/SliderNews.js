import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../components/SliderEntry.style';
import {Actions} from "react-native-router-flux";
import { ParallaxImage } from 'react-native-snap-carousel';
import rnfirebase from '../components/rnfirebase';

export default class SliderNews extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    title: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string
  };

  get image() {
    const { data: {image}, parallax, parallaxProps, even } = this.props;

    return parallax ? (
      <ParallaxImage 
        source={{ uri: image }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={[styles.image, { position: 'relative' }]}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image 
        source={{ uri: image }}
        style={styles.image}
      />
    );
  }

  render() {
    const { data: { title, url }, even } = this.props;

    const uppercasetitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
       >
        { title.toUpperCase() }
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={ 
          
          () => {
           rnfirebase.analytics().logEvent('news_slider_press');
            //this.gomovies(uppercasetitle)
            this.handleItemPress(url)
            //Actions.movieloading({ tititKuda: title})
          }}
       >
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {} ]} >
          {this.image}
          <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]} >
          { uppercasetitle }
        </View>
      </TouchableOpacity>
    );
  }
  handleItemPress(url) {
  Actions.newsdetails({url: url});
 }
gonews(){
        Actions.newsdetails({url:url});
    }
}