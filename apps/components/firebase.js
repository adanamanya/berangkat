const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const firebaseConfig = {
  apiKey: 'AIzaSyA9T5yzTooM6MMoochzgQQ_k4-oO2ikfvE',
  authDomain: 'travelokadbjkt.firebaseapp.com',
  databaseURL: 'https://travelokadbjkt.firebaseio.com',
  storageBucket: 'travelokadbjkt.appspot.com',
  projectId: 'travelokadbjkt'
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)