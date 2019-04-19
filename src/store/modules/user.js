import axios from 'axios'
import config from '../../config'

const initialState = {
  balance: 0,
  user: null,
}

export default {
  state: initialState,
  reducers: {
    SET: (state, update) => ({
      ...state,
      ...update,
    }),

    SET_BALANCE: (state, balance) => ({
      ...state,
      balance,
    }),
  },
  effects: dispatch => ({
    loadInfo(payload, rootState) {
      console.log(rootState)
      axios.defaults.headers = {
        Authorization: `Bearer ${rootState.auth.user.idToken}`,
      }

      return axios
        .get(`${config.api.baseUrl}/me`)
        .then(res => dispatch.SET(res.data))
        .catch(console.error)
    },

    loadBalance(payload, rootState) {
      axios.defaults.headers = {
        Authorization: `Bearer ${rootState.auth.user.idToken}`,
      }

      return axios
        .get(`${config.api.baseUrl}/balance`)
        .then(res => rootState.SET_BALANCE(res.data.balance))
        .catch(console.error)
    },
  }),
}
