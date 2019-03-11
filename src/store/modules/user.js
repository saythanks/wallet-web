import axios from 'axios'
import config from '../../config'
import toast from 'toast'

const initialState = {
  balance: 0,
  monthly_spend: 0,
}

export default {
  state: initialState,
  reducers: {
    SET_BALANCE: (state, balance) => ({
      ...state,
      balance,
    }),
  },
  effects: dispatch => ({
    loadBalance(rootState) {
      axios.defaults.headers = {
        Authorization: `Bearer ${rootState.auth.user.idToken}`,
      }

      return axios
        .get(`${config.api.baseUrl}/balance`)
        .then(res => rootState.SET_BALANCE(res.data.balance))
        .catch(err => toast.error(err.messag))
    },
  }),
}
