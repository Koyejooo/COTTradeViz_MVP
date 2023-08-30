function updateDOM(reportDate, commodity, openInterest, longPositions, shortPositions, netPositions) {
	document.getElementById("date").textContent = reportDate;
	document.getElementById("commodity").textContent = commodity;
	document.getElementById("all-positions").textContent = openInterest;
	document.getElementById("long-positions").textContent = longPositions;
	document.getElementById("short-positions").textContent = shortPositions;
	document.getElementById("net-positions").textContent = netPositions;
}

const cot_url = 'https://publicreporting.cftc.gov/resource/jun7-fc8e.json?id=220920099741C' // Endpoint for EURO FX COT Legacy combined report

async function* getCOT() {
	try {
		const response = await fetch(cot_url);
		if (!response.ok) {
			throw new Error('Unfortunately network response was not okay');
		}

		const cot_data = await response;
		console.log(cot_data);

		const [ cotData ] = cot_data;
		const {
			report_date_as_yyyy_mm_dd: date,
			commodity_name: currency,
			open_interest_all: allPos,
			noncomm_positions_long_all: nonCommLong,
			noncomm_positions_short_all: nonCommShort,
			comm_positions_long_all: commLong,
			comm_positions_short_all: commShort
		} = cotData;

	const longPositions = `${nonCommLong + commLong}`;
	const shortPositions = `${nonCommShort + commShort}`;
	const netPositions = `${longPositions - shortPositions}`;

	console.log(`${date}`);
	console.log(`${currency}`);
	console.log(`${allPos}`);
	console.log(`${longPositions}`);
	console.log(`${shortPositions}`);
	console.log(`${netPositions}`);

	updateDOM(date, currency, allPos, longPositions, shortPositions, netPositions);
	} catch (error) {
		console.error('Error processing COT data', error);
	}

}

getCOT();
