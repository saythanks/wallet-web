import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: null,
    signInSuccess: console.log,
  },
}

const InlineLogin = () => {
  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  )
}
export default InlineLogin
