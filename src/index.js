import React from 'react'
import ReactDOM from 'react-dom'

import './firebase'
import './amplify'
import './index.css'
import App from './containers/App/App'
import * as serviceWorker from './serviceWorker'

import { I18n } from 'aws-amplify'

const authScreenLabels = {}

I18n.setLanguage('en')
I18n.putVocabularies(authScreenLabels)

const root = document.getElementById('root')
ReactDOM.render(<App />, root)

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    const NextApp = require('./containers/App/App').default
    ReactDOM.render(<NextApp />, root)
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
