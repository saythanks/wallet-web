import React, { Fragment, useEffect } from 'react'
import { compose } from 'redux'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Switch, Route } from 'react-router'

import store from '../../store'
import Home from '../Home/Home'
import Auth from '../Auth/Auth'
import PublicRoute from '../util/PublicRoute'
import PrivateRoute from '../util/PrivateRoute'
import Embed from '../Embed/Embed'

const Meat = ({ listen }) => {
  useEffect(() => listen(), [])

  return (
    <Fragment>
      <Switch>
        <Route path="/embed" exact component={Embed} />
        <PublicRoute path="/auth" component={Auth} />
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
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <BrowserRouter>
            <ConnectedMeat />
          </BrowserRouter>
        </Provider>
      </PersistGate>
    </div>
  )
}

export default App
