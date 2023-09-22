import { getCOTDataForYear } from '../cot-table/get-cot-for-year.js'

async function populateTable () {
  const year = new Date().getFullYear()
  const currencySelector = document.querySelector('#currency-selector')
  const table = document.querySelector('table')
  const tableHead = table.querySelector('thead')
  const tableBody = table.querySelector('tbody')

  // Detect change to user selection and assign market code accordingly
  currencySelector.addEventListener('change', async function () {
    const selectedCurrency = currencySelector.value

    // Clear the table on the page
    tableHead.innerHTML = '<tr></tr>'
    tableBody.innerHTML = ''

    // Create and populate the header of the table
    const headerProperties = ['Date', 'Long Positions', 'Short Positions',
      '+/- Longs', '+/- Shorts', '% long', '% short', 'Net Positions']
    for (const headerText of headerProperties) {
      const headerElement = document.createElement('th')
      headerElement.textContent = headerText
      headerElement.setAttribute('scope', 'col')
      tableHead.querySelector('tr').appendChild(headerElement)
    }

    // Populate body of the table, starting with creating the rows & columns
    const cotByYear = await getCOTDataForYear(selectedCurrency, year)
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
    const tableCaption = document.createElement('caption')
    tableCaption.textContent = `COT Table showing positions of Non-Commercial Traders for the year ${year}`
    table.appendChild(tableCaption)
  })
}
populateTable()
