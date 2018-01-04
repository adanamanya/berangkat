import React, { Component } from 'react';
import {
 AppRegistry,
 StyleSheet,
 Text,
 View,
 Picker,
 Image,
 Alert,
 TouchableOpacity
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
 Spinner,
 List
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import DoubleClick from 'react-native-double-click';
import { firebaseApp } from '../components/firebase';
import * as firebase from 'firebase';
export default class NewsList extends Component {
 constructor() {
  super();

  this.state = {
   city: '',
   selectedCity: '',
   spinnerColor: 'white',
   news: {}
  };
 }
 componentWillMount() {
          this.currentUser = firebase.auth().currentUser;
          //console.log(this.currentUser);
          //console.log(this.currentUser.uid);
          this.setState({
              uname: this.currentUser.displayName,
              email: this.currentUser.email
          })
  
      }
 componentDidMount() {
  this.getNews();
 }
 getNews() {
  this.setState({
   spinnerColor: 'blue',
   loading: true
  });
  
  return fetch('https://travelokadbjkt.firebaseio.com/news.json')
   .then((response) => response.json())
   .then((responseJson) => {
    this.setState({
     news: responseJson,
     loading: false
    });
    return responseJson;
   })
   .catch((error) => {
    this.setState({loading: false});
   });
 }

 handleItemPress(url) {
  Actions.newsdetails({url: url});
 }
    
 render() {
  return (
   <Container>
    <Header hasTabs style={{ backgroundColor: '#fb8c00'}} iosStatusbar="light-content"
      androidStatusBarColor='#fb8c00'>
     <Left>
      <Button transparent onPress={this._goBack}>
       <Icon name="ios-arrow-back"/>
      </Button>
     </Left>
     <Body>
      <Title>Article List</Title>
     </Body>
     <Right />
    </Header>
      
    <Content>
     {this.state.loading ? <Spinner color={this.state.spinnerColor} /> :
     
      <List
       dataArray={this.state.news}
       renderRow={(news) =>
        <DoubleClick onClick={this.fav.bind(this, news.url, news.image, news.title)} >
        
         <Card>
          <CardItem>
           <Grid>
            <Row size={300}>
             <Col size={30} >
              <Image
               source={{ uri: news.image }}
               style={{ height: 100, width: 100, borderRadius: 8}}
              />
             </Col>
             <Col size={70} >
             <TouchableOpacity onPress={() => this.handleItemPress(news.url)}>
              <Row size={1} style={{ paddingTop: 10, paddingLeft: 10 }} >
               <Text style={styles.newsTitle} >{news.title}</Text>
              </Row>
              </TouchableOpacity>
              <Row size={2} style={{paddingLeft: 10}} >
               <Text>{news.timestamp}</Text>
              </Row>
              <Row size={2} style={{paddingLeft: 10}} >
               <Text>{news.kanal}</Text>
              </Row>
             </Col>
            </Row>
           </Grid>
          </CardItem>
         </Card>
        </DoubleClick>
       }    
      />
     }
    </Content>
   </Container>
  );
 }
 _goBack = () => {
       Actions.menudefault({type: 'reset'});
  }
  fav(news, img, title) {
    firebaseApp.database().ref('users/' + this.currentUser.uid + '/favnews/' + title).set({
       news,
       img
     })
     alert(`added to favorites ${news}`);
     alert(`added to favorites ${title}`);
     console.log()
 }
}

const styles = StyleSheet.create({
 newsTitle: {
  fontWeight: 'bold'
 },
 container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF',
 },
 welcome: {
  fontSize: 20,
  textAlign: 'center',
  margin: 10,
 },
 instructions: {
  textAlign: 'center',
  color: '#333333',
  marginBottom: 5,
 },
});