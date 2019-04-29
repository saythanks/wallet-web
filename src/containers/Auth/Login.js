import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Input } from '../../components/Form'
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
    requestEmailLogin(email)
  }

  return (
    <div className="container mx-auto h-full flex items-center justify-center">
      <div className="flex-1 max-w-xs mx-auto bg-white m-6 rounded-sm overflow-hidden shadow-lg">
        {/* <div className="w-full h-1 bg-pink" /> */}

        <div className="">
          <div className="p-6">
            <h1 className="text-grey-dark uppercase tracking-wide text-base pb-3 border-b border-grey-lighter">
              Sign in to Say Thanks
            </h1>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="clearfix">
              <div className="p-6 pt-0">
                <Input title="Email" value={email} onChange={setEmail} />
              </div>
              <button className="bg-pn-4 px-4 py-2 text-pn-1 uppercase focus:outline-none  rounded-b-sm w-full shadow-lg block font-bold">
                Sign in
              </button>
            </form>
          ) : (
            <div className="p-6 pt-0">
              <p className="text-grey mb-2">
                A sign-in link has been sent to your email.
              </p>
              <p>
                <a
                  href="#tryAgain"
                  className="text-tl-4 no-underline pb-1 text-sm"
                  onClick={e => {
                    e.preventDefault()
                    setSubmitted(false)
                  }}
                >
                  Didn't recieve an email? Try again
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
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
