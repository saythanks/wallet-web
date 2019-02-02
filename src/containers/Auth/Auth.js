import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import Login from './Login'

// const FormGroup = ({ name, children }) => (
//   <div className="mb-4">
//     <label
//       className="block mb-1 text-sm text-grey-darker font-bold"
//       htmlFor={name}
//     >
//       {name}
//     </label>
//     {children}
//   </div>
// )

// const TextGroup = ({ name, value, setValue, type = 'text', ...props }) => (
//   <FormGroup name={name}>
//     <input
//       className="bg-grey-lighter block w-full p-4 focus:outline-none rounded-sm"
//       type={type}
//       id={name}
//       {...props}
//       value={value}
//       onChange={e => setValue(e.target.value)}
//     />
//   </FormGroup>
// )

const Auth = ({ login, error, loading, match }) => {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')

  // const handleSubmit = e => {
  //   e.preventDefault()
  //   // login({ email, password })
  // }

  return (
    <div className="container mx-auto flex items-center justify-center h-full">
      <Route path={`${match.path}/login`} component={Login} />
      <Route
        path={`${match.path}/redirect`}
        render={() => <div>Redirecting</div>}
      />
      {/* <form
        onSubmit={handleSubmit}
        className="px-16 py-8 m-16 mb-32 bg-white rounded shadow-lg max-w-sm flex-1"
      >
        <h1 className="text-2xl mb-8 text-grey-darkest">
          Login to access content
        </h1>

        {error && (
          <div className="p-4 bg-red-lightest text-red-dark font-bold mb-4 -mt-2 rounded-sm">
            {error.message ? error.message : error}
          </div>
        )}

        <TextGroup name="Email" value={email} setValue={setEmail} />
        <TextGroup
          name="Password"
          type="password"
          value={password}
          setValue={setPassword}
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-lightest text-blue-dark font-bold px-4 py-2 rounded-sm focus:outline-none active:bg-blue-lighter"
          >
            {loading ? 'loading...' : 'Sign in'}
          </button>
          <Link
            to="/auth/signup"
            className="no-underline ml-2 text-grey-darker font-semibold text-sm"
          >
            or sign up
          </Link>
        </div>
      </form> */}
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
