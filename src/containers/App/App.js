import React, { Fragment, useEffect } from 'react'
import { compose } from 'redux'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Switch, Route } from 'react-router'
import { StripeProvider } from 'react-stripe-elements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import store from '../../store'
import Home from '../Home/Home'
import Auth from '../Auth/Auth'
import PublicRoute from '../util/PublicRoute'
import PrivateRoute from '../util/PrivateRoute'
import Embed from '../Embed/Embed'
import config from '../../config'
import Settings from '../Settings/Settings'
import StaticPage from '../StaticPage/StaticPage'

const Meat = ({ listen }) => {
  useEffect(() => listen(), [])

  return (
    <Fragment>
      <ToastContainer />
      <Switch>
        <Route path="/to/:app" component={StaticPage} />
        <Route path="/embed" exact component={Embed} />
        <PublicRoute path="/auth" component={Auth} />
        <PrivateRoute path="/settings" component={Settings} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </Fragment>
  )
}

const mapState = ({ loading }) => ({
  loading: loading.effects.auth.retrieveSession,
})
const mapDispatch = ({ auth }) => ({
  listen: auth.listen,
})

const ConnectedMeat = compose(
  withRouter,
  connect(
    mapState,
    mapDispatch
  )
)(Meat)

const persistor = getPersistor()
const App = () => {
  return (
    <div className="min-h-full bg-grey-lightest">
      <StripeProvider apiKey={config.stripe.apiKey}>
        <PersistGate persistor={persistor}>
          <Provider store={store}>
            <BrowserRouter>
              <ConnectedMeat />
            </BrowserRouter>
          </Provider>
        </PersistGate>
      </StripeProvider>
    </div>
  )
}

export default App
