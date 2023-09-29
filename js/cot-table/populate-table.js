import { getCOTDataForYear } from '../cot-table/get-cot-for-year.js'

async function populateTable () {
  const year = new Date().getFullYear()
  const table = document.querySelector('table')
  const tableHead = table.querySelector('thead')
  const tableBody = table.querySelector('tbody')
  const currencySelector = document.querySelector('#currency-selector')
  const tableCaption = document.querySelector('caption')

  // Detect change to user selection and assign market code accordingly
  currencySelector.addEventListener('change', async function () {
    const selectedCurrency = currencySelector.value

    // Clear any table on the page
    tableHead.innerHTML = '<tr></tr>'
    tableBody.innerHTML = ''

    // Populate body of the table, starting with creating the rows & columns
    const cotByYear = await getCOTDataForYear(selectedCurrency, year)
    if (cotByYear) {
      // Create and populate the header of the table
      const headerProperties = ['Date', 'Long Positions', 'Short Positions',
        '+/- Longs', '+/- Shorts', '% long', '% short', 'Net Positions']
      for (const headerText of headerProperties) {
        const headerElement = document.createElement('th')
        headerElement.textContent = headerText
        headerElement.setAttribute('scope', 'col')
        tableHead.querySelector('tr').appendChild(headerElement)
      }

      // Create the cell properties for the rows of the table
      cotByYear.forEach((cotData) => {
        const row = document.createElement('tr')
        const cellProperties = ['date', 'longPos', 'shortPos', 'chngLongPos',
          'chngShortPos', 'pctLongPos', 'pctShortPos', 'netPositions']
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
      // Create table caption
      const tableRows = document.querySelectorAll('tr')
      if (tableRows.length > 1) { // Caption should only appear when table has content
        tableCaption.textContent = `COT Table showing positions of Non-Commercial Traders for the year ${year}`
      } else {
        tableCaption.textContent = ''
      }
    }
  })
}

populateTable()
