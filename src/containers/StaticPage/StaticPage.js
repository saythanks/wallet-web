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
import Avatar from 'react-avatar'
import { hostname } from '../../util/url'
import Footer from '../../components/Footer'
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
  const [shouldHideInfo, setShouldHideInfo] = useState(false)

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
    <div className="bg-pr-4 h-full flex-1 font-system antialiased">
      <Header withCashForm={false} logout={logout} balance={balance} dark />
      <div className="container mx-auto min-h-full pt-16 pb-12">
        <div className="max-w-xs mx-auto mb-12 h-full flex-1">
          <div className="wrap bg-white shadow-md rounded-sm ">
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center pr-4">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-start text-center">
                <div className="px-6">
                  <div
                    className="rounded-full border-white inline-block mx-auto"
                    style={{
                      transform: 'translateY(-50%)',
                      borderWidth: '3px',
                    }}
                  >
                    <div>
                      <Avatar
                        src={app.image_url}
                        name={app.name}
                        round
                        size={100}
                      />
                    </div>
                  </div>
                  <section className="-mt-6">
                    <p className="text-gr-5 text-xl font-bold mb-1">
                      {app.name}
                    </p>
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline text-gr-3 text-sm font-semibold mb-4 block"
                    >
                      {hostname(app.url)}
                    </a>
                    {!shouldHideInfo && (
                      <>
                        <p className="text-gr-3 text-sm leading-normal">
                          {app.description}
                        </p>

                        <div className="leading-normal">
                          {contentSpecific && (
                            <div className="mt-10 mb-4">
                              <p className="uppercase tracking-wide text-gr-4 text-xs  font-bold block mr-1">
                                Say Thanks For
                              </p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gr-5 mt-1 bg-gr-0 py-1 px-2 w-full block text-left text-sm no-underline rounded-sm border border-gr-1"
                              >
                                <div className="mb-px font-medium">{name}</div>
                                <span className="text-xs text-gr-3 -mt-1 block">
                                  {hostname(url)}
                                </span>
                              </a>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </section>
                </div>
                <div className="w-full rounded-b-sm overflow-hidden">
                  <div>
                    {authenticated ? (
                      <AuthedForm payable={payable} app={app} price={price} />
                    ) : (
                      <UnauthedForm
                        payable={payable}
                        app={app}
                        price={price}
                        setShouldHideInfo={setShouldHideInfo}
                      />
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
