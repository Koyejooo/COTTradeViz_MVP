const cotURL = 'https://publicreporting.cftc.gov/resource/jun7-fc8e.json'
const headers = { 'X-App-Token': 'OvQJx8soXa21Iwes5jdJMFmVh' }
export const marketCodes = ['06765A', '084691', '088691', '090741', '092741',
  '095741', '096742', '097741', '098662', '099741', '112741', '122741', '232741']

export async function getChangeNetPosition () {
  // Calculate the current week of the year
  const dateToday = new Date()
  const dayOfWeek = dateToday.getDay()
  let year = dateToday.getFullYear()
  const firstDay = new Date(dateToday.getFullYear(), 0, 1)
  const days = Math.floor((dateToday - firstDay) / (24 * 60 * 60 * 1000))
  let weekOfYear = Math.ceil(days / 7)

  // Set WOY to last week of prev year, if current WOY's 1st week of a new year
  if (weekOfYear === 1 && dayOfWeek < 5) {
    year -= 1
    weekOfYear += 51
  } else if (weekOfYear > 1 && dayOfWeek < 5) {
    weekOfYear -= 1
  }

  // Construct API endpoint query string with the year & WOY as calculated
  const apiQueryString = `?yyyy_report_week_ww=${year} Report Week ${weekOfYear}`
  const weeklyReportURL = cotURL + apiQueryString

  // Fetch most recent COT data by the current WOY
  try {
    const response = await fetch(weeklyReportURL, { headers })
    if (!response.ok) {
      throw new Error('Network response was not okay. Please try again later.')
    }
    const jsonCOT = await response.json()

    // Create ticker label
    const tickerLabelContainer = document.querySelector('#ticker-label-container')
    const tickerLabel = document.createElement('h6')
    tickerLabel.className = 'ticker-label pt-1'

    // Set date for ticker label
    const dateOfReport = new Date(Object.values(jsonCOT)[0].report_date_as_yyyy_mm_dd)
    const reportDate = dateOfReport.toDateString().slice(0, 15)
    tickerLabel.textContent = `Changes in net positions of Non-Commercial 
                                traders as at ${reportDate}`

    tickerLabelContainer.appendChild(tickerLabel)

    // Compute change in net position data

    /* In this 1st step, 'instrument' represents the current element in jsonCOT
       as .filter() traverses it. It checks if 'marketCodes' contains any value
       in the 'cftc_contract_market_code' field of instrument. For every match
       found the instrument is added to the 'selectedInstruments' array.
    */
    const selectedInstruments = jsonCOT.filter((instrument) =>
      marketCodes.includes(instrument.cftc_contract_market_code))

    // Create an array of the changes in net positions of Selectedinstruments
    const changesInNetPosition = selectedInstruments.map((instruments) => {
      const {
        change_in_noncomm_long_all: changeNoncommLong,
        change_in_noncomm_short_all: changeNoncommShort
      } = instruments
      const changeInNetPosition = (parseInt(changeNoncommLong)) -
                                   (parseInt(changeNoncommShort))
      return changeInNetPosition
    })
    return changesInNetPosition
  } catch (error) {
    console.error('Error processing COT data', error)
  }
}

// getChangeNetPosition()
