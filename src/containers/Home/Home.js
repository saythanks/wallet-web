import React, { useState, Fragment } from 'react'
import faker from 'faker'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from './LogoB.svg'
import moment from 'moment'
import { CardElement, Elements, injectStripe } from 'react-stripe-elements'
import { toast } from 'react-toastify'
import Header from '../../components/Header'

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
  <section className=" max-w-sm mx-auto mt-24 mb-24">
    <div className=" relative">
      <div className="timeline absolute pin-l w-1 h-full bg-grey-light rounded-sm" />
      <div className="">
        {content.map(a => (
          <Item key={a.id} item={a} />
        ))}
      </div>
    </div>
    <div className="text-center">
      <button className="font-semibold text-grey-dark border-b border-grey-light focus:outline-none hover:text-grey-darker">
        See all
      </button>
    </div>
  </section>
)

const FooterLink = ({ to, children }) => (
  <Link className="no-underline text-grey text-sm mx-4" to={to}>
    {children}
  </Link>
)

const Footer = () => (
  <footer>
    <section className="container mx-auto py-10 sm:px-0 px-6 flex flex-col items-center justify-center">
      <Link
        to="/"
        className="block no-underline text-pink font-black flex items-center mb-4"
      >
        <Logo width={30} className="inline-block mr-4" /> SayThanks
      </Link>
      <div>
        <FooterLink to="/">Terms of Use</FooterLink>
        <FooterLink to="/">Privacy</FooterLink>
        <FooterLink to="/">Help</FooterLink>
        <FooterLink to="/">Contact</FooterLink>
      </div>
    </section>
  </footer>
)

const Home = ({ logout }) => (
  <div className="font-sans">
    <div className="">
      <Header logout={logout}>
        <Balance />
      </Header>

      <Purchases />
      <Footer />
    </div>
  </div>
)

export default connect(
  null,
  dispatch => ({ logout: dispatch.auth.logout })
)(Home)
