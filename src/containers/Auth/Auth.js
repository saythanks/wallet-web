import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'

import Login from './Login'
import VerifyEmail from './VerifyEmail'

const FormGroup = ({ name, children }) => (
  <div className="mb-4">
    <label
      className="block mb-1 text-sm text-grey-darker font-bold"
      htmlFor={name}
    >
      {name}
    </label>
    {children}
  </div>
)

const TextGroup = ({ name, value, setValue, type = 'text', ...props }) => (
  <FormGroup name={name}>
    <input
      className="bg-grey-lighter block w-full p-4 focus:outline-none rounded-sm"
      type={type}
      id={name}
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  </FormGroup>
)

const Auth = ({ login, error, loading, match }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    // login({ email, password })
  }

  return (
    <div className="container mx-auto flex items-center justify-center h-full">
      <Route path={`${match.path}/login`} component={Login} />
      <Route path={`${match.path}/verify`} component={VerifyEmail} />
    </div>
  )
}

const mapState = ({ auth: { authenticated, user, error }, loading }) => ({
  authenticated,
  user,
  error,
  loading: loading.models.auth,
})

const mapDispatch = ({ auth }) => ({
  login: auth.login,
})

export default connect(
  mapState,
  mapDispatch
)(Auth)
