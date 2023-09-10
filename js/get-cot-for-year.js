export async function getCOTDataForYear (year = 2021) {
  // Assign market code for currencies/instruments
  const userCurrency = document.querySelector('#currency-selector')
  userCurrency.addEventListener('change', async function () {
    const selectedCurrency = userCurrency.value
    const marketCodes = {
      aud: '232741',
      cad: '090741',
      chf: '092741',
      eur: '099741',
      gbp: '096742',
      jpy: '097741',
      mxn: '095741',
      nzd: '112741',
      dxy: '098662',
      crude_oil: '06775A',
      xag: '084691',
      xau: '088691',
      zar: '122741'
    }
    if (selectedCurrency !== 'Choose a currency') {
      const marketCode = marketCodes[selectedCurrency]

      // Fetch COT data by year and based on market code
      const cotURL = `https://publicreporting.cftc.gov/resource/jun7-fc8e.json?cftc_contract_market_code=${marketCode}`
      const headers = { 'X-App-Token': 'OvQJx8soXa21Iwes5jdJMFmVh' }

      try {
        const response = await fetch(cotURL, { headers })
        if (!response.ok) {
          throw new Error('Network response was not okay. Please try again later.')
        }
        const jsonCOT = await response.json()
        // console.log(jsonCOT)
        const cotByYear = []
        for (const cotData of jsonCOT) {
          const dataYear = new Date(cotData.report_date_as_yyyy_mm_dd).getFullYear()
          // console.log(dataYear)
          const netPositions = parseInt(cotData.noncomm_positions_long_all) - parseInt(cotData.noncomm_positions_short_all)
          const date = `${new Date(cotData.report_date_as_yyyy_mm_dd).toDateString().slice(4, 15)}`
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
        /* if (!dataYear) {
          window.alert(`Sorry, you can only view data for the year 2023 on this page. You are currently trying to view data for ${dataYear}\nKindly visit the Historical Visualiser page to view data for other years.`)
        } */

        // Create and populate the table on the user's page
        const table = document.querySelector('table')
        const tableHead = table.querySelector('thead')
        const tableBody = table.querySelector('tbody')

        // Clear the table on the page
        tableHead.innerHTML = '<tr></tr>'
        tableBody.innerHTML = ''

        // Create and populate the header of the table
        const headerProperties = ['Date', 'Long Positions', 'Short Positions', '+/- Longs', '+/- Shorts', '% long', '% short', 'Net Positions']
        for (const headerText of headerProperties) {
          const headerElement = document.createElement('th')
          headerElement.textContent = headerText
          headerElement.setAttribute('scope', 'col')
          tableHead.querySelector('tr').appendChild(headerElement)
        }

        // Populate the body of the table, starting with creating the rows & columns
        cotByYear.forEach((cotData) => {
          const row = document.createElement('tr')
          const cellProperties = ['date', 'longPos', 'shortPos', 'chngLongPos', 'chngShortPos', 'pctLongPos', 'pctShortPos', 'netPositions']
          if (cotData.netPositions > 0) {
            row.classList.add('table-active')
          }

          // Populate the table cells with respective data
          cellProperties.forEach((property) => {
            const cell = document.createElement('td')
            cell.textContent = cotData[property]
            row.appendChild(cell)
          })
          tableBody.appendChild(row)
        })
      } catch (error) {
        console.error('Error processing COT data', error)
      }
    }
  })
}
getCOTDataForYear()
