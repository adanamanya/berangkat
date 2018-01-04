import firebase from 'react-native-firebase';

const configurationOptions = {
  debug: true
};

const rnfirebase = firebase.initializeApp(configurationOptions);

export default rnfirebase;
