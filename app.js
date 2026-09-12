const moerkapelle = {
  name: 'Moerkapelle',
  lat: 52.045,
  lon: 4.577
};

const schiphol = {
  name: 'Schiphol Airport',
  lat: 52.3086,
  lon: 4.7639
};

const radarRangeKm = 60;
const slider = document.getElementById('alert-range');
const rangeValue = document.getElementById('range-value');
const distanceValue = document.getElementById('distance-value');
const distanceDetails = document.getElementById('distance-details');
const alertStatus = document.getElementById('alert-status');
const alertRing = document.getElementById('alert-ring');
const schipholMarker = document.getElementById('schiphol-marker');

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInKm(from, to) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateBearing(from, to) {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const lonDelta = toRadians(to.lon - from.lon);

  const y = Math.sin(lonDelta) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta);

  return (Math.atan2(y, x) * 180) / Math.PI;
}

function updateRadarMarker(distanceKm) {
  const limitedDistance = Math.min(distanceKm, radarRangeKm);
  const distanceRatio = limitedDistance / radarRangeKm;
  const bearing = calculateBearing(moerkapelle, schiphol);
  const angle = toRadians(bearing - 90);
  const radius = distanceRatio * 40;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;

  schipholMarker.style.left = `${x}%`;
  schipholMarker.style.top = `${y}%`;
}

function updateAlert() {
  const distanceKm = calculateDistanceInKm(moerkapelle, schiphol);
  const selectedRange = Number(slider.value);
  const withinRange = distanceKm <= selectedRange;
  const formattedDistance = distanceKm.toFixed(1);

  rangeValue.textContent = slider.value;
  distanceValue.textContent = `${formattedDistance} km`;
  distanceDetails.textContent = `${schiphol.name} is ${formattedDistance} km from ${moerkapelle.name}.`;
  alertStatus.textContent = withinRange ? 'Within alert range' : 'Outside alert range';
  alertStatus.className = withinRange ? 'is-within-range' : 'is-out-of-range';
  schipholMarker.classList.toggle('is-highlighted', withinRange);

  const ringSize = `${(Math.min(selectedRange, radarRangeKm) / radarRangeKm) * 86}%`;
  alertRing.style.width = ringSize;
  alertRing.style.height = ringSize;

  updateRadarMarker(distanceKm);
}

slider.addEventListener('input', updateAlert);

updateAlert();
