// eslint-disable-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
// import { blo } from "blo";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";

// import { useAccount } from "wagmi";

mapboxgl.accessToken = "pk.eyJ1Ijoicm9uY2h1Y2siLCJhIjoiY2x2Y2o5Z2drMGY3cjJrcGI4b2xsNzdtaCJ9.gi5RJ8qRhTSwfYuhVwhmvQ";

export default function Mapbox({
  setIsControlsActive = (bool) => bool,
  height = "70vh",
  setLatLng = (arr) => arr,
  isCheckInActive = false,
  attestationsData = {},
  latLngAttestation = [],
  setIsLoading = bool => bool,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(0.06);
  const [lat, setLat] = useState(51.03);
  const [zoom, setZoom] = useState(6);

  // const [fakeUsers, setFakeUsers] = useState([]);
  // const { address } = useAccount();

  // useEffect(() => {
  //   fetch("https://randomuser.me/api/?results=50&inc=picture&noinfo")
  //     .then((response) => response.json())
  //     // 4. Setting *dogImage* to the image url that we received from the response above
  //     .then((data) => setFakeUsers(data.results.map((user) => user?.picture?.thumbnail)));
  // },[]);
  console.log('[🧪 DEBUG]():', attestationsData)
  useEffect(() => {
    setIsLoading(false);
  })
  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: latLngAttestation.length > 0 ? [latLngAttestation[1], latLngAttestation[0]] : [lng, lat],
        zoom: zoom,
        attributionControl: false,
      });
    }

    if (latLngAttestation.length > 0) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Set state variables
      setLng(latLngAttestation[0]);
      setLat(latLngAttestation[1]);
      const el = document.createElement("div");
      el.className = "marker";
      el.className = "bg-primary"
      // el.src = "/eas_logo.png";
      // el.style.width = "40px";
      // el.style.height = "40px";
      // Add a pin to the map
      var newMarker = new mapboxgl.Marker(el).setLngLat([latLngAttestation[1],latLngAttestation[0]]).addTo(map.current);
      // Animated flyTo to position marker at center of map
      map.current.flyTo({
        center: [latLngAttestation[1],latLngAttestation[0]],
        essential: true,
      });

      // Add to state
      markersRef.current.push(newMarker);
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
      setLng(latLngAttestation.length > 0 ? latLngAttestation[0] : e.lngLat.lng);
      setLat(latLngAttestation.length > 0 ? latLngAttestation[0] : e.lngLat.lat);

      // set state on parent page (to pass on checkin)
      setLatLng && setLatLng([lat, lng]);


      const el = document.createElement("div");
      el.className = "marker";
      el.className = "bg-primary";


      // const el = document.createElement("img");
      // el.className = "marker";
      // el.src = "/eas_logo.png";
      // el.style.width = "30px";
      // el.style.height = "30px";
      // el.style.borderRadius = "50%";
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

      // done loading
    });

  });
  useEffect(() => {
    var mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
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

  // Add generated avatars and attestations to map.
  // useEffect(() => {
  //   if (attestationsData && attestationsData?.attestations && map.current /* && fakeUsers.length > 0 */) {
  //     attestationsData.attestations?.map((att) => {
  //       const decodedAttestation = JSON.parse(att.decodedDataJson);
  //       console.log("[🧪 DEBUG](att map):", JSON.parse(att.decodedDataJson));
  //       // const address = decodedAttestation[1].value.value;
  //       const coordinate = decodedAttestation[0].value.value;
  //       const el = document.createElement("img");
  //       el.className = "marker";
  //       el.src = "/eas_logo.png";
  //       // el.src = fakeUsers[idx];
  //       el.style.width = "40px";
  //       el.style.height = "40px";

  //       // Add a pin to the map
  //       var newMarker = new mapboxgl.Marker(el).setLngLat([coordinate[1], coordinate[0]]).addTo(map.current);
  //       markersRef.current.push(newMarker);
  //     });
  //   }
  // }, [attestationsData /*, fakeUsers*/]);

  return <div ref={mapContainer} className="card mx-4 mt-4 map-container" style={{ height }} />;
}
