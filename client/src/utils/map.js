const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_MI = 3958.8;

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function nearestNeighborSort(stops) {
  if (!stops || stops.length <= 2) return stops;

  const remaining = [...stops];
  const sorted = [remaining.shift()];

  while (remaining.length > 0) {
    const last = sorted[sorted.length - 1];
    const lastLat = last.lat ?? last.latitude;
    const lastLng = last.lng ?? last.longitude;

    let nearestIdx = 0;
    let nearestDist = Infinity;

    remaining.forEach((stop, idx) => {
      const sLat = stop.lat ?? stop.latitude;
      const sLng = stop.lng ?? stop.longitude;
      const dist = haversineDistance(lastLat, lastLng, sLat, sLng);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });

    sorted.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return sorted;
}

export function formatDistance(km) {
  if (km == null || isNaN(km)) return '—';
  const miles = km * 0.621371;
  if (miles < 0.1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (miles < 100) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${miles.toFixed(0)} mi`;
}

export function formatDistanceKm(km) {
  if (km == null || isNaN(km)) return '—';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function calculateRouteDistance(stops) {
  if (!stops || stops.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const aLat = a.lat ?? a.latitude;
    const aLng = a.lng ?? a.longitude;
    const bLat = b.lat ?? b.latitude;
    const bLng = b.lng ?? b.longitude;
    if (aLat != null && aLng != null && bLat != null && bLng != null) {
      total += haversineDistance(aLat, aLng, bLat, bLng);
    }
  }
  return total;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
