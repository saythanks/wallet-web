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
        <FooterLink to="/">Terms of Use</FooterLink>
        <FooterLink to="/">Privacy</FooterLink>
        <FooterLink to="/">Help</FooterLink>
        <FooterLink to="/">Contact</FooterLink>
      </div>
    </section>
  </footer>
)
export default Footer
