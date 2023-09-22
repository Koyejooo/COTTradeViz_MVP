import { gsap } from 'https://cdn.skypack.dev/gsap'

function animateTicker () {
  const tickerItems = document.querySelectorAll('.change-net-position')

  // Calculate the total width of all ticker items
  const tickerWidth = Array.from(tickerItems).reduce((totalWidth, item) => {
    return (totalWidth + item.offsetWidth) +
            (parseFloat(window.getComputedStyle(item).marginLeft))
  }, 0)

  // Set scrolling animation durarion
  const animationDuration = tickerWidth / 50

  // Apply animation to ticker container using GSAP
  gsap.to('#ticker-container', {
    x: (-tickerWidth),
    duration: animationDuration,
    ease: 'linear',
    repeat: -1,
    onUpdate: () => {
      // Check if the ticker container has scrolled completely to reset it.
      if (gsap.getProperty('#ticker-container', 'x') <= (-tickerWidth)) {
        gsap.set('#ticker-container',
          { x: 0 })
      }
    }
  })
}

document.addEventListener('load', animateTicker)
