import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as Logo } from '../Home/LogoB.svg'
import { Link } from 'react-router-dom'
import AuthedForm from './AuthedForm'
import UnauthedForm from './UnauthedForm'
import axios from 'axios'
import config from '../../config'
import { toast } from 'react-toastify'
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

const StaticPage = ({ authenticated, match }) => {
  const [loading, setLoading] = useState(false)
  const [payable, setPayable] = useState(null)

  useEffect(() => {
    axios
      .get(`${config.api.baseUrl}/payables/${match.params.id}`)
      .then(res => setPayable(res.data))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [match.params.id])

  if (loading) return <div>Loading...</div>
  if (!payable) return <div>Not found</div>

  return (
    <div className="container mx-auto ">
      <div className="max-w-sm mx-auto mb-12">
        <div className="wrap px-6">
          <div className="flex justify-center w-full mb-6">
            <Link
              to="/"
              className="text-pink font-black inline-block mt-8 mb-0"
            >
              <Logo width={30} className="inline-block mr-4" />
            </Link>
          </div>
          <section>
            <p className="uppercase text-xl font-bold tracking-wide text-grey-dark mb-6 text-center">
              Say thanks <span className="text-grey">to</span>
            </p>

            <div className="flex justify-between">
              {/* <div className="flex-0 mr-6 ml-2">
                <img
                  src="https://dxj7eshgz03ln.cloudfront.net/production/category/header_icon/14/9382dce1-b0f9-49e2-bf1c-cfaede9c74c3.png"
                  className="rounded-full w-16 shadow-inner"
                  alt="Author"
                />
              </div> */}
              <div className="flex-1 self-center text-center">
                <div className="text-3xl leading-normal text-center">
                  <p>
                    <span className="text-3xl my-2 font-bold">
                      {payable.app.name}
                    </span>{' '}
                    for{' '}
                  </p>
                  <a
                    href="#link"
                    className="text-3xl text-pink no-underline border-b-2 border-pink-lighter"
                  >
                    {payable.display_name}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="pb-12">
          <div>
            {authenticated ? (
              <AuthedForm payable={payable} />
            ) : (
              <UnauthedForm payable={payable} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(state => ({ authenticated: state.auth.authenticated }))(
  StaticPage
)
