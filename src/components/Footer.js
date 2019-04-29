import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../containers/Home/LogoB.svg'

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
        
      <a href="https://www.saythanks.me/privacy" className="no-underline text-grey text-sm mx-4">Privacy</a>
        <a href="https://www.saythanks.me/terms" className="no-underline text-grey text-sm mx-4">Terms</a>
        <a href="mailto:help@saythanks.me?subject=Help Request for SayThanks" className="no-underline text-grey text-sm mx-4">Help</a>
      </div>
    </section>
  </footer>
)
export default Footer
