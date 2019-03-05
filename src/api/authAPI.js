import firebase from 'firebase/app'
import 'firebase/auth'

const actionCodeSettings = () => ({
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: `${window.location.protocol}//${window.location.hostname}${
    window.location.port === 80 ? '' : `:${window.location.port}`
  }/auth/verify`,
  // This must be true.
  handleCodeInApp: true,
})

export const requestEmailLink = email => {
  console.log(actionCodeSettings())
  return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings())
}

export const verifyEmail = (email, currentUrl) => {
  // Confirm the link is a sign-in with email link.
  if (!firebase.auth().isSignInWithEmailLink(currentUrl)) return

  // The client SDK will parse the code from the link for you.
  firebase.auth().signInWithEmailLink(email, currentUrl)
}
