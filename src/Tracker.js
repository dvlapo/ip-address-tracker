import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Icon } from "react-leaflet";
import { useRef } from 'react';
import "leaflet/dist/leaflet.css";


const Tracker = () => {
    // IP address info states
    const [ip, setIp] = useState('');
    const [location, setLocation] = useState('');
    const [timezone, setTimezone] = useState('');
    const [isp, setIsp] = useState('');
    const [center, setCenter] = useState({ lat: null, lng: null });
    const ZOOM_LEVEL = 2;
    const mapRef = useRef();
    // fetch request states
    const [isTracking, setIsTracking] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const tracker = {
        apiKey: 'at_QYweX3H4575qmegOapHTs3EQmcs4s',

        fetchAddress: function (ip) {
            fetch('https://geo.ipify.org/api/v1?apiKey=' + this.apiKey
                + '&ipAddress='
                + ip)
                .then(res => {
                    if (!res.ok) {
                        throw Error('Could not track IP address')
                    }
                    return res.json()
                })
                .then((data) => {
                    const { ip, isp, location: { country, timezone, lat: latitude, lng: longitude }, } = data;
                    setIp(ip);
                    setLocation(country);
                    setTimezone(timezone);
                    setIsp(isp);
                    setCenter({ lat: latitude, lng: longitude });
                    setIsTracking(null);
                    setData(true);
                    setError(null);
                }).catch((err) => {
                    setError(err.message);
                    setIsTracking(false);
                    setData(false);
                })

        }
    }
    const handleSearch = (e) => {
        e.preventDefault();
        setIsTracking(true);
        tracker.fetchAddress(e.target.value);
    }
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
    }

    useEffect(() => {
        tracker.fetchAddress(ip);
    }, [data])

    return (
        <div className="app">
            <h2>IP Address tracker</h2>
            <form>
                <div className="input">
                    <input
                        className="mobile"
                        onChange={(e) =>
                            setIp(e.target.value)
                        }
                        onKeyUp={handleEnter}
                    />
                    <button onClick={handleSearch} className="mobile"><i class="material-icons">chevron_right</i></button>

                    <input
                        className="desktop"
                        placeholder="Search for any IP address or domain"

                        onChange={(e) =>
                            setIp(e.target.value)
                        } />
                    <button onClick={handleSearch} className="desktop"><i class="material-icons">chevron_right</i></button>
                </div>
            </form>

            <div className="ip-details">
                {isTracking && <div>
                    <p>Tracking IP address...</p>
                </div>}
                {!isTracking && !error && <div className="details">
                    <div className="info">
                        <small>IP ADDRESS</small>
                        <h3>{ip}</h3>
                    </div>
                    <div className="info">
                        <small>LOCATION</small>
                        <h3>{location}</h3>
                    </div>
                    <div className="info">
                        <small>TIMEZONE</small>
                        <h3>{timezone}</h3>
                    </div>
                    <div className="info">
                        <small>ISP</small>
                        <h3>{isp}</h3>
                    </div>
                </div>}
                {error && <div>{error}</div>}
            </div>
            <MapContainer
                center={center}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy <a href="http:/osm.org/copyright">OpenStreetMap</a> contributors'>
                </TileLayer>
                <Marker
                    position={center}
                >
                    <Popup>
                        <span>
                            You are here!
                            <img src="../src/images/icon-location.svg" alt="" />
                        </span>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );

}



export default Tracker;