import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
    center?: [number, number]
    zoom?: number
    markers?: Array<{
        id: string
        position: [number, number]
        title?: string
        description?: string
    }>
    className?: string
    onMarkerClick?: (id: string) => void
}

// Component to update map center when props change
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

export default function Map({
    center = [23.8103, 90.4125], // Default to Dhaka
    zoom = 13,
    markers = [],
    className = "h-[400px] w-full rounded-lg shadow-md",
    onMarkerClick
}: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            className={className}
        >
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    eventHandlers={{
                        click: () => onMarkerClick && onMarkerClick(marker.id),
                    }}
                >
                    {(marker.title || marker.description) && (
                        <Popup>
                            <div className="p-1">
                                {marker.title && <h3 className="font-semibold text-sm">{marker.title}</h3>}
                                {marker.description && <p className="text-xs text-gray-600 mt-1">{marker.description}</p>}
                            </div>
                        </Popup>
                    )}
                </Marker>
            ))}
        </MapContainer>
    )
}
