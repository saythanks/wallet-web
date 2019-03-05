import firebase from 'firebase/app'
import 'firebase/auth'
import SessionAPI from '../../api/sessionApi'
import { requestEmailLink, verifyEmail } from '../../api/authAPI'

const initialState = {
  authenticated: false,
  user: null,
  session: null,
  error: null,
  tmpEmail: '',
}

export default {
  state: initialState,
  reducers: {
    CLEAR_AUTH: () => initialState,
    SET_USER: (state, user) => ({ ...state, user, authenticated: !!user }),
    SET_SESSION: (state, session) => ({
      ...state,
      session,
      authenticated: !!session,
    }),
    SET_ERROR: (state, error) => ({ ...state, error }),
    CLEAR_ERROR: state => ({ ...state, error: null }),
    SET_TMP_EMAIL: (state, tmpEmail) => ({ ...state, tmpEmail }),
  },
  effects: dispatch => ({
    logout: () => firebase.auth().signOut(),

    requestEmailLogin: email =>
      requestEmailLink(email).then(() => dispatch.auth.SET_TMP_EMAIL(email)),

    verifyEmail: (url, rootState) => verifyEmail(rootState.auth.tmpEmail, url),

    // openLogin: () => AuthAPI.openSignIn(),
    // listen: () => AuthAPI.listen(payload => {}),
    listen: () => {
      const unsub = firebase.auth().onAuthStateChanged(user => {
        if (!user) dispatch.auth.CLEAR_AUTH()
        else {
          user
            .getIdToken()
            .then(idToken => {
              SessionAPI.create(idToken)
              dispatch.auth.SET_USER({
                email: user.emaill,
                uid: user.uid,
                idToken,
              })
            })
            .catch(dispatch.auth.CLEAR_AUTH)
        }
      })
      return unsub
    },
  }),
}
