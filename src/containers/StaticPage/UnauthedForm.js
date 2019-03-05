import React, { useState } from 'react'
import { ReactComponent as LogoWhite } from '../../img/logo_light.svg'
import { Elements, CardElement } from 'react-stripe-elements'

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

const FormText = ({ type = 'text', title = '', className = '' } = {}) => (
  <FormGroup title={title} className={className}>
    <input
      type={type}
      className="px-3 py-2 block w-full text-lg focus:outline-none border-2 border-grey-lightest focus:border-pink-lightest"
    />
  </FormGroup>
)

const UnauthedForm = () => {
  const topups = [
    { name: '$5', value: '500' },
    { name: '$10', value: '1000' },
    { name: '$15', value: '1500' },
    { name: '$20', value: '2000' },
  ]

  const [topup, setTopup] = useState(0)

  const [step, setStep] = useState(0)

  const CardInfo = () => (
    <div>
      <p className="text-center mb-6 text-grey-dark">
        Already have an account?{' '}
        <a href="#login" className="text-pink">
          Login
        </a>
      </p>
      <form className="mb-8">
        <div className="flex justify-between flex-wrap sm:flex-no-wrap -mx-1">
          <FormText
            title="Name on Card"
            className="flex-1 w-full mx-1 sm:w-1/2"
          />
          <FormText title="Email" className="flex-1 w-full mx-1 sm:w-1/2" />
        </div>
        <CardElement className="px-3 py-3 border-2 border-grey-lightest focus:border-pink-lightest" />
        <p className="text-xs text-grey mt-3  tracking-wide">
          You won't be charged now&mdash;we bill at the end of each month for
          all payments
        </p>
      </form>

      <button
        onClick={() => setStep(1)}
        className="w-full bg-pink-dark font-bold flex items-center justify-center tracking-wide text-white rounded-sm shadow-md px-6 py-3"
      >
        <LogoWhite width={20} className="mr-3" />
        <p className="flex items-baseline uppercase tracking-wide font-medium">
          Say Thanks for a Quarter
          {/* <span className="text-xl text-white font-normal mb-1 ml-1 opacity-75"> */}
          {/* quarter */}
          {/* </span> */}
        </p>
      </button>
    </div>
  )

  const BalanceInfo = () => (
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
        Card procesing fees are expensive! So to support creators the best we
        can, we need you to fill up your account with at least $5&mdash;which
        opens the doors to{' '}
        <a href="#sites" className="text-pink active:text-pink-darker">
          tons of awesome content and creators
        </a>
        .
      </p>
      <form className="mb-8">
        <div className="flex justify-between flex-wrap sm:flex-no-wrap -mx-1">
          <FormText title="Email" className="flex-1 w-full mx-1 sm:w-1/2" />
          <FormText
            title="Password"
            type="password"
            className="flex-1 w-full mx-1 sm:w-1/2"
          />
        </div>
        <div>
          <ToggleButtons
            title="Top Up Account"
            options={topups}
            selected={topup}
            onChange={setTopup}
          />
        </div>
      </form>
      <button className="w-full bg-pink-lightest font-bold flex items-center justify-center tracking-wide text-pink-dark rounded-sm px-6 py-2">
        {/* <LogoWhite width={20} className="mr-3" /> */}
        <p className="flex items-baseline">
          Create Account and Give 25
          <span className="text-xl text-pink font-normal mb-1 ml-1 opacity-75">
            ¢
          </span>
        </p>
      </button>
    </div>
  )

  return (
    <div className="bg-white overflow-hidden mb-6 mt-12 rounded-t-sm rounded-b-sm shadow-lg">
      <div className="color-bar w-full h-1 bg-pink-light" />
      <div className="p-6">
        {step === 0 && (
          <Elements>
            <CardInfo />
          </Elements>
        )}

        {step === 1 && <BalanceInfo />}
      </div>
    </div>
  )
}

export default UnauthedForm