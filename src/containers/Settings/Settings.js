import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import { connect } from 'react-redux'
import Spinner from '../../components/Spinner/Spinner'
import { CardElement, Elements, injectStripe } from 'react-stripe-elements'
import { Input, textInputStyle } from '../../components/Form'

const FormGroup = ({ children, title = '' } = {}) => (
  <label className="mb-6 block w-full">
    <div className="text-base font-bold text-grey-darkest mb-2">{title}</div>
    {children}
  </label>
)

const FormDisabledText = ({ children, title = '' } = {}) => (
  <FormGroup title={title}>
    <span className="text-lg text-grey-darkest">{children}</span>
  </FormGroup>
)

const FormText = ({ title = '' } = {}) => (
  <FormGroup title={title}>
    <input
      type="text"
      className="px-3 py-2 block w-full text-lg focus:outline-none border-2 border-grey-lightest focus:border-pink-lightest"
    />
  </FormGroup>
)

const Section = ({ title, children, subtitle }) => (
  <section className="my-6 mb-12 flex flex-col sm:flex-row">
    <div className="flex-1 pr-6" style={{ maxWidth: '250px' }}>
      <h2 className="uppercase tracking-wide text-base text-grey-darkest">
        {title}
      </h2>
      {subtitle && (
        <p className="my-3 text-grey-darker leading-normal">{subtitle}</p>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </section>
)

const CardForm = injectStripe(({ stripe, updateUser, user, done }) => {
  const [cardError, setCardError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user.name)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    stripe.createToken().then(({ token, error }) => {
      if (error) setCardError(error.message)
      else updateUser({ cardToken: token.id, name }).then(() => done())
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input title="Name" value={name} onChange={setName} />
        <FormGroup title="Card">
          <div className={textInputStyle() + ' bg-white'}>
            <CardElement
              className="flex-1 text-lg p-3"
              onChange={({ error }) => {
                if (error) setCardError(error.message)
                else setCardError(null)
              }}
            />
          </div>
          {cardError && <p className="text-red text-sm">{cardError}</p>}
        </FormGroup>
        <div className="flex">
          <Button className="inline-block" disabled={!name}>
            {loading ? <Spinner /> : 'Save New Card'}
          </Button>
          <button
            type="button"
            className="text-grey font-bold inline-block ml-2"
            onClick={done}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
})

const Settings = ({ user, loadInfo, logout, updateStripe }) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadInfo().finally(() => setLoading(false))
  }, [])

  const [editing, setEditing] = useState(false)

  if (loading)
    return (
      <div>
        <Header withCashForm={false} />
        <div className="container mx-auto">
          <div className="max-w-lg mx-auto py-12 px-6">
            <h1 className="text-black">Settings</h1>

            <Spinner />
          </div>
        </div>
        <Footer />
      </div>
    )
  return (
    <div>
      <Header withCashForm={false} logout={logout} />
      <div className="container mx-auto">
        <div className="max-w-lg mx-auto py-12 px-6">
          <h1 className="text-black">Settings</h1>

          <Section title="Profile">
            <FormDisabledText title="Email">{user.email}</FormDisabledText>
          </Section>

          <Section title="Billing">
            {user.stripe_id && !editing && (
              <div title="Saved Card" onClick={() => null}>
                <div className="text-base font-bold text-grey-darkest mb-2">
                  Saved Card
                </div>
                <p>
                  <strong>{user.card_brand}</strong>{' '}
                  <span className="ml-2">•••• {user.last_4}</span>{' '}
                  <button
                    className="ml-4 text-teal-dark"
                    onClick={() => setEditing(true)}
                  >
                    <i className="fas fa-edit mr-2 opacity-50" />
                    Edit
                  </button>
                </p>
              </div>
            )}

            {editing && (
              <div>
                <Elements>
                  <CardForm
                    user={user}
                    updateUser={updateStripe}
                    done={() => setEditing(false)}
                  />
                </Elements>
              </div>
            )}
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default connect(
  state => ({
    token: state.auth.user.idToken,
    user: state.user.me,
  }),
  dispatch => ({
    loadInfo: dispatch.user.loadInfo,
    logout: dispatch.auth.logout,
    updateStripe: dispatch.user.updateStripe,
  })
)(Settings)
