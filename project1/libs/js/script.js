// Rendering the map
const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    // zoomControl: false
});

map.zoomControl.setPosition('bottomright');

// Setting options for layers for user to choose
const standard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map) // sets this map to be rendered on page load


const streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,  
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
);
  
const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,  
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );

const dark = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', 
    {
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

const layerControl = L.control.layers(basemaps).addTo(map);

layerControl.setPosition('bottomleft');

function createCustomButton(iconClass, modalId, positionClass, map) {
  return L.easyButton({
    states: [{
      stateName: 'default',
      icon: `<img src="./resources/${iconClass}.png" width="20" height="20">`, // Replace with the path to your image
      title: `Show ${modalId.replace("-modal", "")}`,
      onClick: function (btn, map) {
        $(`#${modalId}`).modal("show");
      }
    }],
    position: 'topright'
  }).addTo(map).getContainer().classList.add(positionClass);
}

createCustomButton("i", "info-modal", "info-position", map);
createCustomButton("pound", "economic-modal", "economic-position", map);
createCustomButton("earth", "geographic-modal", "geographic-position", map);
createCustomButton("cloud", "weather-modal", "weather-position", map);
createCustomButton("clock", "timezone-modal", "timezone-position", map);

$('.btn-close').on('click', function() {
  $(".modal").modal("hide");
});

$('.btn-close').html('<img src="./resources/x.png" width="20" height="20">');


document.addEventListener('DOMContentLoaded', function () {
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
  

  fetch('./resources/countryBorders.geo.json')
    .then(response => response.json())
    .then(data => {
      const selectedCountry = data.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);

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
    })
    .catch(error => console.error('Error fetching GeoJSON data:', error));
});

$(document).ready(function() {
  
  try {
    setInitialLocation()
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
      $('#loading-spinner').hide();
  }

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
      west: 0,
      lat: 0,
      lng: 0,
      timezoneId: "",
      sunrise: "",
      sunset: ""
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
          $('#countrySelect').val(result).change();
          
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
    try {
        const response = await fetch('./resources/countryBorders.geo.json');
        const geojsonData = await response.json();

        const selectedISO_A2 = $('#countrySelect').val();
        const selectedCountry = geojsonData.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);

        if (selectedCountry) {
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

            const coordinates = selectedCountry.geometry.type === 'Polygon'
                ? [selectedCountry.geometry.coordinates]
                : selectedCountry.geometry.coordinates;

            processCoordinates(coordinates);

            countryInfo.north = parseFloat(north.toFixed(2));
            countryInfo.south = parseFloat(south.toFixed(2));
            countryInfo.east = parseFloat(east.toFixed(2));
            countryInfo.west = parseFloat(west.toFixed(2));
            countryInfo.lat = parseFloat(((south) + ((north) - (south)) / 2).toFixed(2))
            countryInfo.lng = parseFloat(((west) + ((east) - (west)) / 2).toFixed(2))
        } else {
            console.error('Selected country not found in GeoJSON data.');
        }
      } catch (error) {
        console.error('Error fetching or processing GeoJSON data:', error);
      }
    }


  // Need to get lat and lng coords before this function will work
  async function getTime() {
    try {
        await setBoundingBox()
        const result = await ajaxRequest("./libs/php/getTime.php", {
          data: {
            lat: countryInfo.lat,
            lng: countryInfo.lng
        }
        });
        console.log(result) 
        countryInfo["timezoneId"] = result['timezoneId'];
        countryInfo["sunrise"] = result['sunrise'];
        countryInfo["sunset"] = result['sunset'];
      } catch (error) {
        console.error('Error in getTime:', error);
      }
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
              getEarthquakes(),
              getTime()
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
          $('#timezoneId').html(countryInfo["timezoneId"]);
          $('#sunrise').html(countryInfo["sunrise"]);
          $('#sunset').html(countryInfo["sunset"]);
          if (countryInfo["language2"]) {$('#language').append('<br>' + countryInfo["language2"]);}
          if (countryInfo["language3"]) {$('#language').append('<br>' + countryInfo["language3"]);}
          $('#summary').html(countryInfo["summary"]);
          
          if (('#dollar-amount').val()) {
            const convertedTotal = $('#dollar-amount').val() * countryInfo.exchangeRate
            $('#converted-total').html((convertedTotal, 10).toLocaleString('en-US') + " " + countryInfo.currency); 
          }

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

  $('#dollar-amount').on('input', async function() {
    try {
      const convertedTotal = $('#dollar-amount').val() * countryInfo.exchangeRate
      $('#converted-total').html(parseInt(convertedTotal, 10).toLocaleString('en-US') + " " + countryInfo.currency);
    } catch (error) {
      console.error('Error in converted total:', error);
    }  
  })
});