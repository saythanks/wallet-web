import React, { useState, useEffect, Fragment } from 'react'
import faker from 'faker'
import { connect } from 'react-redux'
import moment from 'moment'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import config from '../../config'
import Spinner from '../../components/Spinner/Spinner'
import { Link } from 'react-router-dom'
import { formatCents } from '../../util/currency'

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

const Balance = ({ token, balance }) => {
  const [loading, setLoading] = useState(true)
  const [balances, setBalances] = useState()

  const twoDecimals = num => parseFloat(Math.round(num * 100) / 100).toFixed(2)
  useEffect(() => {
    if (!token) return
    axios.defaults.headers = { Authorization: `Bearer ${token}` }
    axios
      .get(`${config.api.baseUrl}/balance`)
      .then(res => setBalances(res.data))
      .catch(err => toast.error(err.messag))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <section className="w-full rounded pt-8 pb-4 flex justify-around">
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : (
        <Fragment>
          <MoneyKV
            title="Current Balance"
            amount={twoDecimals((balances && balances.balance / 100) || 0)}
          />
          {/* <MoneyKV
            title="Monthly Spend"
            amount={twoDecimals((balances && balances.monthly_spend) || 0)}
            dim
          /> */}
        </Fragment>
      )}
    </section>
  )
}

const Item = ({ item }) => (
  <div className="flex rounded-sm mb-4 relative">
    <div
      className="absolute border-2 border-pink-lightest bg-pink rounded-full pin-t pin-l"
      style={{ width: '10px', height: '10px', transform: 'translateX(-30%)' }}
    />
    <div className="flex-1  pl-4">
      <p className="text-grey mb-4 text-xs font-bold uppercase tracking-wide">
        {moment(new Date(item.time_created)).fromNow()}
      </p>
      <p className="mb-8 text-grey-darkest leading-loose text-xl">
        Gave <span className="font-bold">{formatCents(item.amount)}</span> to{' '}
        <Link
          to={`/to/${item.app.id}`}
          className="no-underline font-pink border-b-2 border-pink-lighter text-pink-dark"
        >
          {item.app.name}
        </Link>
      </p>
    </div>
  </div>
)

const Purchases = ({ loading, transactions, setPage, page }) => (
  <section className=" max-w-sm mx-auto mt-24 mb-24">
    {loading ? (
      <Spinner />
    ) : !transactions ? (
      <div>Could not load transactions</div>
    ) : (
      <>
        <div className="relative">
          <div className="timeline absolute pin-l w-1 h-full bg-grey-light rounded-sm" />
          <div className="">
            {transactions.items.map(a => (
              <Item key={a.id} item={a} />
            ))}
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            className="font-semibold mr-2 text-grey-dark border-b border-grey-light focus:outline-none hover:text-grey-darker"
          >
            Prev
          </button>
          <button
            onClick={() => {
              if (transactions.has_next) setPage(page + 1)
            }}
            className="font-semibold text-grey-dark border-b border-grey-light focus:outline-none hover:text-grey-darker"
          >
            Next
          </button>
        </div>
      </>
    )}
  </section>
)

const Home = ({ logout, token, balance }) => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    axios.defaults.headers = { Authorization: `Bearer ${token}` }
    axios
      .get(`${config.api.baseUrl}/transactions/from?page=${page}`)
      .then(res => setTransactions(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [token, page])

  return (
    <div className="font-sans">
      <div className="">
        <Header logout={logout}>
          <Balance token={token} balance={balance} />
        </Header>

        <Purchases
          loading={loading}
          transactions={transactions}
          setPage={setPage}
          page={page}
        />
        <Footer />
      </div>
    </div>
  )
}

export default connect(
  state => ({
    token: state.auth.user.idToken,
    balance: state.user.balance,
  }),
  dispatch => ({ logout: dispatch.auth.logout })
)(Home)
