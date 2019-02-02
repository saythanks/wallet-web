import firebase from 'firebase/app'
import 'firebase/auth'

var config = {
  apiKey: 'AIzaSyBRNnkNGVbWyUOqL4eeF08zPfPmR3-6Hrc',
  authDomain: 'micro-pay-me.firebaseapp.com',
  databaseURL: 'https://micro-pay-me.firebaseio.com',
  projectId: 'micro-pay-me',
  storageBucket: 'micro-pay-me.appspot.com',
  messagingSenderId: '104429046869',
}
firebase.initializeApp(config)
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
