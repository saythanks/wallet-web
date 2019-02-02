export default class RestAPI {
  static baseURL = 'http://localhost:8080'
  static url = path => `${RestAPI.baseURL}/${path}`
}
