import React from 'react'
import Header from '../../components/Header'
import Button from '../../components/Button'

const FormGroup = ({ children, title = '' } = {}) => (
  <label className="mb-6 block w-full">
    <div className="text-base font-bold text-grey-darkest mb-2">{title}</div>
    {children}
  </label>
)

const FormDisabledText = ({ children, title = '' } = {}) => (
  <FormGroup title={title}>
    <span className="text-lg text-grey-darkest">{children}</span>
  </FormGroup>
)

const FormText = ({ title = '' } = {}) => (
  <FormGroup title={title}>
    <input
      type="text"
      className="px-3 py-2 block w-full text-lg focus:outline-none border-2 border-grey-lightest focus:border-pink-lightest"
    />
  </FormGroup>
)

const Section = ({ title, children, subtitle }) => (
  <section className="my-6 mb-12 flex flex-col sm:flex-row">
    <div className="flex-1 pr-6" style={{ maxWidth: '250px' }}>
      <h2 className="uppercase tracking-wide text-base text-grey-darkest">
        {title}
      </h2>
      {subtitle && (
        <p className="my-3 text-grey-darker leading-normal">{subtitle}</p>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </section>
)

const Settings = () => {
  return (
    <div>
      <Header withCashForm={false} />
      <div className="container mx-auto">
        <div className="max-w-lg mx-auto py-12 px-6">
          <h1 className="text-black">Settings</h1>

          <Section title="Profile">
            <FormDisabledText title="Email">
              newman.oscar@gmail.com
            </FormDisabledText>
            <FormText title="Name" />
            <Button>Update Profile</Button>
          </Section>

          <Section title="Billing">
            <FormText title="Card" />

            <Button>Save Billing Info</Button>
          </Section>

          <Section
            title="Authorized Apps"
            subtitle="These apps you've approved allow one-click payments in the background"
          >
            <FormText title="Name" />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default Settings
