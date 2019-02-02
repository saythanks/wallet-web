import Amplify from 'aws-amplify'
import config from './config'

// const oauth = {
//   // Domain name
//   domain: 'micro-app.auth.us-east-1.amazoncognito.com',

//   // Authorized scopes
//   scope: ['email', 'profile', 'openid'],

//   // Callback URL
//   redirectSignIn: 'http://localhost:3000/auth/callback',

//   // Sign out URL
//   redirectSignOut: 'http://localhost:3000/',

//   // 'code' for Authorization code grant,
//   // 'token' for Implicit grant
//   responseType: 'code',

//   // optional, for Cognito hosted ui specified options
//   options: {
//     // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
//     AdvancedSecurityDataCollectionFlag: true,
//   },
// }

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
})

// Auth.configure({ oauth })
