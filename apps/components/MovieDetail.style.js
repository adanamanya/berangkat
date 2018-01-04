import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const fontColor = '#444';

// Header sizes to be used to interpolate the scroll position value
export const HEADER_MAX_HEIGHT = height;
export const HEADER_MIN_HEIGHT = 65;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const PARALLAX_HEADER_HEIGHT = 350;
export const STICKY_HEADER_HEIGHT = 70;

export const gaugeSize = 80;
export const gaugeWidth = 7.5;
export const gaugeCropDegree = 0;
export const gaugeTextOffset = gaugeWidth;
export const gaugeTextWidth = gaugeSize - (gaugeTextOffset*2);
export const gaugeTextHeight = gaugeSize*(1 - gaugeCropDegree/360) - (gaugeTextOffset*2);

export default StyleSheet.create({
	modal: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	  },
	card: {
		flex: 1,
		width:360,
		height:320,
		borderRadius:6,
		borderWidth:1,
		borderColor:"#e1e1e1",
		position:"absolute",
		backgroundColor:"#fff",
		alignSelf: 'center',
		justifyContent:'center'
	  },
	swipeScheduleText: {
		fontFamily: 'Avenir Next',
		fontSize: 14,
		fontWeight: '600',
		color: '#444',
		marginTop: 10,
		paddingLeft: 20
	},
	swipeCard: {
		elevation: 5,
		flex: 1,
		width: width * 0.8,
		height: height * 0.625,
		borderRadius: 2.5,
		//borderColor:'#e1e1e1',
		position:'absolute',
		alignSelf: 'center',
		//justifyContent:'center',
		backgroundColor: '#FFF'
	},
	swipeHotel: {
		elevation: 5,
		flex: 1,
		width: width * 0.8,
		height: height * 0.575,
		borderRadius: 2.5,
		//borderColor:'#e1e1e1',
		position:'absolute',
		alignSelf: 'center',
		//justifyContent:'center',
		backgroundColor: '#FFF'
	},
	movieCard: {
		backgroundColor: '#FFF',
		margin: 20,
		borderRadius: 0,
		marginBottom: 20
	},
	gaugeTextContainer: {
		position: 'absolute',
		top: gaugeTextOffset,
		left: gaugeTextOffset,
		width: gaugeTextWidth,
		height: gaugeTextWidth,
		alignItems: 'center',
		justifyContent: 'center',
	},
	gaugeText: {
		fontSize: 20,
		color: '#FFF',
		fontFamily: 'Avenir Next',
		fontWeight: '600'
	},
	movieDetailPoster: {
		height: 175,
		width: 125,
		borderRadius: 5
	},
	containerLoading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2c3e50',
	},
	spinner: {
		marginBottom: 50
	},
	loadingText: {
		color: '#FFF',
		backgroundColor: 'transparent',
		marginHorizontal: 50,
		fontSize: 24,
		fontWeight: '600',
		fontFamily: 'Avenir Next',
	},
	headerIcon: {
		color: fontColor,
		fontSize: 48
	},
	searchText: {
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		alignSelf: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		color: '#6a7989',
		justifyContent: 'center',
	  },
	backgroundImageHeader: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		width: null,
		height: HEADER_MAX_HEIGHT,
		resizeMode: 'cover',
	},
	header: {
		backgroundColor: 'transparent',
		borderBottomWidth: 0
	},
	bar: {
		marginTop: 28,
		height: 32,
		alignItems: 'center',
	},
	title: {
		backgroundColor: 'transparent',
		color: 'white',
		fontSize: 18,
		alignSelf: 'flex-start',
		flexDirection: 'row'
	},
	scrollViewContent: {
		marginTop: HEADER_MAX_HEIGHT,
		backgroundColor: 'transparent'
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	backgroundImage: {
		height,
		width
	},
	movieTitleContainer: {
		flexDirection: 'row',
	},
	movieTitle: {
		//paddingLeft: 20,
		fontFamily: 'Avenir Next',
		alignSelf: 'center',
		fontWeight: '600',
		fontSize: 44,
		textAlign: 'center',
		//marginTop: 20,
		//marginBottom: 10,
		color: fontColor,
		// shadowColor: '#000',
		// shadowOpacity: 0.5,
		// shadowRadius: 10,
		// shadowOffset: {
		// 	width: 0, height: 10
		// },
		backgroundColor: 'transparent'
	},
	movieTitleYear: {
		fontSize: 16,
		color: '#666'
	},
	movieMiscDetailContainer: {
		marginBottom: -10,
		backgroundColor: '#FFF'

	},
	movieMiscDetailText: {
		marginLeft: 20,
		color: '#777',
		// shadowColor: '#000',
		// shadowOpacity: 10,
		// shadowRadius: 10,
		// shadowOffset: {
		// 	width: 0, height: 10
		// }
	},
	movieRatingContainerBawah: {
		marginVertical: 20,
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		//paddingLeft: 50,
		//marginVertical: 20,
		//marginBottom: 20,
		width: width - 50
	},
	movieRatingContainer: {
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		//alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',
		//paddingLeft: 50,
		//marginVertical: 20,
		marginBottom: 20,
		width: width
	},
	movieRatingSrcContainer: {
		width: 100,
		marginHorizontal: 10,
		alignItems: 'center'
	},
	movieRatingText: {
		fontSize: 24,
		//fontWeight: '600',
		color: fontColor,
		fontFamily: 'Avenir Next'
	},
	movieRatingSourceText: {
		fontFamily: 'Avenir Next',
		fontWeight: '600',
		marginTop: 10,
		color: '#EEE'
	},
	movieDirectorText: {
		marginLeft: 20,
		color: fontColor,
		marginTop: -10,
		marginBottom: 10
	},
	movieActorsContainer: {
		flexDirection: 'column'
	},
	movieActorsStarringText: {
		color: fontColor,
		fontWeight: '600',
		fontSize: 15,
		paddingLeft: 20
	},
	movieActorsListContainer: {
		flexDirection: 'column',
		backgroundColor: 'transparent',
		borderBottomWidth: 0
	},
	movieActorsListText: {
		marginTop: 10,
		color: fontColor
	},
	movieOverviewContainer: {
		paddingHorizontal: 20
	},
	movieOverviewText: {
		color: fontColor,
		fontWeight: '600',
		fontSize: 15
	},
	movieOverviewContentText: {
		color: fontColor,
		textAlign: 'left',
		paddingTop: 10,
		paddingBottom: 20,
	},
	textShadowGanteng: {
		textShadowColor: '#000',
		shadowOpacity: 0.00,
		textShadowRadius: 10,
		textShadowOffset: {
			width: 0, height: 1
		},
	},
	shadowGanteng: {
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: {
			width: 0, height: 5
		}
	},
});