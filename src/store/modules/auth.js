import firebase from 'firebase/app'
import 'firebase/auth'
import SessionAPI from '../../api/sessionApi'

const initialState = {
  authenticated: false,
  user: null,
  session: null,
  error: null,
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
  },
  effects: dispatch => ({
    // retrieveSession: () => {
    //   dispatch.auth.CLEAR_ERROR()
    //   return Auth.currentSession()
    //     .then(dispatch.auth.SET_USER)
    //     .catch(e => {
    //       if (e !== 'No current user') dispatch.auth.SET_ERROR(e)
    //     })
    // },

    // login: ({ email, password }) => {
    // dispatch.auth.CLEAR_ERROR()
    // return Auth.signIn(email, password)
    //   .then(dispatch.auth.SET_USER)
    //   .catch(dispatch.auth.SET_ERROR)
    // },

    // logout: () => AuthAPI.signOut().then(dispatch.auth.CLEAR_AUTH),
    logout: () => firebase.auth().signOut(),

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
