import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const VerifyEmail = ({ verifyEmail, authenticated }) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Call to firebase auth login
    verifyEmail(window.location.href)
      .then(() => {
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  return (
    <div>
      {loading ? (
        <p>Verifying...</p>
      ) : authenticated ? (
        <Redirect to="/" />
      ) : (
        <div>Logging in...</div>
      )}
    </div>
  )
}

const mapState = state => ({
  authenticated: state.auth.authenticated,
})

const mapDispatch = dispatch => ({
  verifyEmail: dispatch.auth.verifyEmail,
})
export default connect(
  mapState,
  mapDispatch
)(VerifyEmail)
