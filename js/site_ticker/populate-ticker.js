import { getChangeNetPosition, marketCodes } from './get-change-net-position.js'
const currencyNames = {
  '06765A': 'OIL',
  '084691': 'XAG',
  '088691': 'XAU',
  '090741': 'CAD',
  '092741': 'CHF',
  '095741': 'MXN',
  '096742': 'GBP',
  '097741': 'JPY',
  '098662': 'DXY',
  '099741': 'EUR',
  112741: 'NZD',
  122741: 'ZAR',
  232741: 'AUD'
}

async function populateTicker () {
  const changesInNetPosition = await getChangeNetPosition()
  // Create the parent <div> for site ticker
  const parentDiv = document.createElement('div')
  parentDiv.id = 'ticker-container'
  parentDiv.className = 'd-flex flex-row sticky-top justify-content-between'

  // Create the child <div> for site ticker
  const childDiv = document.createElement('div')
  childDiv.className = 'ticker col'

  // Add the span elements containing the data, to the child <div>
  if (changesInNetPosition) {
    changesInNetPosition.forEach((changeNetPosition, index) => {
      const currencyName = currencyNames[marketCodes[index]]

      const span = document.createElement('div')
      span.className = 'change-net-position mt-2 mb-1'
      if (changeNetPosition === 0) {
        span.style.color = '#575E61'
        span.innerHTML = `${currencyName} &#8211;${changeNetPosition} Contracts`
      } else if (changeNetPosition < 0) {
        span.style.color = '#D92B2B'
        span.innerHTML = `${currencyName} &#9660;${changeNetPosition} Contracts`
      } else {
        span.style.color = '#03A60E'
        span.innerHTML = `${currencyName} &#9650;${changeNetPosition} Contracts`
      }
      childDiv.append(span)
    })
  }

  // Clone childDiv to attach to its end for ticker scrolling
  const clonedChildDiv = childDiv.cloneNode(true)

  // Append the childDiv & clonedChildDiv (ticker items) to the ticker <div>
  parentDiv.append(childDiv, clonedChildDiv)

  // Add ticker div to body of HTML
  const firstChild = document.querySelector('nav')
  const parentElement = firstChild.parentNode
  parentElement.insertBefore(parentDiv, firstChild.nextSibling)
}

populateTicker()
