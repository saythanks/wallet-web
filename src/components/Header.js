import React from 'react'
import { Elements } from 'react-stripe-elements'
import Nav from './Nav'
import TopUpForm from './TopUpForm'

const Header = ({
  logout,
  children,
  withCashForm = true,
  showBalance = true,
  dark = false,
} = {}) => (
  <section
    className={
      'pt-0 text-center ' +
      (!withCashForm && 'pb-6 ') +
      (dark ? ' bg-pr-4 text-white' : ' bg-white border-b border-grey-lighter')
    }
  >
    {!dark ? (
      <div className="w-full h-1 bg-pink p-0 block mb-6" />
    ) : (
      <div className="w-full mb-6" />
    )}
    <div className="container mx-auto">
      <Nav logout={logout} showBalance={showBalance} dark={dark} />
      <div className="max-w-sm mx-auto">{children}</div>
    </div>
    {withCashForm && (
      <div
        className="border bg-white mx-auto max-w-md border-grey-lighter rounded p-6"
        style={{
          transform: 'translateY(50%)',
        }}
      >
        <Elements>
          <TopUpForm />
        </Elements>
      </div>
    )}
  </section>
)
export default Header
