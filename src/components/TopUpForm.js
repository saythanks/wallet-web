import React, { Fragment, useState } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { toast } from 'react-toastify'
import config from '../config'
import axios from 'axios'
import { connect } from 'react-redux'

const TopUpForm = injectStripe(({ idToken, stripe }, context) => {
  const options = [5, 10, 15, 20]
  const [selected, setSelected] = useState(0)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [cardError, setCardError] = useState()

  const handleSubmit = e => {
    e.preventDefault()
    if (step !== 1) return

    setLoading(true)

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    stripe.createToken().then(({ token }) => {
      console.log('Received Stripe token:', token)
      axios.defaults.headers = { Authorization: `Bearer ${idToken}` }
      axios
        .post(`${config.api.baseUrl}/balance`, {
          token: 'tok_visa',
          amount: options[selected] * 100,
        })
        .then(() =>
          toast.success(`$${options[selected]} added to your account!`)
        )
        .catch(e => toast.error(e.message))
        .finally(() => {
          setLoading(false)
          setStep(0)
        })
    })

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', owner: {
    //   name: 'Jenny Rosen'
    // }});
  }

  return (
    <form onSubmit={handleSubmit}>
      {step === 0 ? (
        <div className="flex -m-2 justify-between">
          {options.map((amt, i) => (
            <button
              key={amt}
              type="button"
              className={
                'flex-1 bg-grey-lightest p-2 border text-grey-darker border-white rounded-sm m-2 flex items-start justify-center focus:outline-none ' +
                (selected === i &&
                  'border-pink-lighter bg-pink-lightest text-pink-dark')
              }
              onClick={() => setSelected(i)}
            >
              <span className="opacity-75 mt-px">$</span>
              <span className="text-xl">{amt}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 flex items-baseline flex-no-shrink bg-pink-lightest rounded-sm text-pink-dark uppercase font-bold text-sm tracking-wide m-2 focus:outline-none"
          >
            <i className="fas fa-plus mr-2 text-pink-light" />
            Add Cash
          </button>
        </div>
      ) : (
        <div className="text-left text-sm">
          <button
            type="button"
            className="text-grey-darker mb-2 focus:outline-none"
            onClick={() => setStep(0)}
          >
            <i className="fas fa-arrow-left text-grey-light mr-1" /> Back
          </button>
          <div className="flex items-center justify-between">
            <CardElement
              className="flex-1"
              onChange={({ error }) => {
                if (error) setCardError(error.message)
                else setCardError(null)
              }}
            />
            <button
              type="submit"
              disabled={!!cardError}
              className="bg-pink-lightest text-pink-dark font-bold uppercase tracking-wide focus:outline-none text-xs ml-4 px-4 py-2 rounded-sm"
            >
              {' '}
              {loading ? (
                <div>
                  <i className="fas fa-spinner fa-spin" />
                </div>
              ) : (
                <Fragment>
                  <i className="fas fa-coins text-pink-lighter mr-1" /> Add $
                  {options[selected]}
                </Fragment>
              )}
            </button>
          </div>
          <p className="error text-xs text-red ">{cardError}</p>
        </div>
      )}
    </form>
  )
})

const mapState = state => ({
  idToken: state.auth.user.idToken,
})
export default connect(mapState)(TopUpForm)
