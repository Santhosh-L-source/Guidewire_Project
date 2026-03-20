import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CITIES = [
    { name: 'Chennai', coords: [13.0827, 80.2707], alert: 'High', type: 'Flood Alert' },
    { name: 'Mumbai', coords: [19.0760, 72.8777], alert: 'Low', type: 'Clear' },
    { name: 'Bangalore', coords: [12.9716, 77.5946], alert: 'Medium', type: 'Moderate Rain' },
    { name: 'Delhi', coords: [28.6139, 77.2090], alert: 'High', type: 'Severe AQI' },
    { name: 'Hyderabad', coords: [17.3850, 78.4867], alert: 'Medium', type: 'Heatwave Warning' },
];

export default function DisruptionMap() {
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        // Small delay to ensure container renders before Map initializes
        const timer = setTimeout(() => setMapReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!mapReady) return <div className="h-96 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Maps...</div>;

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 z-0 relative">
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {CITIES.map((city, idx) => {
                    const color = city.alert === 'High' ? 'red' : city.alert === 'Medium' ? 'orange' : 'green';
                    return (
                        <CircleMarker
                            key={idx}
                            center={city.coords}
                            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6 }}
                            radius={city.alert === 'High' ? 12 : 8}
                        >
                            <Popup>
                                <div className="font-bold">{city.name}</div>
                                <div className="text-sm">Status: <span className="font-semibold">{city.type}</span></div>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </MapContainer>
        </div>
    );
}
