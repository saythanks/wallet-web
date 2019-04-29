import React, { useState, useEffect } from 'react'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import { connect } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
import TipButton from '../../components/TipButton/TipButton'
import Modal from 'react-modal'
import TopUpForm from '../../components/TopUpForm'
import { Elements } from 'react-stripe-elements'

const AuthedForm = ({
  payable,
  app,
  idToken,
  price = 50,
  balance,
  setBalance,
}) => {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(0)
  const [modal, setModal] = useState(false)

  const [initialTip, setInitalTip] = useState(0)

  const formatCents = (c, to = 2) =>
    c < 100 ? `${c}¢` : `$${(c / 100).toFixed(to)}`

  // Tip on load
  // useEffect(() => {
  //   axios.defaults.headers = { Authorization: `Bearer ${idToken}` }
  //   pay(price, 1, true).then(({ success }) => {
  //     if (!success) setInitalTip(0)
  //   })
  // }, [])

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
        console.log(res)
        setBalance(res.data.balance)
        setPaid(paid + price * count)
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

  const handleBalanceUpdate = price => {
    if (balance > price) {
      setBalance(balance - price)
    }
  }

  return (
    <div className="mt-8 w-full block">
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        className="flex h-full w-full items-center justify-center focus:outline-none"
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,.4)',
          },
        }}
      >
        <div className="wrap bg-white p-6 rounded-sm shadow">
          <h2 className="uppercase text-lg mb-4 text-grey-darker">
            Add Money to your Account
          </h2>
          <Elements>
            <TopUpForm onSuccess={() => setModal(false)} />
          </Elements>
          <div className="text-center">
            <button
              onClick={() => setModal(false)}
              className="mt-4 text-grey-dark font-medium focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      {paid > 0 && (
        <>
          <p className="text-gr-4 text-sm font-medium mb-1">
            {formatCents(paid)} given
          </p>
          <p className="text-gr-3 text-sm mb-3">Keep clicking to give more</p>
        </>
      )}

      <TipButton
        onIndividualClick={() => handleBalanceUpdate(price)}
        disabled={balance < price}
        price={price}
        onPay={pay}
        openTopUpForm={() => setModal(true)}
        baseline={initialTip}
      />
    </div>
  )
}

export default connect(
  state => ({ idToken: state.auth.user.idToken, balance: state.auth.balance }),
  dispatch => ({ setBalance: dispatch.auth.SET_BALANCE })
)(AuthedForm)
