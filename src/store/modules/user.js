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
    SET_BALANCES: (state, { balance, monthly_spend }) => ({
      ...state,
      balance,
      monthly_spend,
    }),
  },
  effects: dispatch => ({
    loadBalance(rootState, payload) {
      return axios
        .get(`${config.api.baseUrl}/balance`)
        .then(res => rootState.SET_BALANCES(res.data))
        .catch(err => toast.error(err.messag))
    },
  }),
}
