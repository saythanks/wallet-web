import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../img/logo_light.svg'
import { ReactComponent as LogoB } from '../containers/Home/LogoB.svg'
import { formatCents } from '../util/currency'
import { connect } from 'react-redux'

const Nav = ({
  logout,
  balance,
  showBalance = true,
  authenticated,
  dark = false,
}) => {
  const handleLogout = e => {
    e.preventDefault()
    logout()
  }

  const linkStyle =
    'no-underline p-2 rounded-sm ' +
    (dark
      ? 'text-pn-1 hover:bg-pr-5'
      : 'text-grey-dark hover:bg-grey-lightest ')

  const mainStyle = `${linkStyle} font-semibold`

  const logoutStyle = `${linkStyle} font-normal`

  return (
    <section>
      <nav className="flex justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className={`${linkStyle} text-pn-1 font-black flex items-center`}
          >
            {dark ? (
              <Logo width={30} className="inline-block mr-4" />
            ) : (
              <LogoB width={30} className="inline-block mr-4" />
            )}{' '}
            SayThanks
          </Link>
        </div>
        <div className="flex items-center ">
          {authenticated ? (
            <>
              {showBalance && (
                <Link
                  to="/"
                  className={
                    'no-underline px-3 py-2 rounded  block mr-4 ' +
                    (dark
                      ? 'shadow-inner bg-pr-5 text-pn-1 '
                      : 'shadow border bg-grey-lightest hover:shadow-lg  text-black')
                  }
                >
                  <span className="font-medium">{formatCents(balance)}</span>{' '}
                  balance
                </Link>
              )}
              <Link to="/settings" className={mainStyle}>
                Settings
              </Link>
              <a href="#logout" className={logoutStyle} onClick={handleLogout}>
                Sign out
              </a>
            </>
          ) : (
            <>
              <Link to="/auth/login" className={logoutStyle}>
                Log in
              </Link>
            </>
          )}
        </div>
      </nav>
    </section>
  )
}

export default connect(state => ({
  authenticated: state.auth.authenticated,
  balance: state.auth.balance,
}))(Nav)
