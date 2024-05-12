import React from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapComponent({tags}) {
    return (
        <MapContainer center={[46.0793, 11.1302]} zoom={13} className='h-full w-full '>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {
                tags.length?(
                    tags.map((item)=>(
                        <Marker position={[item.latitude, item.longitude]}>
                            <Popup>
                                item.label
                            </Popup>
                            </Marker>
                        
                    ))) :""
                
            }
        </MapContainer>
            
    );
}

export default MapComponent;
