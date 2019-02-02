import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { connect } from 'react-redux'

function PopupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  var dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight

  var systemZoom = width / window.screen.availWidth
  var left = (width - w) / 2 / systemZoom + dualScreenLeft
  var top = (height - h) / 2 / systemZoom + dualScreenTop
  var newWindow = window.open(
    url,
    title,
    'scrollbars=yes, width=' +
      w / systemZoom +
      ', height=' +
      h / systemZoom +
      ', top=' +
      top +
      ', left=' +
      left +
      ', toolbar=no,titlebar=no'
  )

  // Puts focus on the newWindow
  if (window.focus) newWindow.focus()
}

const Embed = ({ location, authenticated }) => {
  const { payableId } = queryString.parse(location.search)

  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState()

  useEffect(() => {
    // Load data
  })

  const handleClick = () => {
    // Check if authenticated
    if (!authenticated) {
      // Show login screen in popup
      const width = 250
      const height = 400
      const top = window.height / 2 - height / 2
      const left = window.width / 2 - width / 2

      var path = location.protocol + '//' + location.host + '/login' // (or whatever)
      PopupCenter(path, 'Micro Auth', 350, 500)
    }

    // Now create transaction if needed
  }

  return (
    <div className="w-screen h-screen">
      <button
        className="p-6 bg-blue-dark text-blue-lightest box-shadow w-full h-full"
        onClick={handleClick}
      >
        Pay $0.20 to unlock
      </button>
    </div>
  )
}
const mapState = state => ({ authenticated: state.auth.authenticated })

export default withRouter(connect(mapState)(Embed))
