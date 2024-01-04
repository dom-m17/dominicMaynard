import getOcean from "./apiCalls/oceans.js";
import getNearestAddress from "./apiCalls/nearestAddress.js";
import getWikiSearch from "./apiCalls/wikiSearch.js";

async function updateOcean() {
    try {
        const oceanData = await getOcean({
            lat: document.getElementById("ocean-lat").value,
            lng: document.getElementById("ocean-lng").value
        })
    
        const { distance, geonameId, name } = oceanData["ocean"]
    
        document.getElementById("ocean-geoname-id").innerHTML = geonameId
        document.getElementById("ocean-distance").innerHTML = distance
        document.getElementById("ocean-name").innerHTML = name

    } catch (error) {
        document.getElementById("ocean-geoname-id").innerHTML = "There is no ocean at"
        document.getElementById("ocean-name").innerHTML = "those coordinates"
        document.getElementById("ocean-distance").innerHTML = ""
    }
    
    
}

async function updateNearestAddress() {
    try {
        const nearestAddressData = await getNearestAddress({
            lat: document.getElementById("address-lat").value,
            lng: document.getElementById("address-lng").value
        })
    
        const { street, placename, countryCode } = nearestAddressData["address"]
    
        document.getElementById("address-street").innerHTML = street
        document.getElementById("address-name").innerHTML = placename
        document.getElementById("address-code").innerHTML = countryCode

    } catch (error) {
        document.getElementById("address-street").innerHTML = "There is no address at"
        document.getElementById("address-name").innerHTML = "those coordinates"
        document.getElementById("address-code").innerHTML = ""
    }
    
    
}

async function updateWikiSearch() {
    try {
        const wikiData = await getWikiSearch({
            q: document.getElementById("wiki-q").value
        })

        console.log(wikiData)
    
        const { title, summary, wikipediaUrl } = wikiData["geonames"][0]
    
        document.getElementById("wiki-title").innerHTML = title
        document.getElementById("wiki-summary").innerHTML = summary
        document.getElementById("wiki-url").innerHTML = wikipediaUrl

    } catch (error) {
        document.getElementById("wiki-title").innerHTML = "That is not a valid search"
        document.getElementById("wiki-summary").innerHTML = "please try again"
        document.getElementById("wiki-url").innerHTML = ""
    }
    
    
}

document.getElementById('ocean-btn').addEventListener('click', updateOcean);
document.getElementById('address-btn').addEventListener('click', updateNearestAddress);
document.getElementById('wiki-btn').addEventListener('click', updateWikiSearch);