#!/usr/bin/node
function updateDOM(reportDate, commodity, openInterest, longPositions, shortPositions, netPositions) {
	        document.getElementById("date").textContent = reportDate;
	        document.getElementById("commodity").textContent = commodity;
	        document.getElementById("all-positions").textContent = openInterest;
	        document.getElementById("long-positions").textContent = longPositions;
	        document.getElementById("short-positions").textContent = shortPositions;
	        document.getElementById("net-positions").textContent = netPositions;
}

const cot_url = 'https://publicreporting.cftc.gov/resource/jun7-fc8e.json?id=220920099741C'
async function* getCOT() {
	try {
		const response = await fetch(cot_url);
		if (!response.ok) {
			throw new Error('Unfortunately network response was not okay');
		}
		const cot_data = await response.json();
		console.log(cot_data);
	}  catch (error) {
		console.error('Error processing COT data', error);
	}
}

getCOT();
