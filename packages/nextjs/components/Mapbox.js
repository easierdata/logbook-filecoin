// eslint-disable-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = "pk.eyJ1Ijoicm9uY2h1Y2siLCJhIjoiY2x2Y2o5Z2drMGY3cjJrcGI4b2xsNzdtaCJ9.gi5RJ8qRhTSwfYuhVwhmvQ";

export default function Mapbox({ setCheckInActive, height = "90vh", setLatLng }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(-104.98716);
  const [lat, setLat] = useState(39.7323862);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: zoom,
      });
    }
    // initialize map only once

    map.current?.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current?.on("click", (e) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Set state variables
      setLng(e.lngLat.lng);
      setLat(e.lngLat.lat);

      // set state on parent page (to pass on checkin)
      setLatLng && setLatLng([lat, lng]);

      // Add a pin to the map
      var newMarker = new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat(e.lngLat)
        .addTo(map.current);

      // Animated flyTo to position marker at center of map
      map.current.flyTo({
        center: e.lngLat,
        essential: true,
      });

      // Add to state
      markersRef.current.push(newMarker);

      // bring up prop value to control map view
      setCheckInActive && setCheckInActive(true);

      // TODO: fix map center on checkin click.
    });
  });

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="map-container" style={{height}}/>
    </div>
  );
}
