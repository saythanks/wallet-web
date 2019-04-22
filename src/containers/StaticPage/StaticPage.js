import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as Logo } from '../Home/LogoB.svg'
import { Link } from 'react-router-dom'
import AuthedForm from './AuthedForm'
import UnauthedForm from './UnauthedForm'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
import queryString from 'query-string'
import Spinner from '../../components/Spinner/Spinner'
import Nav from '../../components/Nav'
import Header from '../../components/Header'
/**
 * This page is what you see when you click a static link to donate.
 * It needs to handle the following state:
 *
 *    1. User not logged in, needs to sign up
 *    2. User not logged in, has existing account
 *    3. User is logged in, has money
 *    4. User is logged in, needs more money
 *
 * In the case of (1) and (2), we don't want to spring a signup form immediately.
 * Instead, show a miminal payment form that is nicely styled to show what
 * you are giving for, but still make it feel like $0.10.
 *
 * So you can put in that payment info, click "give" or "next" or something, and
 * then we need to convert by a) getting the user to sign up and b) getting them
 * to fill their account with at least $5. So this screen needs to be seriously
 * motivational in terms of where else they can use this money.
 *
 * For (2), we include a sign-in link below and that forwards to (3) or (4).
 *
 */

const StaticPage = ({
  authenticated,
  match,
  location,
  logout,
  balance,
  setBalance,
  token,
}) => {
  const [loading, setLoading] = useState(true)
  const [payable, setPayable] = useState(null)
  const [app, setApp] = useState(null)

  useEffect(() => {
    axios
      .get(`${config.api.baseUrl}/apps/${match.params.id}`)
      .then(res => setApp(res.data))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [match.params.id])

  useEffect(() => {
    if (!token) return
    axios.defaults.headers = { Authorization: `Bearer ${token}` }
    axios
      .get(`${config.api.baseUrl}/balance`)
      .then(res => setBalance(res.data.balance))
      .catch(err => toast.error(err.messag))
      .finally(() => setLoading(false))
  }, [token])

  const { price, name, url } = queryString.parse(location.search)

  const contentSpecific = name && url

  // if (loading) return <div>Loading...</div>
  if (!loading && !app) return <div>Not found</div>

  return (
    <div className="">
      <Header withCashForm={false} logout={logout} balance={balance} />
      <div className="container mx-auto min-h-full pt-16 pb-12">
        <div className="max-w-sm mx-auto mb-12 h-full flex-1">
          <div className="w-full text-center z-0 opacity-50">
            <Logo
              width={70}
              className="inline-block"
              style={{ marginBottom: -5 }}
            />
          </div>
          <div className="wrap px-6 bg-white shadow-md rounded border border-grey-200 ">
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center pr-4">
                <Spinner />
              </div>
            ) : (
              <div>
                <div className="flex justify-center w-full mb-6">
                  <Link
                    to="/"
                    className="text-pink font-black inline-block mb-0"
                  />
                </div>
                <section>
                  <p className="uppercase text-xl font-bold tracking-wide text-grey-dark mb-6 text-center">
                    Say thanks <span className="text-grey">to</span>
                  </p>

                  <div className="flex justify-center items-start w-full ">
                    <div className="flex-0 mr-6 ml-2">
                      <img
                        src={app.image_url}
                        className="rounded-full block w-16 shadow-inner"
                        alt="Author"
                      />
                    </div>
                    <div className="flex-0 self-center ">
                      <div className="leading-normal text-left">
                        <p className="text-2xl text-black  ">
                          <span className="text-3xl my-2 font-bold">
                            {app.name}
                          </span>{' '}
                        </p>
                        {!contentSpecific && (
                          <p className="text-grey text-lg">{app.description}</p>
                        )}
                        {contentSpecific && (
                          <div>
                            <p className="uppercase tracking-wide text-grey-light text-sm font-bold inline mr-1">
                              For
                            </p>
                            <a
                              href={url}
                              className=" text-pink no-underline border-b-2 border-pink-lighter"
                            >
                              {name}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <div className="">
                  <div>
                    {authenticated ? (
                      <AuthedForm payable={payable} app={app} price={price} />
                    ) : (
                      <UnauthedForm payable={payable} app={app} price={price} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    authenticated: state.auth.authenticated,
    balance: state.auth.balance,
    token: state.auth.user && state.auth.user.idToken,
  }),
  dispatch => ({
    logout: dispatch.auth.logout,
    setBalance: dispatch.auth.SET_BALANCE,
  })
)(StaticPage)
