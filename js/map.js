(function () {
  "use strict";

  var mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  var lat = 25.7584;
  var lng = -80.1920;

  var map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([lat, lng], 15);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  var bronzeIcon = L.divIcon({
    className: "map-marker-custom",
    html: '<div style="width:24px;height:24px;background:#5c4a38;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  });

  var marker = L.marker([lat, lng], { icon: bronzeIcon }).addTo(map);

  marker.bindPopup(
    '<div class="map-popup">1428 Brickell Ave Miami, FL<br>33131</div>',
    { closeButton: false, offset: [0, -20] }
  ).openPopup();

  map.on("focus", function () {
    map.scrollWheelZoom.enable();
  });
  map.on("blur", function () {
    map.scrollWheelZoom.disable();
  });
})();
