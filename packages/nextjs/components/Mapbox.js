import mapboxgl from "!mapbox-gl";
// eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from "react";

mapboxgl.accessToken = "pk.eyJ1Ijoicm9uY2h1Y2siLCJhIjoiY2x2Y2o5Z2drMGY3cjJrcGI4b2xsNzdtaCJ9.gi5RJ8qRhTSwfYuhVwhmvQ";


export default function Mapbox({ height = "" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-118.464182);
  const [lat, setLat] = useState(33.982547);
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (map.current) return;
    // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  map.current?.on("move", () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
  });
  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="map-container" style={height ? { height: height } : {}} />
    </div>
  );
}
