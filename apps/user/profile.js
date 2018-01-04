import React, { Component } from 'react';
import { AppRegistry,StyleSheet, View, ScrollView, Image, Dimensions, AsyncStorage, Alert, TouchableOpacity } from 'react-native';
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
import {Actions} from "react-native-router-flux";
import Icon2 from '../../node_modules/react-native-vector-icons/FontAwesome';
import Icon3 from '../../node_modules/react-native-vector-icons/MaterialIcons';


export default class Profile extends Component {
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
		}
	}

	componentWillMount() {
		this.currentUser = firebez.auth().currentUser;
		//console.log(this.currentUser);
		//console.log(this.currentUser.uid);
		this.setState({
			uname: this.currentUser.displayName,
			email: this.currentUser.email
		})
	}

	componentDidMount() {
		let uid = this.props.text;
		console.log(this.props.text);
		this.getfavhotels();
		this.getfavmovies();
		this.getcurrentcity();
		this.getfavnews();
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
				this.getmoviesnp();
				this.getnearhotels();
          
			})
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
				<Header hasTabs style={{ backgroundColor: '#ffffff'}} iosStatusbar="dark-content"
					androidStatusBarColor='#dfe3ee' >
					<Left>
						<Button transparent onPress={ 
							() => {rnfirebase.analytics().logEvent('backtohome');
								Actions.menu({kecamatan: this.state.kecamatan, type: 'reset'})}}>
							<Icon2 name="home" style={{color: '#FF3366',fontSize: 24}} />
						</Button>
					</Left>
					<Body>
						
					</Body>
					<Right>
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
				<Tabs>
					<Tab heading={ <TabHeading><Icon3 style={{fontSize:22}} name="local-movies" /><Text>  Movies</Text></TabHeading>}>
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
					<Tab heading={ <TabHeading ><Icon2 style={{fontSize:18}} name="building" /><Text>  Hotels</Text></TabHeading>}>
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
					<Tab heading={ <TabHeading><Icon2 style={{fontSize:18}} name="newspaper-o" /><Text>  News</Text></TabHeading>}>
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