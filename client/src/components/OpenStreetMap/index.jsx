import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс для иконок маркеров, так как Leaflet по умолчанию ищет их в неправильном пути
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Компонент для обработки кликов на карте
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return null;
};

const MapComponent = (props) => {
  const [position, setPosition] = useState(null);

  const getAddress = async (lat, lng) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    props.setAddressState(data.display_name);
    props.setAddress(data.display_name); // Передача адреса родительскому компоненту
  };

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    getAddress(latlng.lat, latlng.lng);
  };

  return (
    <div>
      <MapContainer center={[53.194, 45.020]} zoom={13} style={{ height: '85vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <Marker position={position}>
            <Popup>
              Адрес: <br /> {props.address}
            </Popup>
          </Marker>
        )}
        <LocationMarker setPosition={handleMapClick} />
      </MapContainer>
      
    </div>
  );
};

export default MapComponent;
