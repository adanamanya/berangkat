import React, { Component } from 'react';

import {
 AppRegistry,
 StyleSheet,
 Text,
 View,
 Image,
 ImageBackground,
 Alert,
 TouchableOpacity,
 Dimensions,
 Platform,
 TouchableWithoutFeedback,
 FlatList,
 ScrollView,
 StatusBar,
 ListView,
 Picker
} from 'react-native';

import { firebaseApp } from '../components/firebase';
import * as firebase from 'firebase';
import Icon2 from '../../node_modules/react-native-vector-icons/MaterialCommunityIcons';
import {
 Container,
 Content,
 Header,
 Left,
 Right,
 Title,
 Card,
 CardItem,
 Button,
 Icon,
 Footer,
 FooterTab,
 Body,
 Spinner,
 Form,
 Badge,
 Item as FormItem,
 DeckSwiper,
 List,
 ListItem,
 Thumbnail
} from 'native-base';

import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');

// Import React Native Firebase
import rnfirebase from '../components/rnfirebase';

// Import for firestore data
import _ from 'lodash';
import DoubleClick from 'react-native-double-click';
// LinearGradient import for lineargradient
import LinearGradient from 'react-native-linear-gradient';

// Axios import for fetching with rest api
import axios from 'axios'

import moment from 'moment';

const Item = Picker.Item;

// Import Modal
import Modal from 'react-native-modalbox';

import ReactNativeParallaxHeader from 'react-native-parallax-header';

export default class MovieList extends Component {
  componentWillMount() {
    this.currentUser = firebase.auth().currentUser;
    this.setState({
      uid: this.currentUser.uid
    })
  }
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      selectedCity: '',
      movies: undefined,
      textInputValue: '',
      spinnerColor: '#EEE',
      loading: true,
      theaters: [
        <Picker.Item label='Select City First' value='none' />
      ],
      selectedTheater: '',
      loadingTheater: false,
      picker2Text: 'Select city first.',
      radius: 10,
      currentMovieDetail: {},
      loadingMovieDetail: true,
      modalVisible: false,
      currentMovieDetailTmdb: {},
      kecamatan: this.props.kecamatan
    };
  }

  componentDidMount() {
    rnfirebase.analytics().setCurrentScreen('movie_list');
  }

  fetchTheaters(city) {

    this.setState({ loadingTheater: true, selectedCity: city, picker2Text: 'Loading...', loading: true, spinnerColor: '#EEE' });
    console.log(this.state.picker2Text)
    const movieRef = rnfirebase.firestore().collection('movies');
    const queryRef = movieRef.where("city", "==", city);

    let srcTtr = [];
    let sortedSrcTtr = [];
    let picker = [];

    queryRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          srcTtr.push(doc.data());
        });
      })
      .then(() => {
        srcTtr.forEach(data => {
          sortedSrcTtr.push(data.theater);
        });
        let uniqueTheater = _.uniq(sortedSrcTtr);
        let sortedUnique = _.sortBy(uniqueTheater);
        console.log(sortedUnique);
        sortedUnique.forEach(theater => {
          picker.push(
            <Picker.Item key={theater.index} label={theater} value={theater} />
          );
        })
        this.setState({ theaters: picker, picker2Text: 'Select theater.' });
      })
      .catch(err => {
        console.log('Error encountered: ' + err);
        Alert.alert('Error', err);
      });
  }

  fetchSchedule(theater) {
    console.log(theater);
    this.setState({ loading: true, spinnerColor: 'red', selectedTheater: theater });
    const movieRef = rnfirebase.firestore().collection('movies');
    const queryRef = movieRef.where("theater", "==", theater);

    let theaterMovies = [];
    let films = [] || this.props.films ;
    queryRef.get()
      .then(snapshot => {
        console.log('masuk then pertama')
        snapshot.forEach(doc => {
          theaterMovies.push(doc.data());
        });
      })
      .then(() => {
        console.log('masuk then kedua')
        const sortedMovies = _.sortBy(theaterMovies, 'title');
        console.log(sortedMovies);
        //console.log(sortedMovies);
        sortedMovies.forEach(film => {
          //const arrayTime = film.time.split(' ');
          films.push(
            <DoubleClick onClick={this.fav.bind(this, film.title, film.img)} >
            <Card style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, shadowColor: 'black',
            shadowOffset: { width: 0, height: 10},
            shadowOpacity: 0.30,
            shadowRadius: 10,
            borderWidth: 0
             }} >
             <TouchableOpacity onPress={() => this.setModalVisible(true, film.title)}>
              <CardItem header bordered>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }} >
                  {film.title}
                </Text>
              </CardItem>
             </TouchableOpacity>
              <CardItem>
                <Body>
                  <Text style={styles.scheduleText} >
                    Jadwal: {film.time}
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Text style={styles.scheduleText} >
                  Harga Tiket: Rp. {film.htm}
                </Text>
              </CardItem>
              <CardItem>
                <Text style={styles.scheduleText} >
                  Room Type: {film.room_type}
                </Text>
              </CardItem>
            </Card>
            </DoubleClick>
          );
        });
      })
      .then(() => {
        this.setState({ movies: films, loading: false });
      })
      .catch(err => {
        console.log('Error getting movies: ', err);
        Alert.alert('Error', 'Error getting movies: ' + err);
      });
  }

  fetchMovieDetail() {

    const year = moment().format('YYYY'); // Get current year

    // Set state to tell the modal that app is loading the movie details
    this.setState({ loadingMovieDetail: true })
    console.log(this.state.movieName)

    // Set Api keys and url for detail fetching
    const tmdbApi = '40f0539aa9a129baeea20b76a66fdf09';
    const tmdb = 'https://api.themoviedb.org/3/'
    const apiKey = '62f7960b';

    let tmdbId = ''; // tmdb movie id
    let imdbId = ''; // imdb movie id

    // Begin Get Process
    axios.get('https://www.omdbapi.com?apikey=' + apiKey + '&t=' + this.state.movieName + '&y=' + year + '&plot=short')
      .then(response => {
        const data = response.data;
        imdbId = data.imdbID;
        this.setState({
          currentMovieDetail: data
        });
        console.log(imdbId);
        console.log(tmdbApi);
        // Query tmdb database using imdb id to get tmdb movie id to get all movie details
        axios.get('find/' + imdbId + '?api_key=' + tmdbApi + '&external_source=imdb_id', {baseURL: tmdb})
        .then(response => {
          const data = response.data;
          const { id } = data.movie_results[0]; // tmdb movie id
          console.log(id)
          // Get movie details
          axios.get('movie/' + id + '?api_key=' + tmdbApi + '&append_to_response=videos,credits', { baseURL: tmdb })
          .then(response => {
            const data = response.data;

            // Get data to display on actors list
            const credits = data.credits.cast;
            let actors = []
            for (var i = 0; i < 5; i++) {
              actors.push(credits[i]);
            }

            // Parameters for file image sizes
            const posterSize = 1000; // 1000 pixels wide
            const tmdbImgUrl = 'https://image.tmdb.org/t/p/w' + posterSize;

            // Set others detail
            const tmdbRating = data.vote_average; // TMDb Rating
            const moviePoster = tmdbImgUrl + data.poster_path; // Movie Poster Url
            const movieBackdrop = tmdbImgUrl + data.backdrop_path; // Movie Backdrop Url
            const movieOverview = data.overview; // Movie Overview

            console.log(actors);
            // Set the state for display
            this.setState({
              currentMovieActors: actors,
              currentMovieTmdbRating: tmdbRating,
              currentMoviePoster: moviePoster,
              currentMovieBackDrop: movieBackdrop,
              currentMovieOverview: movieOverview,
              loadingMovieDetail: false
            });
          })
        })
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Error', error);
      });
  }

  setModalVisible(visible, x) {
    console.log(x);
    this.setState({
      movieName: x,
      loadingMovieDetail: true,
      modalVisible: visible,
    });
    console.log(this.state.modalVisible)
  }

  setModalClosed() {
    this.setState({
      modalVisible: false
    })
  }

 handleValueChange(value) {
   this.setState({
   selectedCity: value
  });
 }

 handleTheaterChange(value) {
   this.setState({ selectedTheater: value });
 }

 _keyExtractor = (item, index) => item.id;

 render() {
  return (
   <View style={styles.container}>
     <Header style={{ backgroundColor: '#f44336' }} iosBarStyle="light-content"
      androidStatusBarColor='#f44336'>
    <Left>
    <Button transparent onPress={this._goBack}>
     <Icon ios="ios-arrow-back" android="ios-arrow-back" style={{color: '#FFF'}} />
     </Button>
     </Left>
      <Title style={{color: 'white'}} >Movies</Title>
      <Right>
      
      </Right>
    </Header>
    <Container style={{marginBottom: -100}}>
     <Content>
      <LinearGradient
      colors={['#fc4a1a', '#f7b733']}
      start={{x: 0.0, y: 0.0}} end={{x: 0.5, y:1.0}}
      style={[styles.picker, {marginTop: 40, borderRadius: this.state.radius}]}>
      {
        <ScrollView>
        <Form>
          <Picker
            textStyle={styles.pickerText}
            mode='dropdown'
            placeholder='Select your city.'
            iosHeader="Select your city."
            selectedValue={this.state.selectedCity}
            onValueChange={(itemValue, itemIndex) => this.fetchTheaters(itemValue)}
            onPress={() => rnfirebase.analytics().logEvent('movie_picker_press')}
          >
            <Item label='Select City' value=''/>
            <Item label='Bekasi' value='Bekasi'/>
            <Item label='Bandung' value='Bandung' />
            <Item label='Jakarta' value='Jakarta' />
            <Item label='Tangerang' value='Tangerang' />
          </Picker>
        </Form>
        <Form>
        <Picker
        textStyle={styles.pickerText}
          mode="dropdown"
          iosHeader="Select the theater."
          placeholder={this.state.picker2Text}
          selectedValue={this.state.selectedTheater}
          onValueChange={(itemValue, itemIntex) => this.fetchSchedule(itemValue)}
          onPress={() => rnfirebase.analytics().logEvent('theater_picker_press')}
        >
          {this.state.theaters}
        </Picker>
        </Form>
        </ScrollView>
      }
      </LinearGradient>
     </Content>
    </Container>
    <Container style={{marginTop: -210}} >
      {this.state.loading? <Spinner color={this.state.spinnerColor} /> :
        <ScrollView>
          {this.state.movies}
        </ScrollView>
     }
    </Container>
    <Modal
     ref={"modal"}
     coverScreen={true}
     swipeToClose={false}
     style={styles.modal}
     isOpen={this.state.modalVisible}
     onOpened={this.fetchMovieDetail.bind(this)}
     onClosed={this.setModalClosed.bind(this)}
    >
     <View>
       {this.state.loadingMovieDetail ? <Spinner /> :
        <View style={{ backgroundColor: '#FFF', height, width}}>
          <ReactNativeParallaxHeader
            headerMaxHeight={height * 0.6}
            backgroundImage={{uri: this.state.currentMovieBackDrop}}
            renderContent={() => {
              return (
                <ImageBackground source={{ uri: this.state.currentMoviePoster }} style={{height, width}} blurRadius={100} >
                  <Content>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 44, fontWeight: '600', marginLeft: 20, marginTop: 15, marginBottom: 10, color: '#FFF',shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset:{width:0, height: 10}}} >
                        {this.state.currentMovieDetail.Title}<Text style={{fontSize: 16, color: '#DDD',}} > ({this.state.currentMovieDetail.Year})</Text>
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 20, marginBottom: -10}} >
                      <Text style={{ color: '#EEE',shadowColor: '#000', shadowOpacity: 10, shadowRadius: 10, shadowOffset:{width:0, height: 10}}} >
                        {this.state.currentMovieDetail.Rated} | {this.state.currentMovieDetail.Runtime} | {this.state.currentMovieDetail.Genre}
                    </Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 20, marginVertical: 20}} >
                      <View style={{width: 100}} >
                        <Text style={[styles.scoreText, styles.shadowGanteng]} >
                          {this.state.currentMovieDetail.Metascore}%
                        </Text>
                        <Text style={[styles.sourceText, styles.shadowGanteng]} >Metascore</Text>
                      </View>
                      <View style={{width: 100}} >
                        <Text style={[styles.scoreText, styles.shadowGanteng]}>
                          {this.state.currentMovieDetail.imdbRating}/10
                        </Text>
                        <Text style={[styles.sourceText, styles.shadowGanteng]}>iMDB</Text>
                      </View>
                      <View style={{width: 100}}>
                        <Text style={[styles.scoreText, styles.shadowGanteng]}>
                          {this.state.currentMovieTmdbRating}/10
                        </Text>
                        <Text style={[styles.sourceText, styles.shadowGanteng]}>TMDb</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={[{marginLeft: 20, color: '#FFF', marginTop: -10, marginBottom: 10}, styles.shadowGanteng]} >
                        Directed by {this.state.currentMovieDetail.Director}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}} >
                      <Text style={[{color: '#FFF', fontWeight: '600', fontSize: 15, paddingLeft: 20}, styles.shadowGanteng]} >STARRING</Text>
                      <List

                        dataArray={this.state.currentMovieActors}
                        horizontal
                        renderRow={(item) => {
                          return (
                            <ListItem style={[{flexDirection: 'column', backgroundColor: 'transparent', borderBottomWidth: 0}, styles.shadowGanteng]} >
                              <Thumbnail source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.profile_path}} style={{}} />
                              <Text style={{marginTop: 10, color: '#FFF'}}>{item.name}</Text>
                            </ListItem>
                          )
                        }}
                      />
                    </View>
                    <View style={{paddingHorizontal: 20}} >
                      <Text style={[{color: '#FFF', fontWeight: '600', fontSize: 15}, styles.shadowGanteng]} >OVERVIEW</Text>
                      <Text style={[{color: '#FFF', textAlign: 'justify', paddingTop: 10}, styles.shadowGanteng]} >
                        {this.state.currentMovieOverview}
                      </Text>
                    </View>


                  </Content>
                </ImageBackground>

              )
            }}
            renderNavBar={() => {
              return (
                  <Button style={{paddingTop: 30, paddingLeft: 5}} transparent onPress={this.setModalClosed.bind(this)}>
                    <Icon style={{color: '#FFF', fontSize: 36}} name="close"  />
                  </Button>
              )
            }}
          />

        </View>
       }
     </View>
    </Modal>
   </View>
  );
 }
 fav(title, img) {
  firebaseApp.database().ref('users/' + this.state.uid + '/favmovies/' + title).set({
     title,
     img
   })
   alert(`added to favorites ${title}`);
   alert(`added to favorites ${img}`);
   console.log()
}
  _goBack = () => {
       actions.pop();;
  }
_swipe = () => {
       Actions.movieswipe({type: 'reset'});
  }
  right(movies, img) {
    firebaseApp.database().ref('users/' + this.state.uid + '/fav/' + movies).set({
      movies,
      img
    })
    alert(`added to favorites ${movies}`);
    alert(`added to favorites ${img}`);
    rnfirebase.analytics().logEvent('movie_item_favorite', { movie_name: movies.title });
  }
}

const styles = StyleSheet.create({
  shadowGanteng: {
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset:{width:0, height: 10}
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF'
  },
  sourceText: {
    marginTop: 5,
    color: '#EEE'
  },
 
  picker: {
    backgroundColor: '#FFF',
    marginHorizontal: 4,
    marginVertical: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10},
    shadowOpacity: 0.10,
    shadowRadius: 10,
    color:'white'
  },
  pickerText: {
    fontWeight: 'bold',
    color: '#FFF'
  },
  scheduleText: {
  
  },
  container: {
        flex: 1,
        backgroundColor: '#EEE'
    },
     modalButton: {
    color: '#FFF',
    fontWeight: 'bold'
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
    fontSize:21,
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
    fontSize:18
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    marginTop: -10,
    resizeMode: 'contain',
    width: width * 0.9,
    height: height * 0.45
  },
    bold: {
        fontWeight: '600'
    },
    badgetext:{
      color: 'white'
    }

});
