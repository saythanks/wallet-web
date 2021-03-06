import React, { useState, useEffect } from 'react'
import mojs from 'mo-js'
import useDebounce from 'react-use/lib/useDebounce'
import { ReactComponent as Logo } from '../../img/logo_light.svg'
import './TipButton.css'
import { Link } from 'react-router-dom'
import Spinner from '../Spinner/Spinner'

const TipButton = ({
  price = 50,
  onPay,
  baseline = 0,
  onIndividualClick = () => null,
  disabled,
  openTopUpForm = () => null,
}) => {
  const [count, setCount] = useState(0)
  const [delta, setDelta] = useState(0)
  const [isClicked, setIsClicked] = useState(false)
  const [loading, setLoading] = useState(null)

  const totalCount = count + baseline

  // useDebounce(
  //   () => {
  //     const dCount = count - delta
  //     const amount = dCount * price
  //     if (amount > 0) {
  //       onPay(price, dCount).then(({ success, data, failedCount }) => {
  //         if (!success || failedCount >= 0) {
  //           setCount(count - failedCount)
  //           setDelta(count - failedCount)
  //         }
  //       })
  //       console.log(`Processing payment for ${(count - delta) * price}`)
  //       console.log(`Total paid is ${totalCount * price}`)
  //       setDelta(count)
  //     }
  //   },
  //   1000,
  //   [count]
  // )

  // useEffect(() => {
  //   if (disabled) return
  //   const tlDuration = 300
  //   const triangleBurst = new mojs.Burst({
  //     parent: '#clap',
  //     radius: { 50: 95 },
  //     count: 5,
  //     angle: 30,
  //     children: {
  //       shape: 'polygon',
  //       radius: { 6: 0 },
  //       scale: 1,
  //       stroke: 'rgba(211,84,0 ,0.5)',
  //       strokeWidth: 2,
  //       angle: 210,
  //       delay: 30,
  //       speed: 0.2,
  //       easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
  //       duration: tlDuration,
  //     },
  //   })
  //   const circleBurst = new mojs.Burst({
  //     parent: '#clap',
  //     radius: { 50: 75 },
  //     angle: 25,
  //     duration: tlDuration,
  //     children: {
  //       shape: 'circle',
  //       fill: 'rgba(149,165,166 ,0.5)',
  //       delay: 30,
  //       speed: 0.2,
  //       radius: { 3: 0 },
  //       easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
  //     },
  //   })
  //   const countAnimation = new mojs.Html({
  //     el: '#clap--count',
  //     isShowStart: false,
  //     isShowEnd: true,
  //     y: { 0: -30 },
  //     opacity: { 0: 1 },
  //     duration: tlDuration,
  //   }).then({
  //     opacity: { 1: 0 },
  //     y: -80,
  //     delay: tlDuration / 2,
  //   })
  //   const countTotalAnimation = new mojs.Html({
  //     el: '#clap--count-total',
  //     isShowStart: false,
  //     isShowEnd: true,
  //     opacity: { 0: 1 },
  //     delay: (3 * tlDuration) / 2,
  //     duration: tlDuration,
  //     y: { 0: -3 },
  //   })
  //   const scaleButton = new mojs.Html({
  //     el: '#clap',
  //     duration: tlDuration,
  //     scale: { 1.3: 1 },
  //     easing: mojs.easing.out,
  //   })
  //   const clap = document.getElementById('clap')
  //   clap.style.transform = 'scale(1, 1)'

  //   // setTimeline(
  //   //   new mojs.Timeline().add([
  //   //     countAnimation,
  //   //     countTotalAnimation,
  //   //     scaleButton,
  //   //     circleBurst,
  //   //     triangleBurst,
  //   //   ])
  //   // )
  // }, [])

  const clicksToCents = n => n * price
  const formatCents = (c, to = 2) =>
    c < 100 ? `${c}¢` : `$${(c / 100).toFixed(to)}`

  const messages = ['How about another?', 'One more time?']

  const randomMessage = () => {
    // const showMessage = count === 1 || count % 5 === 0
    // if (count === 0 || !showMessage)
    return `Say Thanks for ${formatCents(price)}`

    // return messages[0]
  }

  const handleClick = () => {
    // timeline.replay()
    if (disabled || loading) return
    setLoading(true)
    onPay(price, 1)
      .catch(console.error)
      .finally(() => setLoading(false))
    onIndividualClick(price)
    setCount(count + 1)
    setIsClicked(true)
  }

  if (disabled)
    return (
      <button
        className="flex-items-center bg-pn-4 text-pn-1 font-bold block px-2 py-3 w-full text-lg focus:outline-none no-underline block"
        onClick={openTopUpForm}
      >
        Add Funds to Account
      </button>
    )

  return (
    <button
      className="flex-items-center bg-pn-4 text-pn-1 font-bold block px-2 py-3 w-full text-lg focus:outline-none"
      style={{ touchAction: 'manipulation' }}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <span className="text-pn-5">Say Thanks with</span>{' '}
          {formatCents(price)}
        </>
      )}
    </button>
  )
}

export default TipButton
