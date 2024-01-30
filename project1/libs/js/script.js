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

      
      data.features.forEach(feature => {
        const option = document.createElement('option');
        option.value = feature.properties.iso_a2;
        option.textContent = feature.properties.name;
        selectElement.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching JSON:', error));
})