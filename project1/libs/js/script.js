// Rendering the map
const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    // zoomControl: false
});

// Setting options for layers for user to choose
const standard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map) // sets this map to be rendered on page load


const streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
);

const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);

const dark = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });

var basemaps = {
    "Standard": standard,
    "Streets": streets,
    "Satellite": satellite,
    "Dark": dark
};



function createCustomButton(iconClass, modalId, positionClass, map) {
    return L.easyButton({
        states: [{
            stateName: 'default',
            icon: `<img src="./resources/${iconClass}.png" width="20" height="20">`,
            title: `Show ${modalId.replace("-modal", "")}`,
            onClick: function(btn, map) {
                $(`#${modalId}`).modal("show");
            }
        }],
        position: 'topleft'
    }).addTo(map).getContainer().classList.add(positionClass);
}

createCustomButton("i", "info-modal", "info-position", map);
createCustomButton("pound", "economic-modal", "economic-position", map);
createCustomButton("wiki", "wiki-modal", "wiki-position", map);
createCustomButton("cloud", "weather-modal", "weather-position", map);
createCustomButton("news", "news-modal", "news-position", map);
createCustomButton("calendar", "holiday-modal", "holiday-position", map);

$('.btn-close').on('click', function() {
    $(".modal").modal("hide");
});

// $('.btn-close').html('<img src="./resources/x.png" width="20" height="20">');

document.addEventListener('DOMContentLoaded', function() {
    fetch('./resources/countryBorders.geo.json')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('countrySelect');

            data.features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

            data.features.forEach(feature => {
                const option = document.createElement('option');
                option.value = feature.properties.iso_a2;
                option.textContent = feature.properties.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

// Below is functionality to set the view when choosing a country
function calculateCentroid(geometry) {
    const type = geometry.type;
    let coords;

    if (type === 'Polygon') {
        coords = geometry.coordinates[0];
    } else if (type === 'MultiPolygon') {
        let totalX = 0;
        let totalY = 0;
        let numPoints = 0;

        geometry.coordinates.forEach(polygon => {
            polygon[0].forEach(point => {
                totalX += point[0];
                totalY += point[1];
                numPoints++;
            });
        });

        if (numPoints === 0) {
            console.error('No coordinates found in MultiPolygon.');
            return null;
        }

        const centroidX = totalX / numPoints;
        const centroidY = totalY / numPoints;

        return [centroidY, centroidX];
    } else {
        console.error('Unsupported geometry type:', type);
        return null;
    }

    let x = 0;
    let y = 0;

    for (let i = 0; i < coords.length; i++) {
        x += coords[i][0];
        y += coords[i][1];
    }

    const centroidX = x / coords.length;
    const centroidY = y / coords.length;

    return [centroidY, centroidX];
}

let geojsonLayer;

$('#countrySelect').on('change', async function() {
    const selectedISO_A2 = $(this).val();
    const highlightStyle = {
        weight: 2,
        color: 'green',
        dashArray: '',
        fillOpacity: 0.2
    };

        try {
            const result = await $.ajax({
                url: './libs/php/getGeoJSON.php', // Path to your PHP routine
                type: 'POST',
                dataType: 'json',
                data: { selectedISO_A2: selectedISO_A2 }
            });
        if (result.status === 'success') {
            const selectedCountry = result.data

            if (selectedCountry) {
                if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
                }
                geojsonLayer = L.geoJSON(selectedCountry, {
                    style: highlightStyle
                }).addTo(map);
                map.fitBounds(geojsonLayer.getBounds());
            } else {
                console.error('Selected country not found in GeoJSON data.');
            }
        } else {
            console.error('Error fetching GeoJSON data:', result.message);
        }
    } catch (error) {
            console.error('Error fetching GeoJSON data:', error);
    }
});
//     const selectedISO_A2 = $(this).val();
//     const highlightStyle = {
//         weight: 2,
//         color: 'green',
//         dashArray: '',
//         fillOpacity: 0.2
//     };


//     // This needs to be changed to a PHP routine
//     fetch('./resources/countryBorders.geo.json')
//         .then(response => response.json())
//         .then(data => {
//             const selectedCountry = data.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);

//             if (selectedCountry) {
//                 if (geojsonLayer) {
//                     map.removeLayer(geojsonLayer);
//                 }
//                 geojsonLayer = L.geoJSON(selectedCountry, {
//                     style: highlightStyle
//                 }).addTo(map);
//                 map.fitBounds(geojsonLayer.getBounds());
//             } else {
//                 console.error('Selected country not found in GeoJSON data.');
//             }
//         })
//         .catch(error => console.error('Error fetching GeoJSON data:', error));
// });

$(document).ready(function() {

    $('#content').hide();
    $('#loading-spinner').show();

    map.on("locationfound", setInitialLocation())

    const countryInfo = {
        name: "",
        iso_a2: "",
        iso_a3: "",
        continent: "",
        capitalCity: "",
        landArea: 0,
        population: 0,
        currencyCode: "",
        currency: "",
        exchangeRate: 0,
        temperature: 0,
        feelsLike: 0,
        humidity: 0,
        windSpeed: 0,
        weatherIconUrl: "",
        temperature1: 0,
        weatherIconUrl1: "",
        temperature2: 0,
        weatherIconUrl2: "",
        weatherDay2: "",
        language: "",
        language2: "",
        language3: "",
        summary: "",
        wikiUrl: "",
        wikiImage: "",
        wikiTitle: "",
        summary2: "",
        wikiUrl2: "",
        wikiImage2: "",
        wikiTitle2: "",
        summary3: "",
        wikiUrl3: "",
        wikiImage3: "",
        wikiTitle3: "",
        north: 0,
        south: 0,
        east: 0,
        west: 0,
        lat: 0,
        lng: 0,
        timezoneId: "",
        sunrise: "",
        sunset: "",
        today: new Date().toISOString().slice(0, 10),
        news1Title: "",
        news1Author: "",
        news1Url: "",
        news1ImageUrl: "",
        news2Title: "",
        news2Author: "",
        news2Url: "",
        news2ImageUrl: "",
        news3Title: "",
        news3Author: "",
        news3Url: "",
        news3ImageUrl: "",
        news4Title: "",
        news4Author: "",
        news4Url: "",
        news4ImageUrl: "",
    }

    // The following functions are responsible for making ajax requests
    // that will update the countryInfo object

    function ajaxRequest(url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function(result) {
                    resolve(result["data"]);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Error');
                    reject(errorThrown);
                }
            });
        });
    }

    async function setInitialLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }

        async function successCallback(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            try {
                const result = await ajaxRequest("./libs/php/getLocation.php", {
                    data: {
                        lat: latitude,
                        lng: longitude
                    }
                });
                $('#countrySelect').val(result.countryCode).change();
            } catch (error) {
                console.error('Error in getLocation:', error);
            }
        };

        function errorCallback(error) {
            console.error("Error getting location:", error.message);
        }
    }

    async function setParams() {
        const selectedISO_A2 = $('#countrySelect').val();
    
        try {
            const result = await $.ajax({
                url: './libs/php/getBaseInfo.php',
                type: 'POST',
                dataType: 'json',
                data: { selectedISO_A2: selectedISO_A2 },
            });
    
            countryInfo["iso_a2"] = result.iso_a2;
            countryInfo["iso_a3"] = result.iso_a3;
            countryInfo["name"] = result.name;
        } catch (error) {
            console.error('Error fetching country info:', error);
            throw error;
        }
    }

    function getShortDate(dateItem) {
        const dateString = dateItem;
        const date = new Date(dateString);
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekIndex = date.getDay();
        const dayOfWeek = weekdays[dayOfWeekIndex];
        const dayOfMonth = date.getDate();

        function getDayOfMonthWithSuffix(day) {
            if (day >= 11 && day <= 13) {
                return day + 'th';
            }
            switch (day % 10) {
                case 1: return day + 'st';
                case 2: return day + 'nd';
                case 3: return day + 'rd';
                default: return day + 'th';
            }
        }
        const dayOfMonthWithSuffix = getDayOfMonthWithSuffix(dayOfMonth);
        const formattedDate = `${dayOfWeek} ${dayOfMonthWithSuffix}`;
        return formattedDate
    }

    async function setBoundingBox() {
        try {
            const selectedISO_A2 = $('#countrySelect').val();
            
            const result = await $.ajax({
                url: './libs/php/getGeoJSON.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    selectedISO_A2: selectedISO_A2
                }
            });
    
            if (result.status === 'success') {
                const selectedCountry = result.data;
                
                let north = -90;
                let south = 90;
                let east = -180;
                let west = 180;
                const processCoordinates = (coordinates) => {
                    coordinates.forEach(polygon => {
                        polygon.forEach(ring => {
                            ring.forEach(coord => {
                                if (Array.isArray(coord) && coord.length === 2) {
                                    const [longitude, latitude] = coord;
                                    north = Math.max(north, latitude);
                                    south = Math.min(south, latitude);
                                    east = Math.max(east, longitude);
                                    west = Math.min(west, longitude);
                                } else {
                                    console.warn('Invalid coordinate:', coord);
                                }
                            });
                        });
                    });
                };
                const coordinates = selectedCountry.geometry.type === 'Polygon' ?
                    [selectedCountry.geometry.coordinates] :
                    selectedCountry.geometry.coordinates;
                processCoordinates(coordinates);
                countryInfo.north = parseFloat(north.toFixed(2));
                countryInfo.south = parseFloat(south.toFixed(2));
                countryInfo.east = parseFloat(east.toFixed(2));
                countryInfo.west = parseFloat(west.toFixed(2));
                countryInfo.lat = parseFloat(((south) + ((north) - (south)) / 2).toFixed(2))
                countryInfo.lng = parseFloat(((west) + ((east) - (west)) / 2).toFixed(2))
            } else {
                console.error('Error fetching GeoJSON data:', result.message);
            }
        } catch (error) {
            console.error('Error in setBoundingBox:', error);
        }
    }
    
    let earthquakeMarkers = L.markerClusterGroup({polygonOptions: {
        fillColor: "#fff",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }});

    async function getEarthquakes() {
        try {
            await Promise.resolve(setBoundingBox());

            earthquakeMarkers.clearLayers();
    
            const result = await ajaxRequest("./libs/php/getEarthquakes.php", {
                data: {
                    north: countryInfo.north,
                    south: countryInfo.south,
                    east: countryInfo.east,
                    west: countryInfo.west,
                }
            });
    
            result.earthquakes.forEach(earthquake => {
                const { lat, lng, magnitude, depth, datetime, eqid } = earthquake;
    
                const marker = L.ExtraMarkers.icon({
                    prefix: 'fa',
                    markerColor: 'red',
                    icon: 'fa-house-crack',
                });

                const earthquakeInfo = `https://earthquake.usgs.gov/earthquakes/eventpage/${eqid}/executive`
                
                const newDatetime = new Date(datetime);

                const day = newDatetime.getDate();
                const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
                const options = {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                };
                let date = newDatetime.toLocaleDateString('en-GB', options);
                date = date.replace(/\b0(\d)\b/g, '$1');
                date = date.replace(day, day + suffix);

                const timeOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };
                const time = newDatetime.toLocaleTimeString('en-GB', timeOptions);
    
                const markerInstance = L.marker([lat, lng], { icon: marker })
                    .bindPopup(`<div><strong>An earthquake with magnitude ${magnitude} and depth ${depth} 
                                occurred here on ${date} at ${time}. Click 
                                <a href=${earthquakeInfo} target="_blank">here</a> 
                                to read more.</strong></div>`)
                    .addTo(earthquakeMarkers);
            });

            map.addLayer(earthquakeMarkers);
    
        } catch (error) {
            console.error('Error in getEarthquakes:', error);
        }
    }

    let airportMarkers = L.markerClusterGroup({polygonOptions: {
        fillColor: "#fff",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }});

    async function getAirports() {

        airportMarkers.clearLayers();

        try {
            const result = await ajaxRequest("./libs/php/getAirports.php", {
                data: $('#countrySelect').val()
            });
    
            result.forEach(airport => {
                const { latitude, longitude, name, city, country, iata } = airport;

                const marker = L.ExtraMarkers.icon({
                    prefix: 'fa',
                    icon: 'fa-plane',
                    iconColor: 'black',
                    markerColor: 'white',
                    shape: 'square'
                });
    
                const markerInstance = L.marker([latitude, longitude], { icon: marker })
                    .bindPopup(`<strong>${name}</strong> <br>`)
                    .addTo(airportMarkers);
            });
    
            // Add airport markers to the map
            map.addLayer(airportMarkers);
    
        } catch (error) {
            console.error('Error in getAirports:', error);
        }
    }

    let cityMarkers = L.markerClusterGroup({polygonOptions: {
        fillColor: "#fff",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }});

    async function getCities() {

        cityMarkers.clearLayers();

        try {
            const result = await ajaxRequest("./libs/php/getCities.php", {
                data: $('#countrySelect').val()
            });

            result.forEach(city => {
                const { latitude, longitude, name, country, population } = city;

                const marker = L.ExtraMarkers.icon({
                    prefix: 'fa',
                    icon: 'fa-city',
                    markerColor: 'green',
                    shape: 'square'
                });

                const formattedPopulation = parseFloat(population).toLocaleString('en-US')

                const markerInstance = L.marker([latitude, longitude], { icon: marker })
                    .bindPopup(`<strong>${name}</strong><br>
                                <strong>${formattedPopulation}</strong>`)
                    .addTo(cityMarkers);
            });

            map.addLayer(cityMarkers);

        } catch (error) {
            console.error('Error in getCities:', error);
        }
    }

    async function getNews() {
        try {
            await Promise.resolve(setParams());
            const modifiedCountryName = countryInfo.name.replace(/\s/g, '%20');
            const result = await ajaxRequest("./libs/php/getNews.php", {
                data: {
                    countryName: modifiedCountryName
                }
            });
            countryInfo["news1Title"] = result["results"][0]["title"];
            countryInfo["news1Author"] = result["results"][0]["creator"];
            countryInfo["news1Url"] = result["results"][0]["source_url"];
            countryInfo["news1ImageUrl"] = result["results"][0]["image_url"];

            countryInfo["news2Title"] = result["results"][1]["title"];
            countryInfo["news2Author"] = result["results"][1]["creator"];
            countryInfo["news2Url"] = result["results"][1]["source_url"];
            countryInfo["news2ImageUrl"] = result["results"][1]["image_url"];
            
            countryInfo["news3Title"] = result["results"][2]["title"];
            countryInfo["news3Author"] = result["results"][2]["creator"];
            countryInfo["news3Url"] = result["results"][2]["source_url"];
            countryInfo["news3ImageUrl"] = result["results"][2]["image_url"];
            
            // countryInfo["news4Title"] = result["results"][3]["title"];
            // countryInfo["news4Author"] = result["results"][3]["creator"];
            // countryInfo["news4Url"] = result["results"][3]["source_url"];
            // countryInfo["news4ImageUrl"] = result["results"][3]["image_url"];
        } catch (error) {
            console.error('Error in getNews:', error);
        }
    }

    async function getHolidays() {
        try {
            const result = await ajaxRequest("./libs/php/getHolidays.php", {
                data: $('#countrySelect').val()
            });
            
            function formatDate(dateString) {
                const date = new Date(dateString);
                const options = {
                    month: 'long',
                };
                const formattedDate = date.toLocaleDateString('en-GB', options);
                const day = date.getDate();
                const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
                return `${day}${suffix} ${formattedDate}`;
            }
    
            if (result && result.length > 0) {
                const tableBody = $('#holiday-table tbody');
                const addedDates = new Set();
                tableBody.empty();
                result.forEach(holiday => {
                    if (!addedDates.has(holiday.date)) {
                        const formattedDate = formatDate(holiday.date);
                        const row = $('<tr>');
                        row.append($('<td>').text(holiday.name));
                        row.append($('<td>').text(formattedDate));
                        tableBody.append(row);
                        addedDates.add(holiday.date);
                    }
                });
            }
        } catch (error) {
            console.error('Error in getHolidays:', error);
        }
    }
    
    async function getCountryInfo() {
        try {
            const result = await ajaxRequest("./libs/php/getCountryInfo.php", {
                data: $('#countrySelect').val()
            });
            const areaData = parseInt(result["areaInSqKm"], 10).toLocaleString('en-US');
            countryInfo["landArea"] = areaData;
            const populationData = parseInt(result["population"], 10).toLocaleString('en-US');
            countryInfo["population"] = populationData;
            countryInfo["continent"] = result["continentName"];
            countryInfo["capitalCity"] = result["capital"];
            countryInfo["currencyCode"] = result["currencyCode"];
        } catch (error) {
            console.error('Error in getCountryInfo:', error);
        }
    }

    async function getCurrency() {
        try {
            await getCountryInfo();
            const result = await ajaxRequest("./libs/php/getCurrency.php", {
                data: countryInfo["currencyCode"]
            });
            countryInfo["currency"] = result;
        } catch (error) {
            console.error('Error in getCurrency:', error);
        }
    }

    async function getExchanceRate() {
        try {
            await getCountryInfo();
            const result = await ajaxRequest("./libs/php/getExchangeRate.php", {
                data: countryInfo["currencyCode"]
            });
            countryInfo["exchangeRate"] = result.toFixed(2);
        } catch (error) {
            console.error('Error in getExchangeRate:', error);
        }
    }

    async function getLanguage() {
        try {
            const result = await ajaxRequest("./libs/php/getLanguage.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["language"] = Object.values(result)[0];
            countryInfo["language2"] = Object.values(result)[1];
            countryInfo["language3"] = Object.values(result)[2];
        } catch (error) {
            console.error('Error in getLanguage:', error);
        }
    }

    async function getWeather() {
        try {
            await getCountryInfo();
            const encodedCity = encodeURIComponent(countryInfo['capitalCity']);
            const result = await ajaxRequest("./libs/php/getWeather.php", {
                data: encodedCity
            });
            countryInfo["temperature"] = (result["current"]["temp_c"]).toFixed(0) + "°C";
            countryInfo["feelsLike"] = (result["current"]["feelslike_c"]).toFixed(0) + "°C";
            countryInfo["humidity"] = result["current"]["humidity"] + "%";
            countryInfo["windSpeed"] = (result["current"]["wind_mph"]).toFixed(0) + "mph";
            countryInfo["weatherIconUrl"] = result["current"]["condition"]["icon"];

            countryInfo["temperature1"] = (result["forecast"]["forecastday"]["1"]["day"]["avgtemp_c"]).toFixed(0) + "°C";
            countryInfo["weatherIconUrl1"] = (result["forecast"]["forecastday"]["1"]["day"]["condition"]["icon"]);

            countryInfo["temperature2"] = (result["forecast"]["forecastday"]["2"]["day"]["avgtemp_c"]).toFixed(0) + "°C";
            countryInfo["weatherIconUrl2"] = (result["forecast"]["forecastday"]["2"]["day"]["condition"]["icon"]);
            countryInfo["weatherDay2"] = (result["forecast"]["forecastday"]["2"]["date"]);
        } catch (error) {
            console.error('Error in getWeather:', error);
        }
    }

    async function getWiki() {
        try {
            await Promise.resolve(setBoundingBox());
            const result = await ajaxRequest("./libs/php/getWiki.php", {
                data: {
                    north: countryInfo.north,
                    south: countryInfo.south,
                    east: countryInfo.east,
                    west: countryInfo.west,
                }
            });
            countryInfo["summary"] = result['geonames']['0']["summary"];
            countryInfo["wikiUrl"] = result['geonames']['0']["wikipediaUrl"];
            countryInfo["wikiImage"] = result['geonames']['0']["thumbnailImg"];
            countryInfo["wikiTitle"] = result['geonames']['0']["title"];
            countryInfo["summary2"] = result['geonames']['1']["summary"];
            countryInfo["wikiUrl2"] = result['geonames']['1']["wikipediaUrl"];
            countryInfo["wikiImage2"] = result['geonames']['1']["thumbnailImg"];
            countryInfo["wikiTitle2"] = result['geonames']['1']["title"];
            countryInfo["summary3"] = result['geonames']['2']["summary"];
            countryInfo["wikiUrl3"] = result['geonames']['2']["wikipediaUrl"];
            countryInfo["wikiImage3"] = result['geonames']['2']["thumbnailImg"];
            countryInfo["wikiTitle3"] = result['geonames']['2']["title"];
        } catch (error) {
            console.error('Error in getWiki:', error);
        }
    }

    function setFlag() {
        const countryCode = $('#countrySelect').val();
        const imgElement = $('<img>');
        imgElement.attr('src', `https://flagsapi.com/${countryCode}/shiny/48.png`);
        $('#flag').empty().append(imgElement);
    }

    var overlays = {
        Airports: airportMarkers,
        Earthquakes: earthquakeMarkers,
        Cities: cityMarkers
    }

    const layerControl = L.control.layers(basemaps, overlays).addTo(map);

    // The below code will call the functions that will update the object.
    // Upon completion, a function will be called to update the HTML

    $('#countrySelect').on('change', async function() {

        try {

            $('#pre-load').removeClass("fadeOut");

            await Promise.all([
                getCountryInfo(),
                setParams(),
                setBoundingBox(),
                getExchanceRate(),
                getCurrency(),
                getLanguage(),
                getWeather(),
                getWiki(),
                getEarthquakes(),
                getAirports(),
                getCities(),
                getHolidays(),
                setFlag(),
                getNews()
            ]);

            $('#continent').html(countryInfo["continent"]);
            $('#capital-city').html(countryInfo["capitalCity"]);
            $('#land-area').html(countryInfo["landArea"]);
            $('#population').html(countryInfo["population"]);
            $('#currency').html(countryInfo["currency"]);
            $('#temperature').html(countryInfo["temperature"]);
            $('#feels-like').html(`Feels like: ${countryInfo["feelsLike"]}`);
            $('#humidity').html(`Humidity: ${countryInfo["humidity"]}`);
            $('#wind-speed').html(`Wind: ${countryInfo["windSpeed"]}`);
            $('#weather-title').html(`${countryInfo["capitalCity"]}, ${countryInfo["name"]}`);
            $('#weather-img').attr('src', countryInfo['weatherIconUrl'])
            $('#temperature-1').html(countryInfo["temperature1"]);
            $('#weather-img-1').attr('src', countryInfo['weatherIconUrl1'])
            $('#temperature-2').html(countryInfo["temperature2"]);
            $('#weather-img-2').attr('src', countryInfo['weatherIconUrl2'])
            var shortDateString = getShortDate(countryInfo["weatherDay2"]) + ":"
            $('#weather-day-2').html(shortDateString);
            $('#language').html(countryInfo["language"]);
            $('#timezoneId').html(countryInfo["timezoneId"]);
            $('#news-article-1-author').html(countryInfo["news1Author"]);
            $('#news-article-1-image').attr('src', countryInfo["news1ImageUrl"]);;
            $('#news-article-1-title').html(`<a href="${countryInfo["news1Url"]}" target="_blank">${countryInfo["news1Title"]}</a>`);
            $('#news-article-2-author').html(countryInfo["news2Author"]);
            $('#news-article-2-image').attr('src', countryInfo["news2ImageUrl"]);;
            $('#news-article-2-title').html(`<a href="${countryInfo["news2Url"]}" target="_blank">${countryInfo["news2Title"]}</a>`);
            $('#news-article-3-author').html(countryInfo["news3Author"]);
            $('#news-article-3-image').attr('src', countryInfo["news3ImageUrl"]);;
            $('#news-article-3-title').html(`<a href="${countryInfo["news3Url"]}" target="_blank">${countryInfo["news3Title"]}</a>`);
            // $('#news-article-4-author').html(countryInfo["news4Author"]);
            // $('#news-article-4-image').attr('src', countryInfo["news4ImageUrl"]);;
            // $('#news-article-4-title').html(`<a href="${countryInfo["news4Url"]}" target="_blank">${countryInfo["news4Title"]}</a>`);
            if (countryInfo["language2"]) {
                $('#language').append('<br>' + countryInfo["language2"]);
            }
            if (countryInfo["language3"]) {
                $('#language').append('<br>' + countryInfo["language3"]);
            }

            if ($('#dollar-amount').val()) {
                const convertedTotal = ($('#dollar-amount').val() * countryInfo.exchangeRate).toFixed(2);
                $('#converted-total').val(parseFloat(convertedTotal).toLocaleString('en-US'));
            }

            const wikiUrl = countryInfo["wikiUrl"];
            if (wikiUrl) {
                const absoluteUrl = wikiUrl.startsWith('http') ? wikiUrl : `http://${wikiUrl}`;
                const linkElement = `<a href="${absoluteUrl}" target="_blank">Read More</a>`;
                $('#wiki-summary').html(`${countryInfo["summary"]} ${linkElement}`);
                $('#wiki-img').attr('src', countryInfo["wikiImage"])
                $('#wiki-title').html(countryInfo["wikiTitle"])
            } else {
                $('#wiki-summary').html("No Wikipedia link available");
            }
            const wikiUrl2 = countryInfo["wikiUrl2"];
            if (wikiUrl2) {
                const absoluteUrl = wikiUrl2.startsWith('http') ? wikiUrl2 : `http://${wikiUrl2}`;
                const linkElement = `<a href="${absoluteUrl}" target="_blank">Read More</a>`;
                $('#wiki-summary-2').html(`${countryInfo["summary2"]} ${linkElement}`);
                $('#wiki-img-2').attr('src', countryInfo["wikiImage2"])
                $('#wiki-title-2').html(countryInfo["wikiTitle2"])
            } else {
                $('#wiki-summary').html("No Wikipedia link available");
            }
            const wikiUrl3 = countryInfo["wikiUrl3"];
            if (wikiUrl3) {
                const absoluteUrl = wikiUrl3.startsWith('http') ? wikiUrl3 : `http://${wikiUrl3}`;
                const linkElement = `<a href="${absoluteUrl}" target="_blank">Read More</a>`;
                $('#wiki-summary-3').html(`${countryInfo["summary3"]} ${linkElement}`);
                $('#wiki-img-3').attr('src', countryInfo["wikiImage3"])
                $('#wiki-title-3').html(countryInfo["wikiTitle3"])
            } else {
                $('#wiki-summary').html("No Wikipedia link available");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            $('#pre-load').addClass("fadeOut");
            $('#content').show();
        }
    });

    $('#dollar-amount').on('input', async function() {
        try {
            const convertedTotal = ($('#dollar-amount').val() * countryInfo.exchangeRate).toFixed(2);
            $('#converted-total').val(parseFloat(convertedTotal).toLocaleString('en-US'));
        } catch (error) {
            console.error('Error in converted total:', error);
        }
    })

    $('#dollar-amount').on('show.bs.modal', async function() {
        try {
            const convertedTotal = ($('#dollar-amount').val() * countryInfo.exchangeRate).toFixed(2);
            $('#converted-total').val(parseFloat(convertedTotal).toLocaleString('en-US'));
        } catch (error) {
            console.error('Error in converted total:', error);
        }
    })
});