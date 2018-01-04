import React, { Component } from 'react';
import { AppRegistry,StyleSheet, View, StatusBar, ScrollView, Image, Dimensions, AsyncStorage, Alert, TouchableOpacity } from 'react-native';
import { List, Spinner, Body, Left, Right, Container, Button, Title, Header, Content, Icon, Tab, Tabs, TabHeading, Text } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
const { height, width } = Dimensions.get('window');
import { Gravatar, GravatarApi } from 'react-native-gravatar';
import rnfirebase from '../components/rnfirebase';
import * as firebez from 'firebase';
const GRID = (width / 3) - 2;
import Storage from 'react-native-storage';
const imguri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQecIROJPkPLfG-PwKKhSNAeL520r_QpiJocVUTXAWSCUpzU85FCcVDXc';
import { firebaseApp } from '../components/firebase';
import {Actions} from 'react-native-router-flux';
import Icon2 from '../../node_modules/react-native-vector-icons/FontAwesome';
import Icon3 from '../../node_modules/react-native-vector-icons/MaterialIcons';
const tabProps = {
	tabStyle: {backgroundColor: '#FFF'},
	tabBarUnderlineStyle: { backgroundColor: '#21d4fd' }
};

export default class profiledefault extends Component {
	constructor(props) {
		super(props);
		this.state = {
			spinnerColor: 'transparent',
			loading: true,
			fav: {},
			favhotels: {},
			favmovies: {},
			kecamatan: this.props.kecamatan,
			favnews:{}
		};
	}

	componentWillMount() {
		this.currentUser = firebez.auth().currentUser;
		//console.log(this.currentUser);
		//console.log(this.currentUser.uid);
		this.setState({
			uname: this.currentUser.displayName,
			email: this.currentUser.email
		});
	}

	componentDidMount() {
		let uid = this.props.text;
		console.log(this.props.text);
		this.getfavhotels();
		this.getfavmovies();
		this.getfavnews();
	}

	getfavhotels()
	{
		this.setState({
			spinnerColor: 'transparent',
			loading: true
		});
		var favhotels = [];
		firebaseApp.database().ref('users/' + this.currentUser.uid + '/favhotel').once('value')
			.then(snapshot => {
				console.log('nyari favhotel')
				snapshot.forEach(child => {
					favhotels.push(child.val());
				});
			})
			.then(() => {
				console.log(favhotels);
				sortfavhtl = _.sortBy(favhotels, 'hotel');
				this.setState({ favhotels: sortfavhtl, loading: false });
			})
			.catch(err => {
				console.log('Error getting data: ', err);
				Alert.alert('Error', 'Error getting data: ' + err);    
			});
	}

	getfavmovies()
	{
		this.setState({
			spinnerColor: 'transparent',
			loading: true
		});
		var favmovies = [];
		firebaseApp.database().ref('users/' + this.currentUser.uid + '/favmovies').once('value')
			.then(snapshot => {
				console.log('nyari favmovies')
				snapshot.forEach(child => {
					favmovies.push(child.val());
				});
			})
			.then(() => {
				console.log(favmovies);
				sortfavmvs = _.sortBy(favmovies, 'title');
				this.setState({ favmovies: sortfavmvs, loading: false });
			})
			.catch(err => {
				console.log('Error getting data: ', err);
				Alert.alert('Error', 'Error getting data: ' + err);    
			});
	}
	getfavnews()
	{
		this.setState({
			spinnerColor: 'transparent',
			loading: true
		});
		var favnews = [];
		firebaseApp.database().ref('users/' + this.currentUser.uid + '/favnews').once('value')
			.then(snapshot => {
				console.log('nyari favnews')
				snapshot.forEach(child => {
					favnews.push(child.val());
				});
			})
			.then(() => {
				console.log(favnews);
				sortfavnews = _.sortBy(favnews, 'title');
				this.setState({ favnews: sortfavnews, loading: false });
				console.log(this.state.favnews);
			})
			.catch(err => {
				console.log('Error getting data: ', err);
				Alert.alert('Error', 'Error getting data: ' + err);    
			});

	}

	handleItemPress(url) {
		Actions.newsdetails({url: url});
	}
	render() {
		return (
			<Container>
				<StatusBar barStyle="dark-content" />
				<Header hasTabs style={{ backgroundColor: '#ffffff'}} iosStatusbar="light-content"
					androidStatusBarColor='#bfbfbf' >
					<Left>
						<Button transparent onPress={ 
							() => {rnfirebase.analytics().logEvent('backtohome');
								Actions.menudefault({type: 'reset'})}}>
							<Icon2 name="home" style={{color: '#FF3366',fontSize: 24}} />
						</Button>
					</Left>  
           
					<Right>
						<Button transparent onPress={() => Actions.ChangeCity({ previousScreen: 'profile'})}>
							<Icon style={{color: '#FF3366'}} android="md-map" ios="ios-map" name="map" />
						</Button>
						<Button transparent onPress={this._logout} >
							<Icon style={{color: '#FF3366'}} name="settings" />
						</Button>
					</Right>
				</Header>
				<View style={styles.topSection}>
					<Gravatar options={{
						email: this.state.email,
						parameters: { "size": "100"},
						secure: true
					}}
					style={styles.profPic}
					/>
					<Text>{this.state.uname}</Text>
					<Text style={{fontSize: 12}} >{this.state.email}</Text> 
				</View>
				<Tabs {...tabProps} >
					<Tab heading={ <TabHeading style = {{backgroundColor: '#FFF'}}><Icon3 style={{fontSize:22}} name="local-movies" /><Text style={{color:'#000'}}>  Movies</Text></TabHeading>}>
						<Content>
							<View style={styles.imageGrid}>
								{
									this.state.loading ? <Spinner color={this.state.spinnerColor} /> :
										<List contentContainerStyle={styles.imageGrid}
											dataArray={this.state.favmovies}
											renderRow={(fav) =>
												<TouchableOpacity  onPress={ 
													() => {
														rnfirebase.analytics().logEvent('view_favmovie_details');
														//this.gomovies(uppercasetitle)
														Actions.MovieReview({ pelem: fav.title })
														//Actions.movieloading({ tititKuda: title})
													}}>
													<Image source={{ uri: fav.img }} style={styles.image} />
												</TouchableOpacity>
											}
										/>
								}
							</View>
						</Content>
					</Tab>
					<Tab heading={ <TabHeading style = {{backgroundColor: '#FFF'}}><Icon2 style={{fontSize:18}} name="building" /><Text style={{color:'#000'}}>  Hotels</Text></TabHeading>}>
						<Content>
							<View style={styles.imageGrid}>
								{
									this.state.loading ? <Spinner color={this.state.spinnerColor} /> :
										<List contentContainerStyle={styles.imageGrid}
											dataArray={this.state.favhotels}
											renderRow={(fav) =>
												<TouchableOpacity  onPress={ 
													() => {
														rnfirebase.analytics().logEvent('view_favhotel_details');
														//this.gomovies(uppercasetitle)
														Actions.HotelDetails({ hotel: fav.hotel })
														//Actions.movieloading({ tititKuda: title})
													}}>
													<Image source={{ uri: fav.img }} style={styles.image} />
												</TouchableOpacity>
											}
										/>
								}
							</View>
						</Content>
					</Tab>
					<Tab heading={ <TabHeading style = {{backgroundColor: '#FFF'}}><Icon2 style={{fontSize:18}} name="newspaper-o" /><Text style={{color:'#000'}}>  News</Text></TabHeading>}>
						<Content>
							<View style={styles.imageGrid}>
								{
									this.state.loading ? <Spinner color={this.state.spinnerColor} /> :
										<List contentContainerStyle={styles.imageGrid}
											dataArray={this.state.favnews}
											renderRow={(fav) =>
												<TouchableOpacity  onPress={ 
													() => {
														rnfirebase.analytics().logEvent('view_favnews_details');
														//this.gomovies(uppercasetitle)
														Actions.newsdetails({url: fav.url})
														//Actions.movieloading({ tititKuda: title})
													}}>
													<Image source={{ uri: fav.img }} style={styles.image} />
												</TouchableOpacity>
											}
										/>
								}
							</View>
						</Content>
					</Tab>
				</Tabs> 
			</Container>

		);

	}

	_logout(){

		Alert.alert(

			'Quiting',

			'Want to quit?',

			[

				{

					text: 'Cancel',

					onPress: () => console.log('Cancel Pressed'),

					style: 'cancel'

				},

				{ text: 'OK', onPress: () => {
					firebez.auth().signOut().then(() => {
						Actions.loginscreen();
					}, (error) => {
						Alert.alert('Sign Out error', error);
					} )
				} }

			],

			{ cancelable: false }

		);

	}

}



const styles= StyleSheet.create({

	profPic:{

		marginTop: 20,

		height: 100,

		width: 100,

		borderRadius: 50,

		backgroundColor: 'transparent'

	},

	topSection: {

		backgroundColor: 'transparent',

		height: 185,

		alignSelf: 'stretch',

		alignItems: 'center'

	},
	headerTitle: {
		textAlign: 'center',
		color: '#FF3366',
		paddingTop: -10,
		paddingHorizontal: 30,
		backgroundColor: 'transparent',
		fontSize: 25,
		fontWeight: 'bold',
	},

	imageGrid: {

		flexDirection: 'row',

		flex: 1,

		justifyContent: 'space-between',

		flexWrap: 'wrap'

	},

	image: {

		height: GRID,

		width: GRID,

		marginBottom: 2,

		backgroundColor: 'transparent'

	},

	name : {

		marginTop: 10,

		fontSize: 18

	},

	email: {

	}

});