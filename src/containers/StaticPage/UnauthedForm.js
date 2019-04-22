import React, { useState, useEffect } from 'react'
import { ReactComponent as LogoWhite } from '../../img/logo_light.svg'
import { Elements, CardElement, injectStripe } from 'react-stripe-elements'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
import { formatCents } from '../../util/currency'
import { connect } from 'react-redux'
import { red } from 'ansi-colors'
import { SMS } from 'aws-sdk'

const FormGroup = ({ children, title = '', className = '' } = {}) => (
  <label className={'mb-8 block w-full' + className}>
    <div className="text-base font-bold text-grey-darkest mb-3">{title}</div>
    {children}
  </label>
)

const ToggleButtons = ({ title, options, selected, onChange } = {}) => (
  <FormGroup title={title}>
    <div className="flex -m-4">
      {options.map((option, i) => (
        <>
          <input type="radio" name={i} className="hidden" />
          <label
            key={i}
            htmlFor={i}
            onClick={() => onChange(i)}
            className={
              'border-2 cursor-pointer text-center flex-1 border-grey-lightest m-4 px-4 py-3 rounded-sm text-grey-dark focus:outline-none ' +
              (selected === i ? ' border-pink-light text-pink font-bold ' : '')
            }
          >
            {option.name}
          </label>
        </>
      ))}
    </div>
  </FormGroup>
)

const FormText = ({
  type = 'text',
  onChange,
  value,
  title = '',
  className = '',
} = {}) => (
  <FormGroup title={title} className={className}>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-3 py-2 block w-full text-lg focus:outline-none border-2 border-grey-lightest focus:border-pink-lightest"
    />
  </FormGroup>
)

const CardForm = injectStripe(
  ({ price, name, setName, email, setEmail, setStep, stripe, setToken }) => {
    const [cardError, setCardError] = useState('')
    const [loading, setLoading] = useState(false)

    const verifyCard = e => {
      e.preventDefault()

      console.log(name, email)

      if (!name || !email) return toast.error('Please fill out all fields')
      console.log('submitting')
      setLoading(true)
      stripe.createToken().then(({ token, error }) => {
        if (error) setCardError(error.message)
        else {
          setToken(token.id)
          setStep(1)
        }

        setLoading(false)
      })
    }

    return (
      <form onSubmit={verifyCard}>
        <p className="text-center mb-6 text-grey-dark">
          Already have an account?{' '}
          <Link to="/login" className="text-pink">
            Login
          </Link>
        </p>
        <div className="mb-8">
          <div className="flex justify-between flex-wrap sm:flex-no-wrap -mx-1">
            <FormText
              title="Name on Card"
              className="flex-1 w-full mx-1 sm:w-1/2"
              value={name}
              onChange={setName}
            />
            <FormText
              title="Email"
              className="flex-1 w-full mx-1 sm:w-1/2"
              value={email}
              onChange={setEmail}
            />
          </div>
          <CardElement className="px-3 py-3 border-2 border-grey-lightest focus:border-pink-lightest" />
          {cardError && <p className="text-red text-sm">{cardError}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-pink-dark font-bold flex items-center justify-center tracking-wide text-white rounded-sm shadow-md px-6 py-3"
        >
          <LogoWhite width={20} className="mr-3" />
          {!loading ? (
            <p className="flex items-baseline uppercase tracking-wide font-medium">
              Say Thanks for {formatCents(price)}
            </p>
          ) : (
            'Loading...'
          )}
        </button>
      </form>
    )
  }
)

const UnauthedForm = ({ payable, app, price = 50, requestLink }) => {
  const topups = [
    { name: '$5', value: '500' },
    { name: '$10', value: '1000' },
    { name: '$15', value: '1500' },
    { name: '$20', value: '2000' },
  ]

  const [topup, setTopup] = useState(0)

  const [step, setStep] = useState(0)

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')

  const pay = () => {
    if (!app) return
    setLoading(true)
    axios
      .post(`${config.api.baseUrl}/transactions/new`, {
        app: app.id,
        price,
        name: name,
        email: email,
        top_up: 500,
        card_token: token,
      })
      .then(() => {
        toast.success(`Tipped ${formatCents(price)}`)
        setStep(2)
      })
      .catch(e => {
        if (e.response && e.response.data)
          toast.error(e.response && e.response.data && e.response.data.message)
        else toast.error(e.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (step === 2) {
      // window.location = payable.permalink
      requestLink(email)
    }
  }, [step])

  return (
    <div className="bg-white overflow-hidden mb-6">
      {/* <div className="color-bar w-full h-1 bg-pink-light" /> */}
      <div className="p-6">
        {step === 0 && (
          <Elements>
            <CardForm
              price={price}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              setStep={setStep}
              setToken={setToken}
            />
          </Elements>
        )}

        {step === 1 && (
          <div>
            <button
              className="text-grey mb-4 font-bold text-sm"
              onClick={() => setStep(0)}
            >
              <i className="fas fa-chevron-left mr-1 opacity-75" />
              Card Info
            </button>
            <h2 className="mb-2 text-lg">Spread the Thanks</h2>{' '}
            <p className="text-grey-dark leading-normal mb-8">
              Card procesing fees are expensive! So to support creators the best
              we can, we need you to fill up your account with at least
              $5&mdash;which opens the doors to{' '}
              <a href="#sites" className="text-pink active:text-pink-darker">
                tons of awesome content and creators
              </a>
              .
            </p>
            <form className="mb-8">
              {/* <div className="flex justify-between flex-wrap sm:flex-no-wrap -mx-1">
              <FormText title="Email" className="flex-1 w-full mx-1 sm:w-1/2" />
              <FormText
                title="Password"
                type="password"
                className="flex-1 w-full mx-1 sm:w-1/2"
              />
            </div> */}
              <div>
                <ToggleButtons
                  title="Top Up Account"
                  options={topups}
                  selected={topup}
                  onChange={setTopup}
                />
              </div>
            </form>
            <button
              onClick={pay}
              className="w-full bg-pink-lightest font-bold flex items-center justify-center tracking-wide text-pink-dark rounded-sm px-6 py-2"
            >
              {loading ? (
                'Loading...'
              ) : (
                <p className="flex items-baseline">
                  Create Account and Give {formatCents(price)}
                </p>
              )}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-grey-darkest mb-2 text-2xl">
              Thanks for giving!
            </h3>

            <p className="leading-normal text-grey-darkest text-lg">
              To use the rest of your balance, click the link in the email we
              just sent to verify your account or{' '}
              <Link to="/login" className="text-teal-dark no-under">
                login and keep giving.
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default connect(
  () => ({}),
  dispatch => ({ requestLink: dispatch.auth.requestEmailLogin })
)(UnauthedForm)
