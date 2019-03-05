import React, { useState } from 'react'
import { connect } from 'react-redux'
// import firebase from 'firebase/app'
// import 'firebase/auth'
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

// Configure FirebaseUI.
// const uiConfig = {
//   // Popup signin flow rather than redirect flow.
//   signInFlow: 'popup',
//   // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
//   signInSuccessUrl: '/',
//   // We will display Google and Facebook as auth providers.
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//   ],
//   callbacks: {
//     // Avoid redirects after sign-in.
//     signInSuccessWithAuthResult: null,
//   },
// }

const Login = ({ requestEmailLogin }) => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)

    console.log(email, window.location.href)
    requestEmailLogin(email, window.location.href).catch(console.error)
  }

  return (
    <div className="my-16">
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="px-4 py-2 block"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="my-4 bg-pink text-white p-4">Sign in</button>
        </form>
      )}
      {submitted && <div>Thanks! Check your email</div>}
    </div>
  )
}

const mapDispatch = dispatch => ({
  requestEmailLogin: dispatch.auth.requestEmailLogin,
})
export default connect(
  () => ({}),
  mapDispatch
)(Login)
