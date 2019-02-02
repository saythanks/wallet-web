import React from 'react'
import { Route } from 'react-router'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({
  component: Component,
  authenticated,
  props: CProps,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
        <Component {...props} {...CProps} />
      ) : (
        <Redirect
          to={{
            pathname: '/auth/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

export default connect(state => ({ authenticated: state.auth.authenticated }))(
  PrivateRoute
)
