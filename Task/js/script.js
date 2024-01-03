import getOcean from "./apiCalls/oceans.js";

function updateOcean() {
    const oceanData = getOcean({
        lat: document.getElementById("ocean-lat").value,
        lng: document.getElementById("ocean-lng").value
    })

    const { oceanDistance, oceanId, oceanName } = oceanData

    document.getElementById("ocean-geoname-id").textContent = oceanId
    document.getElementById("ocean-distance").textContent = oceanDistance
    document.getElementById("ocean-name").textContent = oceanName

}

document.getElementById('ocean-btn').addEventListener('click', updateOcean);