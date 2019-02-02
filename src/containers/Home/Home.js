import React from 'react'
import faker from 'faker'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from './Logo.svg'

let content = []
for (let i = 0; i < 5; i++) {
  content.push({
    id: faker.random.uuid(),
    source: faker.helpers.randomize([
      'NY Times',
      'Medium',
      'Washington Post',
      'The Verge',
      'TechSlug',
    ]),
    title: faker.lorem.sentence(4, 3).replace('.', ''),
    preview: faker.lorem.sentences(3),
    image: faker.image.image(),
    price: faker.helpers.randomize(['0.20', '0.25', '0.50', '0.15']),
  })
}

const Header = () => (
  <section className="py-12 text-center">
    <Logo style={{ width: 200 }} />
  </section>
)

const Nav = ({ logout }) => {
  const handleLogout = e => {
    e.preventDefault()
    logout()
  }

  const linkStyle =
    'no-underline p-2 rounded-sm text-grey-dark hover:bg-grey-lighter'
  const mainStyle = `${linkStyle} font-semibold`

  const logoutStyle = `${linkStyle} font-normal`

  return (
    <section>
      <nav className="flex justify-between align-baseline mb-12">
        <div>
          <Link to="/" className={mainStyle}>
            Home
          </Link>
          <Link to="/" className={mainStyle}>
            History
          </Link>
          <Link to="/" className={mainStyle}>
            Settings
          </Link>
        </div>
        <div>
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
    <p className="text-grey-dark uppercase tracking-wide font-bold text-sm mb-1">
      {title}
    </p>
    <div className="flex">
      <span className="text-2xl font-normal text-grey-dark mt-2 mr-1">$</span>
      <span className="text-5xl  text-grey-darkest">{amount}</span>
    </div>
  </div>
)

const Balance = () => (
  <section className="shadow-lg w-full rounded p-8 bg-white flex justify-around">
    <MoneyKV title="Current Balance" amount={13.25} />
    <MoneyKV title="Monthly Spend" amount={1.25} dim />
  </section>
)

const Item = ({ item }) => (
  <div className="flex rounded-sm mb-4 overflow-hidden">
    {/* <div
      className="w-32 bg-cover bg-center"
      style={{ backgroundImage: `url("${item.image}")` }}
    /> */}
    <div className="flex-1 p-4  pl-4">
      <p className="text-sm">
        Unlocked <span className="text-black font-bold">{item.title}</span> from{' '}
        <span className="text-grey-dark font-semibold">{item.source}</span> for{' '}
        <span className="text-grey-darkest font-bold">${item.price}</span>
      </p>
      {/* <p className="text-xs text-grey-dark font-semibold mb-1">{item.source}</p> */}
      {/* <p className="text-base text-black font-bold">{item.title}</p> */}
      {/* <p className="text-sm text-grey-darker my-1 leading-tight"> */}
      {/* {<item className="pre"></item>view} */}
      {/* </p> */}
    </div>
  </div>
)

const Purchases = () => (
  <section className="py-10">
    <h1 className="text-grey-darkest text-xl pb-2 block ">
      Recent Transactions
    </h1>
    {/* <pre>{JSON.stringify(content, null, 2, 2)}</pre> */}
    <div className="-m-y-4 bg-white rounded-sm shadow-md">
      {content.map(a => (
        <Item key={a.id} item={a} />
      ))}
    </div>
  </section>
)

const Home = ({ logout }) => (
  <div className="container mx-auto sm:px-0 px-6">
    <div className="max-w-sm mx-auto">
      <Header />
      <Nav logout={logout} />
      <Balance />
      <a
        href="#a"
        className="text-grey-darker font-bold text-sm mt-3 bg-grey-light active:bg-grey text-center block px-3 py-2 no-underline"
      >
        Add money
      </a>

      <Purchases />
    </div>
  </div>
)

export default connect(
  null,
  dispatch => ({ logout: dispatch.auth.logout })
)(Home)
