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
    axios.get(`${config.api.baseUrl}/balance`).finally(() => setLoading(false))
  }, [token])

  return (
    <section className="w-full rounded pt-8 pb-4 flex justify-around">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <MoneyKV
            title="Current Balance"
            amount={twoDecimals(balance / 100 || 0)}
          />
        </Fragment>
      )}
    </section>
  )
}

const Item = ({ item }) => (
  <div className="flex rounded-sm mb-0 relative">
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
  <section className=" max-w-xs mx-auto mt-24 mb-24">
    <h1 className="text-2xl text-grey-darkest mb-8">My Tips</h1>
    {loading ? (
      <Spinner />
    ) : !transactions ? (
      <div>Could not load transactions</div>
    ) : transactions.items.length === 0 ? (
      <>
        <p className="text-black text-lg leading-normal">
          You haven't given to any creators yet! Click the{' '}
          <strong>SayThanks</strong> button on any website that has it and give
          to see your tips show up here.
        </p>
      </>
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
          {transactions.has_prev && (
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              className="font-semibold mr-2 text-grey-dark border-b border-grey-light focus:outline-none hover:text-grey-darker"
            >
              Prev
            </button>
          )}

          {transactions.has_next && (
            <button
              onClick={() => {
                if (transactions.has_next) setPage(page + 1)
              }}
              className="font-semibold text-grey-dark border-b border-grey-light focus:outline-none hover:text-grey-darker"
            >
              Next
            </button>
          )}
        </div>
      </>
    )}
  </section>
)

const Home = ({ logout, token, balance, setBalance, loadInfo }) => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [transactions, setTransactions] = useState(null)
  const [balances, setBalances] = useState()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    loadInfo()

    axios.defaults.headers = { Authorization: `Bearer ${token}` }
    const promises = []
    promises.push(
      axios
        .get(`${config.api.baseUrl}/transactions/from?page=${page}`)
        .then(res => setTransactions(res.data))
        .catch(err => toast.error(err.message))
    )

    promises.push(
      axios
        .get(`${config.api.baseUrl}/balance`)
        .then(res => {
          setBalances(res.data)
          setBalance(res.data.balance)
        })
        .catch(err => toast.error(err.messag))
    )
    Promise.all(promises).finally(() => setLoading(false))
  }, [token, page])

  return (
    <div className="font-sans">
      <div className="">
        <Header withCashForm={true} logout={logout} showBalance={false}>
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
    balance: state.auth.balance,
  }),
  dispatch => ({
    logout: dispatch.auth.logout,
    setBalance: dispatch.auth.SET_BALANCE,
    loadInfo: dispatch.user.loadInfo,
  })
)(Home)
