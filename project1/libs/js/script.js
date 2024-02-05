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

L.easyButton("fa-info", function (btn, map) {
    $("#info-modal").modal("show");
  }, {position: 'topright'}).addTo(map).getContainer().classList.add('info-position');

L.easyButton("fa-info", function (btn, map) {
    $("#economic-modal").modal("show");
  }, {position: 'topright'}).addTo(map).getContainer().classList.add('economic-position');

L.easyButton("fa-info", function (btn, map) {
    $("#geographic-modal").modal("show");
  }, {position: 'topright'}).addTo(map).getContainer().classList.add('geographic-position');

L.easyButton("fa-info", function (btn, map) {
    $("#social-modal").modal("show");
  }, {position: 'topright'}).addTo(map).getContainer().classList.add('social-position');

L.easyButton("fa-info", function (btn, map) {
    $("#weather-modal").modal("show");
  }, {position: 'topright'}).addTo(map).getContainer().classList.add('weather-position');

$('.btn-close').on('click', function() {
  $(".modal").modal("hide");
});


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

const highlightStyle = {
  weight: 2,
  color: 'green',
  dashArray: '',
  fillOpacity: 0.2
};


let geojsonLayer;

$('#countrySelect').on('change', async function() {
  const selectedISO_A2 = $(this).val();

  fetch('./resources/countryBorders.geo.json')
    .then(response => response.json())
    .then(data => {
      // Find the selected country in the GeoJSON object
      const selectedCountry = data.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);

      if (selectedCountry) {
        // Clear existing GeoJSON layer if it exists
        if (geojsonLayer) {
          map.removeLayer(geojsonLayer);
        }

        // Create a new GeoJSON layer with the selected country's geometry and apply the highlight style
        geojsonLayer = L.geoJSON(selectedCountry, {
          style: highlightStyle
        }).addTo(map);

        // Fit the map view to the bounds of the highlighted GeoJSON layer
        map.fitBounds(geojsonLayer.getBounds());
      } else {
        console.error('Selected country not found in GeoJSON data.');
      }
    })
    .catch(error => console.error('Error fetching GeoJSON data:', error));
});