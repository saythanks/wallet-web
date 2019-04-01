import React, { useState, useEffect } from 'react'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import { connect } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
import TipButton from '../../components/TipButton/TipButton'

const AuthedForm = ({ payable, app, idToken, price }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.defaults.headers = { Authorization: `Bearer ${idToken}` }
  }, [])

  const pay = () => {
    if (!app) return
    setLoading(true)
    axios
      .post(`${config.api.baseUrl}/transactions`, {
        app: app.id,
      })
      .then(() => toast.success(`Tipped ${payable.display_price}`))
      .catch(e => {
        console.error(e)
        toast.error(e.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="mt-8" style={{ transform: 'translateY(50%)' }}>
      <section className="flex justify-center">
        <TipButton price={price} />
      </section>
    </div>
  )
}

export default connect(state => ({ idToken: state.auth.user.idToken }))(
  AuthedForm
)
