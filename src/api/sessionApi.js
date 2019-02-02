import axios from 'axios'
import RestAPI from './RestAPI'

export default class SessionAPI {
  static create(accessToken) {
    return axios.post(
      RestAPI.url('session'),
      { accessToken },
      { withCredentials: true }
    )
  }

  static destroy = () =>
    axios({ method: 'DELETE', url: RestAPI.url('/session') }).then(res =>
      res.json()
    )
}
