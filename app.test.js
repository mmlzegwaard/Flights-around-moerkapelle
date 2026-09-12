const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateBearing,
  calculateDistanceInKm,
  calculateRadarPosition,
  isWithinRange,
  moerkapelle,
  radarRangeKm,
  schiphol
} = require('./app');

test('calculates the Schiphol distance from Moerkapelle', () => {
  const distance = calculateDistanceInKm(moerkapelle, schiphol);

  assert.ok(distance > 31.5 && distance < 32.5, `expected ~32km, received ${distance}`);
});

test('normalizes bearings to the 0-360 range', () => {
  const bearing = calculateBearing({ lat: 0, lon: 0 }, { lat: 0, lon: -1 });

  assert.equal(bearing, 270);
});

test('treats the selected boundary as within range', () => {
  assert.equal(isWithinRange(32, 32), true);
  assert.equal(isWithinRange(32, 31), false);
});

test('projects radar positions within the visible radar bounds', () => {
  const distance = calculateDistanceInKm(moerkapelle, schiphol);
  const bearing = calculateBearing(moerkapelle, schiphol);
  const position = calculateRadarPosition(distance, bearing, radarRangeKm);

  assert.ok(position.x >= 10 && position.x <= 90, `x out of range: ${position.x}`);
  assert.ok(position.y >= 10 && position.y <= 90, `y out of range: ${position.y}`);
});

test('uses the provided radar range when projecting marker positions', () => {
  const eastBearing = 90;
  const position = calculateRadarPosition(15, eastBearing, 20);

  assert.equal(position.x, 80);
  assert.equal(position.y, 50);
});
