import { Auth, Hub } from 'aws-amplify'
import axios from 'axios'
import SessionAPI from './sessionApi'

const AuthEvents = {
  SignIn: 'signIn',
  SignOut: 'signOut',
}

export default class AuthAPI {
  static listen(callback) {
    new AuthListener(payload => {
      console.log(payload)
      switch (payload.event) {
        case AuthEvents.SignIn:
          SessionAPI.create(payload.data.signInUserSession.accessToken.jwtToken)
            .then(console.log)
            .catch(console.error)
          break
        default:
          break
      }
      callback(payload)
    })
  }

  static currentUser = () => Auth.currentUser()
  static signOut = () => Auth.signOut()

  static signIn = ({ email, password }) => Auth.signIn(email, password)

  static openSignIn = () => {
    const config = Auth.configure()
    const { domain, redirectSignIn, responseType } = config.oauth

    const clientId = config.userPoolWebClientId
    // The url of the Cognito Hosted UI
    const url =
      'https://' +
      domain +
      '/login?redirect_uri=' +
      redirectSignIn +
      '&response_type=' +
      responseType +
      '&client_id=' +
      clientId

    // Launch hosted UI
    window.location.assign(url)
  }
}

class AuthListener {
  constructor(listener) {
    Hub.listen('auth', this, 'AuthListener')

    this.listener = listener
  }

  onHubCapsule = ({ channel, payload }) => {
    if (channel === 'auth') this.listener(payload)
  }
}
