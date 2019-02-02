import React, { useState, Fragment } from 'react'
import faker from 'faker'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from './LogoB.svg'
import moment from 'moment'
import { CardElement, Elements, injectStripe } from 'react-stripe-elements'

let content = []
for (let i = 0; i < 5; i++) {
  content.push({
    id: faker.random.uuid(),
    source: faker.helpers.randomize([
      'The New York Times',
      'Medium',
      'The Washington Post',
      'The Verge',
      'TechSlug',
    ]),
    date: faker.date.past(0.01),
    title: faker.lorem.sentence(4, 3).replace('.', ''),
    preview: faker.lorem.sentences(3),
    image: faker.image.image(),
    price: faker.helpers.randomize(['0.20', '0.25', '0.50', '0.15']),
  })
}

const TopUpForm = injectStripe((props, context) => {
  const options = [5, 10, 15, 20]
  const [selected, setSelected] = useState(0)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (step !== 1) return

    setLoading(true)

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    props.stripe.createToken().then(({ token }) => {
      console.log('Received Stripe token:', token)
    })

    setTimeout(() => setLoading(false), 1500)

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
        <div className="text-left text-sm uppercase text-grey-dark tracking-wide font-bold">
          <button
            type="button"
            className="text-grey-darker mb-2 focus:outline-none"
            onClick={() => setStep(0)}
          >
            <i className="fas fa-arrow-left text-grey-light mr-1" /> Back
          </button>
          <div className="flex items-center justify-between">
            <CardElement className="flex-1" />
            <button
              type="submit"
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
        </div>
      )}
    </form>
  )
})

const Header = ({ logout, children }) => (
  <section className="pt-0 text-center bg-white border-b border-grey-lighter">
    <div className="w-full h-1 bg-pink p-0 block mb-6" />
    <div className="container mx-auto">
      <Nav logout={logout} />
      <div className="max-w-sm mx-auto">{children}</div>
    </div>
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
  </section>
)

const Nav = ({ logout }) => {
  const handleLogout = e => {
    e.preventDefault()
    logout()
  }

  const linkStyle =
    'no-underline p-2 rounded-sm text-grey-dark hover:bg-grey-lightest'
  const mainStyle = `${linkStyle} font-semibold`

  const logoutStyle = `${linkStyle} font-normal`

  return (
    <section>
      <nav className="flex justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className={`${linkStyle} text-pink font-black flex items-center hover:bg-white`}
          >
            <Logo width={30} className="inline-block mr-4" /> SayThanks
          </Link>
          {/* <Link to="/" className={mainStyle}>
            Home
          </Link>
          <Link to="/" className={mainStyle}>
            History
          </Link>
          <Link to="/" className={mainStyle}>
            Settings
          </Link> */}
        </div>
        <div className="flex items-center ">
          <Link to="/" className={mainStyle}>
            Settings
          </Link>
          <a href="#logout" className={logoutStyle} onClick={handleLogout}>
            Sign out
          </a>
        </div>
      </nav>
    </section>
  )
}

const MoneyKV = ({ title, amount, dim = false } = {}) => (
  <div className={'flex flex-col items-center ' + (dim && 'opacity-75')}>
    <div className="flex">
      <span
        className={`text-2xl font-bold text-grey-dark mt-2 mr-1 ${!dim &&
          'text-pink-light'}`}
      >
        $
      </span>
      <span
        className={`text-5xl font-bold text-grey-darkest ${!dim &&
          'text-pink'}`}
      >
        {amount}
      </span>
    </div>
    <p className="text-grey-dark uppercase tracking-wide font-bold text-sm mb-1">
      {title}
    </p>
  </div>
)

const Balance = () => (
  <section className="w-full rounded pt-8 pb-4 flex justify-around">
    <MoneyKV title="Current Balance" amount={13.25} />
    <MoneyKV title="Monthly Spend" amount={1.25} dim />
  </section>
)

const Item = ({ item }) => (
  <div className="flex rounded-sm mb-4 relative">
    <div
      className="absolute border-2 border-pink-lightest bg-pink rounded-full pin-t pin-l"
      style={{ width: '10px', height: '10px', transform: 'translateX(-30%)' }}
    />
    {/* <div
      className="w-32 bg-cover bg-center"
      style={{ backgroundImage: `url("${item.image}")` }}
    /> */}
    <div className="flex-1  pl-4">
      <p className="text-grey mb-4 text-xs font-bold uppercase tracking-wide">
        {moment(item.date).fromNow()}
      </p>
      <p className="mb-8 text-grey-darkest leading-loose text-xl">
        Bought{' '}
        <a
          href="#permalink"
          className="no-underline font-pink border-b-2 border-pink-lighter text-pink-dark"
        >
          {item.title}
        </a>{' '}
        from <span className="font-semibold">{item.source}</span> for{' '}
        <span className="font-bold">${item.price}</span>
      </p>
    </div>
  </div>
)

const Purchases = () => (
  <section className=" max-w-sm mx-auto relative mt-24 mb-10">
    <div className="timeline absolute pin-l w-1 h-full bg-grey-light rounded-sm" />
    {/* <pre>{JSON.stringify(content, null, 2, 2)}</pre> */}
    <div className="">
      {content.map(a => (
        <Item key={a.id} item={a} />
      ))}
    </div>
  </section>
)

const Home = ({ logout }) => (
  <div className="font-sans">
    <div className="">
      <Header logout={logout}>
        <Balance />
      </Header>

      <Purchases />
    </div>
  </div>
)

export default connect(
  null,
  dispatch => ({ logout: dispatch.auth.logout })
)(Home)
