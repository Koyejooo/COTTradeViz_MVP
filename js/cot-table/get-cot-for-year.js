import { assignMarketCode } from '../cot-table/assign-market-code.js'
const COTUrl = 'https://publicreporting.cftc.gov/resource/jun7-fc8e.json'
const headers = { 'X-App-Token': 'OvQJx8soXa21Iwes5jdJMFmVh' }

export async function getCOTDataForYear (selectedCurrency, year) {
  const marketCode = await assignMarketCode(selectedCurrency)

  // Build query string & COT endpoint with market code field
  const APIqueryString = `?$where=cftc_contract_market_code in ('${marketCode}')&$order=report_date_as_yyyy_mm_dd&$limit=100000`
  const COTEndpoint = COTUrl + APIqueryString

  // Fetch COT data by market code, for the currenct year
  try {
    const response = await fetch(COTEndpoint, { headers })
    if (!response.ok) {
      throw new Error('Network response was not okay. Please try again later.')
    }
    const jsonCOT = await response.json()

    // Process response to filter out necessary data fields
    const cotByYear = []
    for (const cotData of jsonCOT) {
      const dataYear = new Date(cotData.report_date_as_yyyy_mm_dd).getFullYear()
      const netPositions = (parseInt(cotData.noncomm_positions_long_all)) -
                            (parseInt(cotData.noncomm_positions_short_all))
      const date = `${new Date(cotData.report_date_as_yyyy_mm_dd)
                      .toDateString().slice(4, 15)}`
      if (dataYear === year) {
        const cotByYearObject = {
          date,
          longPos: parseInt(cotData.noncomm_positions_long_all),
          shortPos: parseInt(cotData.noncomm_positions_short_all),
          chngLongPos: parseInt(cotData.change_in_noncomm_long_all),
          chngShortPos: parseInt(cotData.change_in_noncomm_short_all),
          pctLongPos: parseInt(cotData.pct_of_oi_noncomm_long_all),
          pctShortPos: parseInt(cotData.pct_of_oi_noncomm_short_all),
          numLongTraders: parseInt(cotData.traders_noncomm_long_all),
          numShortTraders: parseInt(cotData.traders_noncomm_short_all),
          netPositions
        }
        cotByYear.push(cotByYearObject)
      }
    }
    console.log(cotByYear)
    return cotByYear.reverse()
  } catch (error) {
    console.error('Error processing COT data', error)
  }
}

getCOTDataForYear()
