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
  crude_oil: '06765A',
  xag: '084691',
  xau: '088691',
  zar: '122741'
}

export function assignMarketCode (selectedCurrency) {
  if (selectedCurrency !== 'Choose a currreny') {
    const marketCode = marketCodes[selectedCurrency]
    return marketCode
  }
}

// assignMarketCode()
