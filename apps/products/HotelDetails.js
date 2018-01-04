/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Icon2 from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { BlurView, VibrancyView } from 'react-native-blur';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Container, Button, Header, Content, List, Card, CardItem, ListItem, Thumbnail, Text, Body, Icon, Left } from 'native-base';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import {
  Animated,
  TouchableOpacity, 
  Platform,
  StyleSheet,
  View,
  Dimensions,
  ScrollView
} from 'react-native';
import styles from '../components/MovieDetail.style';
import rnfirebase from '../components/rnfirebase'; 
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const LOCATION_HEIGHT = SCREEN_HEIGHT * 0.1;



export default class HotelDetails extends Component {
    constructor(props) {
		super(props);
		this.state = {
            loadingHotelDetail: true,
            hotel: this.props.hotel,
            hoteldata: {}
		};
    }
    
    componentDidMount(){
        this.getDetails();
    }
    getDetails() {
		console.log(this.props.hotel)
		const nama = this.state.hotel.toString();
		const namahotel = nama.trimRight();
		const HotelRef = rnfirebase.firestore().collection('hotel');
		const query = HotelRef.where("hotel_name", "==", namahotel);
		let hotels = [];

		// queryGanteng .get()
		// 	.then(snapshot => {
		// 		console.log('tytyd')
		// 		snapshot.forEach(doc => {
		// 			const data = doc.data();
		// 			//console.log(doc.id, '=>', doc.data());
		// 			smwahPelem.push(data);
		// 		});
		// 		console.log(smwahPelem);
		// 		const gantengDeh = _.filter(smwahPelem, { 'title': juduel });
		// 		console.log(gantengDeh);
		// 		console.log('BLADE RUNNER 2049')
		// 	})
		query.get()
			.then(snapshot => {
				// console.log(nyaridatahotel);
				snapshot.forEach(doc => {

					const data = doc.data();
					//console.log(data.id, '=>', data.data())
					console.log(data);
					hotels.push(data);
				});
				this.setState({hoteldata: hotels[0]});
                // console.log(this.state.hoteldata);
                console.log(this.state.hoteldata)
                console.log(this.state.hoteldata.hotel_name)
			})
			.catch(err => {
				console.error('Error occured: ', err);
				Alert.alert('Error', 'Error occured: ' + err);
            });
            setTimeout(() => this.setState({ loadingHotelDetail: false }), 3000);
	}

  render() {
    const { onScroll = () => {} } = this.props;
    
    return (
        <View style={{flex: 1, backgroundColor: '#DDD'}} >
        {this.state.loadingHotelDetail ? <LinearGradient
            colors={['#03A9F4', '#448AFF']}
            style={styles.containerLoading}
            start={{ x: 1, y: 0,z:1}}
            end={{ x:0, y:1}}
        >
            <Spinner style={styles.spinner} isVisible={true} size={100} type={'ThreeBounce'} color={'#FFF'} />
            <Text style={styles.loadingText} >Getting The Details...</Text>
        </LinearGradient> :
      <ParallaxScrollView
        backgroundColor="transparent"
        contentBackgroundColor="transparent"
        stickyHeaderHeight={SCREEN_HEIGHT * 0.1}
        parallaxHeaderHeight={SCREEN_HEIGHT * 0.5}
        renderBackground={() => (
          <View>
            <Animated.Image
              source={{uri: this.state.hoteldata.url_image_traveloka.toString() == 'NA' ? this.state.hoteldata.url_image_misteraladin.toString() : this.state.hoteldata.url_image_traveloka.toString()}}
              style={{
                height: SCREEN_HEIGHT * 0.5,
                opacity: 0.9
              }}
            />
            </View>
        )}
        renderForeground={() => (
         <View style={{ margin: 10, height: 300, flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Text style={{fontWeight: 'bold', 
            textAlign:'right',
            style: 'bold', 
            fontSize: 30, 
            color:'white', 
            shadowColor: '#000',
            shadowOpacity: 1,
            shadowRadius: 25,
            shadowOffset: {
                width: 0, height: 5
            }}}>{this.state.hoteldata.hotel_name.toString()}</Text>
            <Text style={{textAlign:'left', fontSize:20, color:'white'}}>{this.state.hoteldata.location}</Text>
            <View style={{ flexDirection:'row'}}>
              <Text style={{margin:10, fontWeight:'bold', color:'white'}}>4.5</Text>
              <Icon2 name="md-star" size={20} color="white" style={{margin:10}}/>
              <Icon2 name="md-star" size={20} color="white" style={{margin:10}}/>
              <Icon2 name="md-star" size={20} color="white" style={{margin:10}}/>
              <Icon2 name="md-star" size={20} color="white" style={{margin:10}}/>
              <Icon2 name="md-star-half" size={20} color="white" style={{margin:10}}/>
            </View>
              <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
              <Button rounded light>
                <Text>See Review</Text>
                </Button>
              </View>
              <View style={{marginBottom:10,height:50,width:SCREEN_WIDTH * 0.95, flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
              <Icon2 name="ios-arrow-up" size = {30} marginBottom = {20}/>
              </View>
          </View>
        )}
         renderStickyHeader={() => (
            <Header hasTabs style={{backgroundColor: 'transparent', borderBottomColor: 'transparent', borderBottomWidth: 10}} iosBarStyle="light-content" >
            <Left>
                <Button transparent onPress={() => Actions.list()}>
                    <Icon ios="ios-arrow-back" android="md-arrow-back" style={{ color: '#FFF'}}/>
                </Button>
            </Left>
            <Body>
                {/* <Title style={{ color: '#FFF', fontFamily: 'Avenir Next'}} >{this.state.currentMovieDetail.Title}</Title> */}
            </Body>
            </Header>
      
        )} 
        >
   
      <View  style={{flex:1}}>
      <Content>
      <ScrollView>
        <Card>
          <TouchableOpacity>
            <CardItem>
              <Thumbnail resizeMode='contain' style = {styles.thumbnailImage} source={{ uri: 'http://nurulnoe.com/wp-content/uploads/2015/05/Logo-Mister-Aladin.png' }} />
              <Body style={styles.bodyCard} >
                <Text>Mister Aladin</Text>
                <Text note>Rp {this.state.hoteldata.harga_misteraladin}</Text>
              </Body>
              <Icon name="ios-arrow-forward" size={30}>
                </Icon>
            </CardItem>
          </TouchableOpacity>
          <TouchableOpacity>
            <CardItem>
              <Thumbnail resizeMode='contain' style = {styles.thumbnailImage} source={{ uri: 'https://i.pinimg.com/originals/d5/da/ee/d5daeeaca986fb2655a4965884c0d6ea.jpg' }} />
              <Body style={styles.bodyCard}>
                <Text>Traveloka</Text>
                <Text note>Rp {this.state.hoteldata.harga_traveloka}</Text>
              </Body>
              <Icon name="ios-arrow-forward" size={30}>
                </Icon>
            </CardItem>
          </TouchableOpacity>  
          <TouchableOpacity>
            <CardItem>
              <Thumbnail resizeMode='contain' style = {styles.thumbnailImage} source={{ uri: 'https://www.yondervacationrentals.com/wp-content/uploads/2014/03/tripadvisor-logo-png-e1469626631904.png' }} />
              <Body style={styles.bodyCard}>
                <Text>Trip Advisor</Text>
                <Text note>NA</Text>
              </Body>
              <Icon name="ios-arrow-forward" size={30}>
                </Icon>
            </CardItem>
          </TouchableOpacity>
          <TouchableOpacity>
            <CardItem>
              <Thumbnail resizeMode='contain' style = {styles.thumbnailImage} source={{ uri: 'https://pbs.twimg.com/profile_images/881714571534258176/iLEnrt1g.jpg' }} />
              <Body style={styles.bodyCard}>
                <Text>Pegi Pegi</Text>
                <Text note>NA</Text>
              </Body>
              <Icon name="ios-arrow-forward" size={30}>
                </Icon>
            </CardItem>
          </TouchableOpacity>
          <TouchableOpacity>
            <CardItem>
              <Thumbnail resizeMode='contain' style = {styles.thumbnailImage} source={{ uri: 'https://s3.amazonaws.com/genericimages/directory/hotels/logos/imagen_agoda_g.jpg' }} />
              <Body style={styles.bodyCard}>
                <Text>Agoda</Text>
                <Text note>NA</Text>
              </Body>
              <Icon name="ios-arrow-forward" size={30}>
                </Icon>
            </CardItem>
          </TouchableOpacity>
        </Card>
        </ScrollView>
      </Content>
    </View>

  </ParallaxScrollView>
    }
  </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   background: {
//     height: LOCATION_HEIGHT * 0.5
//   },
//   thumbnailImage: {
//     borderWidth:1,
//     alignItems:'center',
//     justifyContent:'center',
//     backgroundColor:'#fff',
//     borderRadius:100,
//   },
//   bodyCard: {margin:10, justifyContent:'center'},
//   stickySection: {
//     flexDirection: 'row',
//     marginLeft: 10,
//     height: 100,
//     width: 300,
//     justifyContent: 'space-between',
//   }

// });