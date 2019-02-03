import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../containers/Home/LogoB.svg'

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

export default Nav
