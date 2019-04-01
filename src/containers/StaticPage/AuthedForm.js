import React, { useState, useEffect } from 'react'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import { connect } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
import TipButton from '../../components/TipButton/TipButton'

const AuthedForm = ({ payable, app, idToken, price }) => {
  const [loading, setLoading] = useState(false)

  const [initialTip, setInitalTip] = useState(1)

  const formatCents = (c, to = 2) =>
    c < 100 ? `${c}¢` : `$${(c / 100).toFixed(to)}`

  useEffect(() => {
    axios.defaults.headers = { Authorization: `Bearer ${idToken}` }
    pay(price, 1, true).then(({ success }) => {
      if (!success) setInitalTip(0)
    })
  }, [])

  const pay = (price, count, alert = false) => {
    if (!app) return
    setLoading(true)
    return axios
      .post(`${config.api.baseUrl}/transactions`, {
        app: app.id,
        price,
        count,
      })
      .then(res => {
        if (alert) toast.success(`Gave ${formatCents(price * count)}`)
        console.log(`Tipped ${price * count}`)
        return Promise.resolve({
          success: true,
          data: res.data,
          failedCount: res.data.notProcessed / price,
        })
      })
      .catch(e => {
        console.error(e.response)
        if (e.response.data.message === 'Not enough funds') {
          toast.error('Out of funds')
        }
        return Promise.resolve({ success: false, failedCount: count })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="mt-8" style={{ transform: 'translateY(50%)' }}>
      <section className="flex justify-center">
        <TipButton price={price} onPay={pay} baseline={initialTip} />
      </section>
    </div>
  )
}

export default connect(state => ({ idToken: state.auth.user.idToken }))(
  AuthedForm
)
