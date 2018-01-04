//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import {
	Container,
	Header,
	Button,
	Icon,
	Title,
	Content,
	List,
	ListItem,
	Left,
	Body,
	Right
} from 'native-base';
import { Actions } from 'react-native-router-flux';

import * as firebase from 'firebase';

const city = [ 'Bandung', 'Bekasi', 'Bogor', 'Jakarta', 'Tangerang' ];

// create a component
export default class ChangeCity extends Component {
	
	setCity(city) {
		const uid = firebase.auth().currentUser.uid;
		firebase.database().ref('users/' + uid).update({
			city: city
		});
		Alert.alert('City Changed!', 'Your city preferences is now ' + city,
			[
				{ text: 'OK', onPress: () => Actions.pop()}
			],
			{ cancelable: false }
		);
		
		// Alert.alert(
		// 	'Alert Title',
		// 	'My Alert Msg',
		// 	[
		// 		{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
		// 		{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
		// 		{text: 'OK', onPress: () => console.log('OK Pressed')},
		// 	],
		// 	{ cancelable: false }
		// )
	}
	render() {
		return (
			<Container>
				<Header
					style={{ backgroundColor: '#FFF'}}
					androidStatusBarColor='#bfbfbf'
				>
					<Left>
						<Button transparent  onPress={() => Actions.pop() } >
							<Text style={{ fontSize: 18, fontWeight: '800', color: '#FF3366'}} >
								Cancel
							</Text>
						</Button>
					</Left>
					<Body>
						<Title style={{ color: '#FF3366'}} >
							Change your city.
						</Title>
					</Body>
					<Right>

					</Right>
				</Header>
				<Content>
					<List dataArray={city}
						renderRow={(item) => {
							return (
								<ListItem>
									<TouchableHighlight onPress={() => this.setCity(item)} > 
										<Text>{item}</Text>
									</TouchableHighlight>
								</ListItem>
							);
						}
						} />
				</Content>
			</Container>
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
});
