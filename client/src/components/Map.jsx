import { useEffect, useMemo, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

function PanToSelected({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

const BreweryMarker = memo(({ brewery, onClick, isSelected }) => {
  const position = [brewery.lat || brewery.latitude, brewery.lng || brewery.longitude];
  
  return (
    <Marker
      position={position}
      eventHandlers={{ click: () => onClick?.(brewery) }}
      icon={L.divIcon({
        className: 'custom-marker',
        html: isSelected
          ? `<div style="width: 36px; height: 36px; background: #f59e0b; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><span style="transform: rotate(45deg); font-size: 18px;">🍺</span></div>`
          : `<div style="width: 30px; height: 30px; background: #f59e0b; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 2px solid white;"><span style="transform: rotate(45deg); font-size: 16px;">🍺</span></div>`,
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 36] : [15, 30],
      })}
    >
      <Tooltip direction="top" offset={[0, -20]} className="custom-tooltip">
        <div className="font-semibold text-gray-900">{brewery.name}</div>
        <div className="text-xs text-gray-500">{brewery.city}{brewery.state ? `, ${brewery.state}` : ''}</div>
      </Tooltip>
      <Popup>
        <div className="p-1">
          <p className="font-semibold text-gray-900">{brewery.name}</p>
          <p className="text-xs text-gray-500">{brewery.city}{brewery.state ? `, ${brewery.state}` : ''}</p>
          {brewery.type && <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">{brewery.type}</span>}
        </div>
      </Popup>
    </Marker>
  );
});

export default function Map({
  breweries = [],
  trips = [],
  center = [39.8283, -98.5795],
  zoom = 4,
  selectedBrewery,
  onBreweryClick,
  showRoute = false,
  height = '400px',
}) {
  const routePositions = useMemo(() => {
    if (!showRoute || !trips.length) return [];
    return trips.flatMap((t) => (t.stops || []).map((s) => [s.lat ?? s.latitude, s.lng ?? s.longitude]));
  }, [trips, showRoute]);

  const allPositions = useMemo(() => {
    return breweries.map((b) => [b.lat || b.latitude, b.lng || b.longitude]);
  }, [breweries]);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        {allPositions.length > 0 && <FitBounds positions={allPositions} />}
        {selectedBrewery && <PanToSelected position={[selectedBrewery.lat || selectedBrewery.latitude, selectedBrewery.lng || selectedBrewery.longitude]} />}
        
        {breweries.map((brewery) => (
          <BreweryMarker
            key={brewery.id}
            brewery={brewery}
            onClick={onBreweryClick}
            isSelected={selectedBrewery?.id === brewery.id}
          />
        ))}
        
        {showRoute && routePositions.length > 1 && (
          <>
            <Polyline
              positions={routePositions}
              pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '10, 10', opacity: 0.8 }}
            />
            {trips.flatMap((t) => (t.stops || []).map((stop, idx) => (
              <Marker
                key={`stop-${stop.id}`}
                position={[stop.lat ?? stop.latitude, stop.lng ?? stop.longitude]}
                icon={L.divIcon({
                  className: 'stop-marker',
                  html: `<div style="width: 28px; height: 28px; background: #f59e0b; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${idx + 1}</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                })}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  Stop {idx + 1}: {stop.name}
                </Tooltip>
              </Marker>
            )))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
