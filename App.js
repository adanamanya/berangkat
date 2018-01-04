import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	Scene,
	Reducer,
	Router,
	Modal,
	Actions,
	ActionConst,
	Switch
} from 'react-native-router-flux';
import Loginscreen from './apps/user/loginscreen';
import Error from './apps/components/Error';
import splashtest from './apps/components/splashtest';
import MovieLoading from './apps/components/movieloading';
import Menu from './apps/components/Menu';
import menudefault from './apps/components/menudefault';
import loadingprof from './apps/components/loadingprof';
import NewsList from './apps/products/NewsList';
import HotelDetails from './apps/products/HotelDetails';
import MovieList from './apps/products/MovieList';
import ListView from './apps/products/ListView';
import Profile from './apps/user/profile';
import profiledefault from './apps/user/profiledefault';
import SwipeView from './apps/products/SwipeView';
import MovieReview from './apps/products/MovieReview';
import HotelSwipe from './apps/products/HotelSwipe';
import Button from 'react-native-button';
import SignUp from './apps/user/SignUp';
import NewsDetails from './apps/products/NewsDetails';
import MovieDetails from './apps/products/MovieDetails';
import TabIcon from './apps/components/TabIcon';
import VerifScreen from './apps/user/VerifScreen';
import { firebaseApp } from './apps/components/firebase';
import * as firebase from 'firebase';
import MovieSwipe from './apps/products/MovieSwipe';
import welcomescreen from './apps/components/welcomescreen';
import ChangeCity from './apps/user/ChangeCity';
var apakahLogin = false;

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
		alignItems: 'center',
	},
	tabBarStyle: {
		backgroundColor: '#eee',
	},
	tabBarSelectedItemStyle: {
		backgroundColor: '#ddd',
	},
});

const reducerCreate = params => {
	const defaultReducer = new Reducer(params);
	return (state, action) => {
		//    console.log('ACTION:', action);
		return defaultReducer(state, action);
	};
};

// define this based on the styles/dimensions you use
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
	const style = {
		flex: 1,
		backgroundColor: '#fff',
		shadowColor: null,
		shadowOffset: null,
		shadowOpacity: null,
		shadowRadius: null,
	};
	if (computedProps.isActive) {
		style.marginTop = computedProps.hideNavBar ? 0 : 64;
		style.marginBottom = computedProps.hideTabBar ? 0 : 50;
	}
	return style;
};

let currentSwitchPage = 'text1';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: null,
			bajingan: true,
			berak: '',
			currentUser: '',
			logged: '',
			latitude: null,
			longitude: null,
			city: null
		};

	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({isLogin: true})
				console.log(apakahLogin);
			} else {
				this.setState({isLogin: false})
				console.log(apakahLogin);
			}
		})
		console.log(this.state.isLogin);
	}

	render() {
		if (this.state.isLogin === null) {
			return null;
		} else if (this.state.isLogin === false) {
			return (
				<Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
					<Scene key="root" hideNavBar hideTabBar>
						<Scene key="list" component={ListView} title="List" hideNavBar icon={TabIcon}/>
						<Scene key="welcomescreen" component={welcomescreen} title="welcome" hideNavBar/>
						<Scene key="loadingprof" component={loadingprof} title="loadprof" hideNavBar/>
						<Scene key="movieloading" component={MovieLoading} title="movieload" hideNavBar/>
						<Scene key="MovieReview" component={MovieReview} title="MovieReview" hideNavBar/>
						<Scene key="HotelDetails" component={HotelDetails} title="HotelDetails" hideNavBar/>
						<Scene key="swipe" component={HotelSwipe} title="Swipe" hideNavBar icon={TabIcon}/>
						<Scene key="MovieList" component={MovieList} title="Movie"/>
						<Scene key="loginscreen" initial component={Loginscreen} title="Loginscreen" />
						<Scene key="newsdetails" component={NewsDetails} title="NewsDetails" />
						<Scene key="news" component={NewsList} title="NewsList" />
            <Scene key="ChangeCity" component={ChangeCity} title="Change City" />
						<Scene key="profile" component={Profile} title="Profile" />
						<Scene key="profiledefault" component={profiledefault} title="ProfileDefault" />
						<Scene key="verif" component={VerifScreen} title="Verif" />
						<Scene key="SignUp" component={SignUp} title="signup"/>
						<Scene key="moviedetails" component={MovieDetails} title="Moviedetails"/>
						<Scene key="movieswipe" component={MovieSwipe} title="Movieswipe"/>
						{/* <Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#DCDCDC' }} > */}
						{/* Tab and it's scenes */}
						<Scene key="menu" component={Menu} title="Menu" hideNavBar icon={TabIcon} />
						<Scene key="menudefault" component={menudefault} title="menudefault" hideNavBar icon={TabIcon} />
						<Scene key="profile" component={Profile} title="Profile" hideNavBar icon={TabIcon}  />
					</Scene>
					{/* </Scene> */}
					<Scene key="error" component={Error} />
				</Router>
			);
		} else {
			return (
				<Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
					<Scene key="root" hideNavBar hideTabBar>
						<Scene key="welcomescreen" component={welcomescreen} title="welcome" hideNavBar/>
						<Scene key="loadingprof"  component={loadingprof} title="loadprof" hideNavBar/>
						<Scene key="movieloading" component={MovieLoading} title="movieload" hideNavBar/>
						<Scene key="MovieReview" component={MovieReview} title="Moviereview"/>
						<Scene key="HotelDetails" component={HotelDetails} title="HotelDetails" hideNavBar/>
						<Scene key="list" component={ListView} title="List" hideNavBar  icon={TabIcon}/>
						<Scene key="swipe" component={HotelSwipe} title="Swipe" hideNavBar icon={TabIcon} />
						<Scene key="loginscreen" component={Loginscreen} title="Loginscreen" />
						<Scene key="newsdetails" component={NewsDetails} title="NewsDetails" />
						<Scene key="news" component={NewsList} title="NewsList" />
						<Scene key="MovieList" component={MovieList} title="Movie"/>
						<Scene key="movieswipe" component={MovieSwipe} title="Movieswipe"/>
						<Scene key="verif" component={VerifScreen} title="Verif" />
            <Scene key="ChangeCity" component={ChangeCity} title="Change City" />
						<Scene key="profile" component={Profile} title="Profile" />
						<Scene key="profiledefault" component={profiledefault} title="ProfileDefault" />
						<Scene key="SignUp" component={SignUp} title="signup"/>
						<Scene key="moviedetails" component={MovieDetails} title="Moviedetails"/>
						<Scene key="splashtest" component={splashtest} title="splash"/>
						{/*<Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#DCDCDC' }} >*/}
						{/* Tab and it's scenes */}
						<Scene key="menu" component={Menu} title="Menu" hideNavBar icon={TabIcon}   />
						{/*<Scene key="menu" latitude={ this.state.latitude } longitude={ this.state.longitude } component={Menu} title="Menu" hideNavBar icon={TabIcon}   />*/} 
						<Scene key="menudefault" initial component={menudefault} title="menudefault" hideNavBar icon={TabIcon} />
						<Scene key="profile" component={Profile} title="Profile" hideNavBar icon={TabIcon} />
					</Scene>
					{/*  </Scene>*/}
					<Scene key="error" component={Error} />
				</Router>
			);
		}
      
	}
}

export default App;
