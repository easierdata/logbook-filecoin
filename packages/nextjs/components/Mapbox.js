// eslint-disable-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import { blo } from "blo";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

mapboxgl.accessToken = "pk.eyJ1Ijoicm9uY2h1Y2siLCJhIjoiY2x2Y2o5Z2drMGY3cjJrcGI4b2xsNzdtaCJ9.gi5RJ8qRhTSwfYuhVwhmvQ";

export default function Mapbox({ setIsControlsActive, height = "70vh", setLatLng, isCheckInActive, attestationsData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(-104.98716);
  const [lat, setLat] = useState(39.7323862);
  const [zoom, setZoom] = useState(15);

  const { address } = useAccount();
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

      const el = document.createElement("img");
      el.className = "marker";
      el.src = blo(`0x${address}`);

      // Add a pin to the map
      var newMarker = new mapboxgl.Marker(el).setLngLat(e.lngLat).addTo(map.current);

      // Animated flyTo to position marker at center of map
      map.current.flyTo({
        center: e.lngLat,
        essential: true,
      });

      // Add to state
      markersRef.current.push(newMarker);

      // bring up prop value to control map view
      setIsControlsActive && setIsControlsActive(true);

      // TODO: fix map center on checkin click.
    });
  });
  useEffect(() => {
    var mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: zoom,
      });
    }

    if (isCheckInActive) {
      mapCanvas.style.height = "20vh";
      map.current.style.height = "20vh";
      mapContainer.current.style.height = "20vh";
      map.current.resize(50);
    } else {
      mapContainer.current.style.height = "80vh";
      map.current.resize();
    }
  }, [isCheckInActive, zoom, lat, lng]);

  useEffect(() => {
    if (attestationsData && map.current) {
      attestationsData.attestations?.map((att) => {
        const decodedAttestation = JSON.parse(att.decodedDataJson);
        console.log("[🧪 DEBUG](att map):", JSON.parse(att.decodedDataJson));
        const address = decodedAttestation[1].value.value;
        const coordinate = decodedAttestation[0].value.value;
        const el = document.createElement("img");
        el.className = "marker";
        el.src = blo(`0x${address}`);

        // Add a pin to the map
        var newMarker = new mapboxgl.Marker(el).setLngLat([coordinate[1],coordinate[0]]).addTo(map.current);
        markersRef.current.push(newMarker);

      });
    }
  }, [attestationsData]);

  return <div ref={mapContainer} className="card m-4 map-container" style={{ height }} />;
}
