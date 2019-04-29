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
import Spinner from '../../components/Spinner/Spinner'

const FormGroup = ({ children, title = '', className = '' } = {}) => (
  <label className={'mb-4 block w-full' + className}>
    <div className="text-base font-bold text-grey-darkest mb-3">{title}</div>
    {children}
  </label>
)

const ToggleButtons = ({ title, options, selected, onChange } = {}) => (
  <div className="flex">
    {options.map((option, i) => (
      <>
        <input type="radio" name={i} className="hidden" />
        <label
          key={i}
          htmlFor={i}
          onClick={() => onChange(i)}
          className={
            'cursor-pointer text-center flex-1 px-4 py-3 rounded-sm text-gr-4 focus:outline-none hover:text-pr-5 ' +
            (selected === i
              ? ' bg-gr-3 font-bold shadow text-white hover:text-white'
              : '')
          }
        >
          {option.name}
        </label>
      </>
    ))}
  </div>
)

const FormText = ({
  type = 'text',
  onChange = () => null,
  value,
  title = '',
  className = '',
  ...props
} = {}) => (
  <FormGroup title={title} className={className}>
    <input
      type={type}
      value={value}
      {...props}
      onChange={e => onChange(e.target.value)}
      className="input-text text-gr-5 px-3 py-2 rounded-sm block w-full text-base bg-gr-0 focus:outline-none border-2 border-white focus:border-gr-1"
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

      if (!name) return toast.error('Please fill out all fields')
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
        <div className="p-6">
          <p className="text-center mb-0 text-gr-3 text-xs font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-tl-4">
              Log In
            </Link>
          </p>
          <div className="mb-8">
            <FormText
              placeholder="Name on Card"
              value={name}
              onChange={setName}
            />
            <CardElement className="px-3 py-2 border-2 border-white rounded-sm bg-gr-0 " />
            {cardError && <p className="text-red text-sm">{cardError}</p>}
          </div>
        </div>

        <button
          className="flex-items-center bg-pn-4 text-pn-1 font-bold block px-2 py-3 w-full text-lg focus:outline-none"
          style={{ touchAction: 'manipulation' }}
          type="submit"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <span className="text-pn-5">Say Thanks with</span>{' '}
              {formatCents(price)}
            </>
          )}
        </button>
      </form>
    )
  }
)

const UnauthedForm = ({
  payable,
  app,
  price = 50,
  requestLink,
  setShouldHideInfo,
}) => {
  const topups = [
    { name: '$5', value: '500' },
    { name: '$10', value: '1000' },
    { name: '$15', value: '1500' },
    { name: '$20', value: '2000' },
  ]

  const [topup, setTopup] = useState(0)

  const [step, setStep] = useState(2)

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
    if (step >= 1) setShouldHideInfo(true)
    else setShouldHideInfo(false)

    if (step === 2) {
      // window.location = payable.permalink
      requestLink(email)
    }
  }, [step])

  return (
    <div className="bg-white overflow-hidden text-left">
      <div className="">
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
            <div className="px-6">
              <button
                className="text-gr-3 mb-4 font-bold text-xs focus:outline-none"
                onClick={() => setStep(0)}
              >
                <i className="fas fa-chevron-left mr-1 opacity-75" />
                Card Info
              </button>
              <h2 className="mb-2 text-sm text-gr-4 uppercase tracking-normal">
                Spread the Thanks
              </h2>{' '}
              <p className="text-gr-3 text-sm leading-normal mb-2">
                Card procesing fees are{' '}
                <strong>
                  <em>a lot</em>
                </strong>{' '}
                at small scale. So to support creators the best we can, we need
                you to fill up your account with at least <strong>$5</strong> to
                start. Your tip will be deducted from that amount.
              </p>
              <p className="text-gr-3 text-sm leading-normal mb-8">
                Not convinced? Check out{' '}
                <a href="#content" className="text-tl-4">
                  all the great creators
                </a>{' '}
                you can give to with Say Thanks.
              </p>
              <form className="mb-8">
                <p className="font-semibold text-gr-3 mb-4 text-sm">
                  Fill up and create account
                </p>
                <ToggleButtons
                  title="Top Up Account"
                  options={topups}
                  selected={topup}
                  onChange={setTopup}
                />
                <div className="mt-6">
                  <FormText
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
                    className="flex-1 w-full"
                  />
                  <FormText
                    placeholder="Password"
                    type="password"
                    className="flex-1 w-full"
                  />
                </div>
              </form>
            </div>
            <p className="text-gr-1 my-4 text-center text-sm">
              You will be charged {formatCents(topups[topup].value)}
            </p>
            <button
              className="flex-items-center bg-pn-4 text-pn-1 font-bold block px-2 py-3 w-full text-lg focus:outline-none"
              style={{ touchAction: 'manipulation' }}
              onClick={pay}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span className="text-pn-5">Fill up and say Thanks with</span>{' '}
                  {formatCents(price)}
                </>
              )}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="p-6 text-center">
            <h3 className="text-pr-4 mb-2 text-lg">Thanks for giving!</h3>

            <p className="leading-normal text-gr-4 mb-4 text-lg">
              To use the rest of your balance, click the link in the email we
              just sent to verify your account or{' '}
              <Link to="/login" className="text-tl-4 no-under">
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
