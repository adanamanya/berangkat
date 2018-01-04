//import liraries
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
	Animated,
	findNodeHandle
} from 'react-native';
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
	Picker,
	Form,
	Badge,
	Item as FormItem,
	DeckSwiper,
	List,
	ListItem,
	Thumbnail,
	Tabs,
	Tab,
	TabHeading
} from 'native-base';
import { Actions } from 'react-native-router-flux'; // Import Navigator
import rnfirebase from '../components/rnfirebase'; // Import Initializrd Firebase app
import moment from 'moment';
import axios from 'axios';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-spinkit';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from 'react-native-blur';
import Swiper from 'react-native-deck-swiper';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';

const imageGanteng = require('../src/img/ganteng.jpg');

import SearchInput, { createFilter } from 'react-native-search-filter';

const KEYS_TO_FILTERS = ['theater'];
// Import styling
import styles from '../components/MovieDetail.style';

const ImageLoadProgress = createImageProgress(Animated.Image);

// Get screen width and height
const { height, width } = Dimensions.get('window');

// Header sizes to be used to interpolate the scroll position value
import { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE, STICKY_HEADER_HEIGHT, PARALLAX_HEADER_HEIGHT,
	gaugeSize,
	gaugeWidth,
	gaugeCropDegree,
	gaugeTextOffset,
	gaugeTextWidth,
	gaugeTextHeight,
} from '../components/MovieDetail.style';

import { GaugeProgress } from 'react-native-simple-gauge';

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

// create a component
class MovieReview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movieName: this.props.pelem,
			loadingMovieDetail: true,
			currentMovieActors: null,
			currentMovieTmdbRating: null,
			currentMoviePoster: null,
			currentMovieBackDrop: null,
			currentMovieOverview: null,
			scrollY: new Animated.Value(0),
			viewRef: null,
			metascoreGaugeColor: '#4682b4',
			metascoreBgGaugeColor: '#b0c4de',
			metascoreGaugeFill: 0,
			index: 0,
			routes: [
				{ key: '1', title: 'First' },
				{ key: '2', title: 'Second'},
			],
			theaters: [],
			searchTerm: '',
			headerRightIconIos: 'ios-list-box',
			headerRightIconAndroid: 'md-list-box',
			isSwipe: false,
			kecamatan: {},
			kota: {}
		};
	}

	setModalVisible(visible, x) {
		console.log(x);
		this.setState({
		  hehe: x,
		  //loadingMovieDetail: true,
		  modalVisible: visible,
		});
		console.log(this.state.modalVisible)
	  }
	
	  setModalClosed() {
		this.setState({
		  modalVisible: false
		})
	  }

	_keyExtractor = (item, index) => item.id;

	_renderItem = ({theater}) => (
		<Card style={{
			marginLeft: 20,
			marginRight: 20,
			marginBottom: 10,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 10},
			shadowOpacity: 0.30,
			shadowRadius: 10,
			borderWidth: 0
		}}>
			<TouchableOpacity>
				<CardItem header bordered>
					<Text style={{ fontFamily: 'Avenir Next', fontSize: 18, fontWeight: 'bold' }} >
						{theater.theater.toUpperCase()}
					</Text>
				</CardItem>
			</TouchableOpacity>
			<CardItem>
				<Body>
					<Text style={styles.scheduleText} >
					Jadwal: {theater.time}
					</Text>
				</Body>
			</CardItem>
			<CardItem>
				<Text style={styles.scheduleText} >
				Harga Tiket: Rp. {theater.htm}
				</Text>
			</CardItem>
			<CardItem>
				<Text style={styles.scheduleText} >
				Room Type: {theater.room_type}
				</Text>
			</CardItem>
		</Card>
	);

	componentDidMount() {
		(this.state.movieName);
		this.fetchMovieDetail();
		// this.getCoordinates();
	}

	// handleSwipeButton(isSwipe) {
	// 	this.setState({ isSwipe: !isSwipe });
	// 	if (this.state.isSwipe == true) {
	// 		this.setState({
	// 			headerRightIconIos: 'ios-list-box',
	// 			headerRightIconAndroid: 'md-list-box',
	// 		});
	// 	} else {
	// 		this.setState({
	// 			headerRightIconIos: 'ios-albums',
	// 			headerRightIconAndroid: 'md-albums',
	// 		});
	// 	}
	// }



	searchUpdated(term) {
		this.setState({ searchTerm: term });
	}

	fetchMovieDetail() {
		console.log('masuk fetching movie details')
		console.log(this.state.movieName)

		const year = moment().format('YYYY'); // Get current year

		// Set state to tell the modal that app is loading the movie details
		this.setState({ loadingMovieDetail: true });

		// Set Api keys and url for detail fetching
		const tmdbApi = '40f0539aa9a129baeea20b76a66fdf09';
		const tmdb = 'https://api.themoviedb.org/3/';
		const apiKey = '62f7960b';

		let imdbId = ''; // imdb movie id

		// Begin Get Process
		axios.get('https://www.omdbapi.com?apikey=' + apiKey + '&t=' + this.state.movieName + '&y=' + year + '&plot=short')
			.then(response => {
				const data = response.data;
				imdbId = data.imdbID;
				this.setState({
					currentMovieDetail: data,
					errortest: data.Error
				});

				// Query tmdb database using imdb id to get tmdb movie id to get all movie details
				axios.get('find/' + imdbId + '?api_key=' + tmdbApi + '&external_source=imdb_id', {baseURL: tmdb})
					.then(response => {
						const data = response.data;
						
						const { id } = data.movie_results[0]; // tmdb movie id

						// Get movie details
						axios.get('movie/' + id + '?api_key=' + tmdbApi + '&append_to_response=videos,credits', { baseURL: tmdb })
							.then(response => {
								const data = response.data;

								// Get data to display on actors list
								const credits = data.credits.cast;
								let actors = [];
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

								// Set the state for display
								this.setState({
									currentMovieActors: actors,
									currentMovieTmdbRating: tmdbRating,
									currentMoviePoster: moviePoster,
									currentMovieBackDrop: movieBackdrop,
									currentMovieOverview: movieOverview,
								});

								// Set if to color the gauge for Metascore
								if (this.state.currentMovieDetail.Metascore <= 39) {
									this.setState({
										metascoreGaugeColor: '#fc0d1b',
										metascoreBgGaugeColor: '#ffa0a6'
									});
								} else if (this.state.currentMovieDetail.Metascore >= 40 && this.state.currentMovieDetail.Metascore <= 60) {
									this.setState({
										metascoreGaugeColor: '#fecb45',
										metascoreBgGaugeColor: '#ffe6a8'
									});
								} else {
									this.setState({
										metascoreGaugeColor: '#6aca3f',
										metascoreBgGaugeColor: '#c9ecba'
									});
								}

								if (this.state.currentMovieDetail.Metascore !== 'N/A') {
									this.setState({ metascoreGaugeFill: this.state.currentMovieDetail.Metascore});
								}

								setTimeout(() => this.setState({ loadingMovieDetail: false }), 10000);
							});
					});
			})
			.catch(error => {
				console.log(error);
				Alert.alert('Error', error);
			});
	}

	CheckMovie() {
		if (this.state.errortest == 'Movie not found!') {
			Actions.pop();
			alert('this is beyond our realm');
			}
		else{
			console.log('otw');
		}
	}


	_renderMetascore() {
		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.metascoreGaugeFill}
				cropDegree={gaugeCropDegree}
				tintColor={this.state.metascoreGaugeColor}
				backgroundColor={this.state.metascoreBgGaugeColor}
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, styles.shadowGanteng]} >
							{this.state.currentMovieDetail.Metascore}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	_renderMetascoreBawah() {
		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.metascoreGaugeFill}
				cropDegree={gaugeCropDegree}
				tintColor={this.state.metascoreGaugeColor}
				backgroundColor={this.state.metascoreBgGaugeColor}
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, { color: '#444', backgroundColor: 'transparent'}]} >
							{this.state.currentMovieDetail.Metascore}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	_renderImdbRating() {
		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.currentMovieDetail.imdbRating * 10}
				cropDegree={gaugeCropDegree}
				tintColor="#f3ce13"
				backgroundColor="#fbeeb0"
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, styles.shadowGanteng]} >
							{this.state.currentMovieDetail.imdbRating}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	_renderImdbRatingBawah() {

		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.currentMovieDetail.imdbRating * 10}
				cropDegree={gaugeCropDegree}
				tintColor="#f3ce13"
				backgroundColor="#fbeeb0"
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, { color: '#444', backgroundColor: 'transparent'}]} >
							{this.state.currentMovieDetail.imdbRating}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	_renderTmdbRating() {
		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.currentMovieTmdbRating * 10}
				cropDegree={gaugeCropDegree}
				tintColor="#21d07a"
				backgroundColor="#b5efd2"
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, styles.shadowGanteng]} >
							{this.state.currentMovieTmdbRating}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	_renderTmdbRatingBawah() {
		return (
			<GaugeProgress
				size={gaugeSize}
				width={gaugeWidth}
				fill={this.state.currentMovieTmdbRating * 10}
				cropDegree={gaugeCropDegree}
				tintColor="#21d07a"
				backgroundColor="#b5efd2"
				strokeCap="circle"
			>
				{(fill) => (
					<View style={styles.gaugeTextContainer}>
						<Text style={[styles.gaugeText, { color: '#444', backgroundColor: 'transparent'}]} >
							{this.state.currentMovieTmdbRating}
						</Text>
					</View>
				)}
			</GaugeProgress>
		);
	}

	imageLoaded() {
		this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
	}

	render() {
		const imageBlur = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
			outputRange: [0, 10, 20],
			extrapolate: 'clamp'
		});

		const imageOpacity = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
			outputRange: [0.8, 0.6, 0.2],
			extrapolate: 'clamp'
		});

		const imageTranslate = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [0, 50],
			extrapolate: 'clamp'
		});

		const filteredTheaters = this.state.theaters.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		this.CheckMovie();
		return (
			<View style={{flex: 1, backgroundColor: '#DDD'}} >
				{this.state.loadingMovieDetail ? <LinearGradient
					colors={['#E91E63', '#F44336']}
					style={styles.containerLoading}
					start={{ x: 1, y: 0}}
					end={{ x:0, y:1 }}
				>
					<Spinner style={styles.spinner} isVisible={true} size={100} type={'WanderingCubes'} color={'#FFF'} />
					<Text style={styles.loadingText} >Getting The Details...</Text>
				</LinearGradient> :
					<ParallaxScrollView
						onScroll={Animated.event(
							[{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
						)}
						backgroundColor="transparent"
						contentBackgroundColor="transparent"
						parallaxHeaderHeight={height}
						stickyHeaderHeight={HEADER_MIN_HEIGHT}
						renderBackground={() => (
							<View key="background" style={{ backgroundColor: '#000'}} >
								<Animated.Image
									indicator={ProgressBar}
									ref={(img) => { this.backgroundImage = img;}}
									source={{
										uri: this.state.currentMoviePoster,
									}}
									style={{	width: width,
										height: height,
										opacity: imageOpacity,
										backgroundColor: '#d3d3d3',
										transform: [{translateY: imageTranslate}]}}
									resizeMode="cover"
									onLoadEnd={this.imageLoaded.bind(this)}
								/>
								{/* <BlurView
									style={{
										position: 'absolute',
										top: 0, left: 0, bottom: 0, right: 0,
									}}
									viewRef={this.state.viewRef}
									blurType="dark"
									blurAmount={0}
								/> */}
								{/* <View
									style={{
										position: 'absolute',
										top: 0,
										width,
										height: HEADER_MAX_HEIGHT,
										backgroundColor: 'rgba(0,0,0,.4)',
										//backgroundColor: '#d3d3d3'
									}}
								/> */}
							</View>
						)}
						renderForeground={() => (
							<View style={{height: height, flexDirection: 'column', justifyContent: 'center'}} >
								<View style={{ alignSelf: 'center'}} >
									<Text style={[styles.movieTitle, {color: '#FFF'}]} >
										{this.state.currentMovieDetail.Title}
									</Text>
								</View>
								<View style={styles.movieRatingContainer}>
									<View style={styles.movieRatingSrcContainer} >
										{this._renderMetascore()}
										<Text style={[styles.movieRatingSourceText, styles.shadowGanteng]} >Metascore</Text>
									</View>
									<View style={styles.movieRatingSrcContainer} >
										{this._renderImdbRating()}
										<Text style={[styles.movieRatingSourceText, styles.shadowGanteng]}>IMDb</Text>
									</View>
									<View style={styles.movieRatingSrcContainer}>
										{this._renderTmdbRating()}
										<Text style={[styles.movieRatingSourceText, styles.shadowGanteng]}>TMDb</Text>
									</View>
								</View>
							</View>
						)}

						renderStickyHeader={() => (
							<Header hasTabs style={{backgroundColor: 'transparent', borderBottomColor: 'transparent', borderBottomWidth: 10}} iosBarStyle="light-content" >
								<Left>
									<Button transparent onPress={() => Actions.menudefault({type: 'reset'})}>
										<Icon ios="ios-arrow-back" android="md-arrow-back" style={{ color: '#FFF'}}/>
									</Button>
								</Left>
								<Body>
									{/* <Title style={{ color: '#FFF', fontFamily: 'Avenir Next'}} >{this.state.currentMovieDetail.Title}</Title> */}
								</Body>
							{/* 	<Right>
									<Button onPress={() => this.handleSwipeButton(this.state.isSwipe)} transparent>
										<Icon name="aaa" ios={this.state.headerRightIconIos} android={this.state.headerRightIconIos} style={{ color: '#FFF'}} />
                            </Button> 
								</Right>*/}
							</Header>
						)}
					>
						<Container>
							<Tabs locked initialPage={0} tabBarPosition="top" style={{ marginTop: HEADER_MIN_HEIGHT}} >
								<Tab style={{ backgroundColor: '#e0e0e0' }} heading={ <TabHeading><Text>Details</Text></TabHeading>}>
									<LinearGradient
										colors={['#FFF', '#00BCD4','#CDDC39' ]}
										style={styles.container}
										start={{ x: 0, y: 0}}
										end={{ x:0, y:1 }}
									>
										<Content>
											<View style={[styles.movieCard, styles.shadowGanteng]}>
												<View style={[styles.movieTitleContainer]}>
													<Text style={[styles.movieTitle, { textAlign: 'left', marginLeft: 20, paddingTop: 10}]}>
														{this.state.currentMovieDetail.Title}<Text style={styles.movieTitleYear}> ({this.state.currentMovieDetail.Year})</Text>
													</Text>
												</View>
												<View style={styles.movieMiscDetailContainer}>
													<Text style={styles.movieMiscDetailText}>
														{this.state.currentMovieDetail.Rated} | {this.state.currentMovieDetail.Runtime} | {this.state.currentMovieDetail.Genre}
													</Text>
												</View>
												<View style={styles.movieRatingContainerBawah}>
													<View style={styles.movieRatingSrcContainer} >
														{this._renderMetascoreBawah()}
														<Text style={[styles.movieRatingSourceText, styles.shadowGanteng, { backgroundColor: 'transparent', color: '#444'}]} >Metascore</Text>
													</View>
													<View style={styles.movieRatingSrcContainer} >
														{this._renderImdbRatingBawah()}
														<Text style={[styles.movieRatingSourceText, styles.shadowGanteng, { backgroundColor: 'transparent', color: '#444'}]}>IMDb</Text>
													</View>
													<View style={styles.movieRatingSrcContainer}>
														{this._renderTmdbRatingBawah()}
														<Text style={[styles.movieRatingSourceText, styles.shadowGanteng, { backgroundColor: 'transparent', color: '#444'}]}>TMDb</Text>
													</View>
												</View>
												<View>
													<Text style={[styles.movieDirectorText]}>
													Directed by {this.state.currentMovieDetail.Director}
													</Text>
												</View>
												<View style={styles.movieActorsContainer}>
													<Text style={[styles.movieActorsStarringText]} >STARRING</Text>
													<List
														dataArray={this.state.currentMovieActors}
														horizontal
														renderRow={(item) => {
															return (
																<ListItem style={[styles.movieActorsListContainer, styles.shadowGanteng]}>
																	<Thumbnail source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.profile_path}}/>
																	<Text style={styles.movieActorsListText}>{item.name}</Text>
																</ListItem>
															);
														}}
													/>
												</View>
												<View style={styles.movieOverviewContainer}>
													<Text style={[styles.movieOverviewText]}>OVERVIEW</Text>
													<Text style={[styles.movieOverviewContentText]}>
														{this.state.currentMovieOverview}
													</Text>
												</View>
											</View>
										</Content>
									</LinearGradient>
								</Tab>
							</Tabs>
						</Container>

					</ParallaxScrollView>
				}
				<Modal
					ref={"modal"}
					coverScreen={true}
					swipeToClose={false}
					style={styles.modal}
					isOpen={this.state.modalVisible}
					onClosed={this.setModalClosed.bind(this)}
				>
				<List
				style={{ flex: 2}}
				dataArray={this.state.theaters}
				renderRow={(theater) => (
					<Card style={{
						marginLeft: 20,
						marginRight: 20,
						marginBottom: 10,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 10},
						shadowOpacity: 0.30,
						shadowRadius: 10,
						borderWidth: 0
					}}>
						<TouchableOpacity>
							<CardItem header bordered>
								<Text style={{ fontFamily: 'Avenir Next', fontSize: 18, fontWeight: 'bold' }} >
									{theater.theater.toUpperCase()}
								</Text>
							</CardItem>
						</TouchableOpacity>
						<CardItem>
							<Body>
								<Text style={styles.scheduleText} >
								Jadwal: {theater.time}
								</Text>
							</Body>
						</CardItem>
						<CardItem>
							<Text style={styles.scheduleText} >
							Harga Tiket: Rp. {theater.htm}
							</Text>
						</CardItem>
						<CardItem>
							<Text style={styles.scheduleText} >
							Room Type: {theater.room_type}
							</Text>
						</CardItem>
					</Card>
				)}
			/>
				</Modal>
			</View>
		);
	}
}

const cobaganteng = StyleSheet.create({
	fill: {
		flex: 1,
	},
	row: {
		height: 40,
		margin: 16,
		backgroundColor: '#D3D3D3',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: '#03A9F4',
		overflow: 'hidden',
	},
	bar: {
		marginTop: 28,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		backgroundColor: 'transparent',
		color: 'white',
		fontSize: 18,
	},
	scrollViewContent: {
		marginTop: HEADER_MAX_HEIGHT,
	},
});

//make this component available to the app
export default MovieReview;