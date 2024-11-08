$(document).ready(function() {

    // This is the object that will hold all data about the selected country.
    // It starts off blank and will get updated at the end of the script

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
        weatherDescription: "",
        windSpeed: 0,
        language: "",
        language2: "",
        language3: "",
        summary: "",
        wikiUrl: "",
        north: 0,
        south: 0,
        east: 0,
        west: 0
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
                    // console.log(result["data"]);
                    resolve(result["data"]);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Error');
                    reject(errorThrown);
                }
            });
        });
    }

    async function setParams() {
        const selectedISO_A2 = $('#countrySelect').val();
    
        return fetch('./resources/countryBorders.geo.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const selectedCountry = data.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);
                countryInfo["iso_a2"] = selectedCountry.properties.iso_a2;
                countryInfo["iso_a3"] = selectedCountry.properties.iso_a3;
                countryInfo["name"] = selectedCountry.properties.name;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                throw error;
            });
    }

    async function setBoundingBox() {
        fetch('./resources/countryBorders.geo.json')
        .then(response => response.json())
        .then(geojsonData => {
        const selectedISO_A2 = $('#countrySelect').val();

        const selectedCountry = geojsonData.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);

        if (selectedCountry) {
            const coordinates = selectedCountry.geometry.type === 'Polygon'
            ? [selectedCountry.geometry.coordinates]
            : selectedCountry.geometry.coordinates;
            let north = -90;
            let south = 90;
            let east = -180;
            let west = 180;
            coordinates.forEach(polygon => {
            polygon.forEach(ring => {
                ring.forEach(coord => {
                if (Array.isArray(coord) && coord.length === 2) {
                    const [longitude, latitude] = coord;
                    north = parseFloat(Math.max(north, latitude).toFixed(2));
                    south = parseFloat(Math.min(south, latitude).toFixed(2));
                    east = parseFloat(Math.max(east, longitude).toFixed(2));
                    west = parseFloat(Math.min(west, longitude).toFixed(2));
                } else {
                    console.warn('Invalid coordinate:', coord);
                }
                });
            });
            });
            countryInfo.north = north
            countryInfo.south = south
            countryInfo.east = east
            countryInfo.west = west
        } else {
            console.error('Selected country not found in GeoJSON data.');
        }
        })
        .catch(error => console.error('Error fetching GeoJSON data:', error));

    }

    let earthquakeMarkers = L.layerGroup();

    async function getEarthquakes() {
        try {
          await Promise.resolve(setBoundingBox());
      
          // Clear existing earthquake markers on the map
          earthquakeMarkers.clearLayers();
      
          const result = await ajaxRequest("./libs/php/getEarthquakes.php", {
            data: {
              north: countryInfo.north,
              south: countryInfo.south,
              east: countryInfo.east,
              west: countryInfo.west,
            }
          });

          console.log(result)
      
          // Loop through each earthquake in the result and create a marker
          result.earthquakes.forEach(earthquake => {
            const { lat, lng, magnitude, depth, datetime, eqid } = earthquake;
            const popupContent = `<strong>Earthquake:</strong> ${eqid}<br>
                                  <strong>Magnitude:</strong> ${magnitude}<br>
                                  <strong>Depth:</strong> ${depth}<br>
                                  <strong>Date and Time:</strong> ${datetime}`;
      
            const marker = L.marker([lat, lng])
              .bindPopup(popupContent)
              .addTo(earthquakeMarkers);
          });

          console.log(earthquakeMarkers)
      
          // Add the earthquakeMarkers to the map
          earthquakeMarkers.addTo(map);
      
        } catch (error) {
          console.error('Error in getEarthquakes:', error);
        }
      }
    
    async function getContinent() {
        try {
            const result = await ajaxRequest("./libs/php/getContinent.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["continent"] = result;
        } catch (error) {
            console.error('Error in getContinent:', error);
        }
    }
    
    async function getCapitalCity() {
        try {
            const result = await ajaxRequest("./libs/php/getCapitalCity.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["capitalCity"] = result;
        } catch (error) {
            console.error('Error in getCapitalCity:', error);
        }
    }
    
    async function getArea() {
        try {
            const result = await ajaxRequest("./libs/php/getArea.php", {
                data: $('#countrySelect').val()
            });
            const data = parseInt(result, 10).toLocaleString('en-US');
            countryInfo["landArea"] = data;
        } catch (error) {
            console.error('Error in getArea:', error);
        }
    }
    
    async function getPopulation() {
        try {
            const result = await ajaxRequest("./libs/php/getPopulation.php", {
                data: $('#countrySelect').val()
            });
            const data = parseInt(result, 10).toLocaleString('en-US');
            countryInfo["population"] = data;
        } catch (error) {
            console.error('Error in getPopulation:', error);
        }
    }

    async function getCurrencyCode() {
        try {
            const result = await ajaxRequest("./libs/php/getCurrencyCode.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["currencyCode"] = result;
        } catch (error) {
            console.error('Error in getCurrencyCode:', error);
        }
    }

    async function getCurrency() {
        try {
            await getCurrencyCode();
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
            await getCurrencyCode();
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
            await getCapitalCity();
            const encodedCity = encodeURIComponent(countryInfo['capitalCity']);
            const result = await ajaxRequest("./libs/php/getWeather.php", {
                data: encodedCity
            });
            countryInfo["temperature"] = (result["main"]["temp"] - 273.15).toFixed(2) + "°C";
            countryInfo["feelsLike"] = (result["main"]["feels_like"] - 273.15).toFixed(2) + "°C";
            countryInfo["humidity"] = result["main"]["humidity"] + "%";
            countryInfo["windSpeed"] = (result["wind"]["speed"]).toFixed(0) + "mph";
            countryInfo["weatherDescription"] = result["weather"]["0"]["description"];
        } catch (error) {
            console.error('Error in getWeather:', error);
        }
    }

    async function getWiki() {
        try {
            await Promise.resolve(setParams());
            const encodedCountry = encodeURIComponent(countryInfo['name']);
            const result = await ajaxRequest("./libs/php/getWiki.php", {
                    data: encodedCountry
            });
            countryInfo["summary"] = result['geonames']['0']["summary"];
            countryInfo["wikiUrl"] = result['geonames']['0']["wikipediaUrl"];
        } catch (error) {
            console.error('Error in getContinent:', error);
        }
    }

    function setFlag() {
        const countryCode = $('#countrySelect').val();
        const imgElement = $('<img>');
        imgElement.attr('src', `https://flagsapi.com/${countryCode}/shiny/48.png`);
        $('#flag').empty().append(imgElement);
    }

    // The below code will call the functions that will update the object.
    // Upon completion, a function will be called to update the HTML

    $('#countrySelect').on('change', async function() {

        try {

            $('#loading-spinner').show();

            await Promise.all([
                setParams(),
                setBoundingBox(),
                getContinent(),
                getCapitalCity(),
                getArea(),
                getPopulation(),
                getCurrencyCode(),
                getExchanceRate(),
                getCurrency(),
                getLanguage(),
                getWeather(),
                getWiki(),
                getEarthquakes()
            ]);

            console.log(countryInfo)
    
            setFlag();
    
            $('#continent').html(countryInfo["continent"]);
            $('#capital-city').html(countryInfo["capitalCity"]);
            $('#land-area').html(countryInfo["landArea"]);
            $('#population').html(countryInfo["population"]);
            $('#currency').html(countryInfo["currency"]);
            $('#exchange-rate').html(countryInfo["exchangeRate"]);
            $('#temperature').html(countryInfo["temperature"]);
            $('#feels-like').html(countryInfo["feelsLike"]);
            $('#humidity').html(countryInfo["humidity"]);
            $('#weather-description').html(countryInfo["weatherDescription"]);
            $('#wind-speed').html(countryInfo["windSpeed"]);
            $('#language').html(countryInfo["language"]);
            if (countryInfo["language2"]) {$('#language').append('<br>' + countryInfo["language2"]);}
            if (countryInfo["language3"]) {$('#language').append('<br>' + countryInfo["language3"]);}
            $('#summary').html(countryInfo["summary"]);

            const wikiUrl = countryInfo["wikiUrl"];
            if (wikiUrl) {
                const absoluteUrl = wikiUrl.startsWith('http') ? wikiUrl : `http://${wikiUrl}`;
                const linkElement = `<a href="${absoluteUrl}" target="_blank">${absoluteUrl}</a>`;
                $('#wiki-url').html(linkElement);
            } else {
                $('#wiki-url').html("No Wikipedia link available");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            $('#loading-spinner').hide();
        }
    });
});
