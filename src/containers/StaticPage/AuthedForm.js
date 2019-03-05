import React from 'react'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import { connect } from 'react-redux'

const AuthedForm = () => {
  return (
    <div className="mt-12">
      <section className="flex justify-center">
        <button
          className="flex items-center justify-center px-8 py-1 uppercase tracking-wide
                     bg-pink-dark text-white rounded-sm font-bold 
                     active:bg-pink active:text-pink-lightest"
        >
          <Logo width={20} className="mr-2" /> Say thanks for a dime
        </button>
      </section>
    </div>
  )
}

export default AuthedForm
