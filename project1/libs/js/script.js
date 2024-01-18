// Rendering the map
const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    // zoomControl: false
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.zoomControl.setPosition('bottomright');

// L.imageOverlay(
//     "/project1/resources/title.jpeg", 
//     [[51.49, -0.13], [51.51, -0.07]]
//     ).addTo(map);
