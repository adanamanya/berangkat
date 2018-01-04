import { StyleSheet } from 'react-native';

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#b721ff',
  background2: '#21d4fd',
};

export default StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#DDD',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollViewContentContainer: {
    paddingBottom: 50,
  },
  movieContainer: {
    marginTop: 25
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title2: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: '#b721ff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hotelTitle: {
    color: '#00bfa5',
    paddingTop: 30,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -30
  },
    headerTitle: {
    color: '#b721ff',
    //paddingTop: -10,
    alignSelf: "center",
    marginLeft: 48,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 19,
    flex: 3,
    paddingHorizontal: 30,
    fontSize: 23,
    fontFamily: "modithorsongradital",
    
    
  },
  
  newsTitle: {
    paddingTop: 20,
    color: '#fb8c00',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -30
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.74)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hotelSubtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: '#BBB',
    fontSize: 13,
    fontStyle: 'italic',
  },
  slider: {
    marginTop: 25,
  },
  sliderContentContainer: {
    
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
});