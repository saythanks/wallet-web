import React, { useState, useEffect } from 'react'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import { connect } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'

const AuthedForm = ({ payable, idToken }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.defaults.headers = { Authorization: `Bearer ${idToken}` }
  })

  const pay = () => {
    if (!payable) return
    setLoading(true)
    axios
      .post(`${config.api.baseUrl}/transactions`, {
        payable: payable.id,
      })
      .then(() => toast.success(`Tipped ${payable.display_price}`))
      .catch(e => toast.error(e.message))
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="mt-12">
      <section className="flex justify-center">
        <button
          disabled={loading}
          className="flex items-center justify-center px-8 py-1 uppercase tracking-wide
                     bg-pink-dark text-white rounded-sm font-bold 
                     active:bg-pink active:text-pink-lightest"
          onClick={pay}
        >
          <Logo width={20} className="mr-2" />
          {loading ? 'Loading...' : 'Say thanks for a dime'}
        </button>
      </section>
    </div>
  )
}

export default connect(state => ({ idToken: state.auth.user.idToken }))(
  AuthedForm
)
