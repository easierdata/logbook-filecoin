// eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import randomMapLoad from "~~/utils/randomizeMapboxLoad";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Mapbox({
  setIsControlsActive = bool => bool,
  height = "70vh",
  setLatLng = arr => arr,
  lngLat = [],
  isCheckInActive = false,
  latLngAttestation = [],
  setIsLoading = bool => bool,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const randomMapView = randomMapLoad();

  /**
   * Handle navigator.geolocation.getCurrentPosition()
   *    - success and error callbacks
   *
   */
  useEffect(() => {
    function showPosition(position) {
      console.log("showPosition called");

      // Fly to center without setting lat,lon state
      map?.current?.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        essential: true,
        zoom: 10,
        // duration: 3000,
      });

      console.log("✔📍 Map View set:[", position.coords.longitude, position.coords.latitude, "]");
    }

    function showError(error) {
      console.log("showError called");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
      }
      console.log("Falling back to random coordinates:", randomMapView);
    }

    if (navigator.geolocation) {
      console.log("NAVIGATOR");
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Falling back to random coordinates:", randomMapView);
      // setLng(0);
      // setLat(0); // repeat?
    }
  }, [randomMapView]); // -> will only run once after initial render

  // Loading state side effect
  useEffect(() => {
    console.log("[🧪 DEBUG](loading useEffect)");
    setIsLoading(false);
  }, [setIsLoading]);

  // Init map side effect
  useEffect(() => {
    // If map is not initialized, create a new map instance positioned at random location
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: [randomMapView.center.lng, randomMapView.center.lat],
        zoom: randomMapView.zoom,
        attributionControl: false,
      }).flyTo();
    }

    // We should pull attestations overlay out into a different set of code no? Feels like we need a few mapping utils?
    // if (latLngAttestation.length > 0) {
    //   markersRef.current.forEach(marker => marker.remove());
    //   markersRef.current = [];

    //   // Set state variables
    //   console.log("📍[Mapbox] Attestation coordinates:", latLngAttestation[0], latLngAttestation[1])
    //   console.log('latLngAttestation:', latLngAttestation);
    //   // setLng(latLngAttestation[0]);
    //   // setLat(latLngAttestation[1]);

    //   const el = document.createElement("div");
    //   el.className = "marker bg-primary";
    //   // el.src = "/eas_logo.png";
    //   // el.style.width = "40px";
    //   // el.style.height = "40px";
    //   // Add a pin to the map

    //   var newMarker = new mapboxgl.Marker(el)
    //     .setLngLat([latLngAttestation[1], latLngAttestation[0]])
    //     .addTo(map.current);

    //   // Animated flyTo to position marker at center of map
    //   map.current.flyTo({
    //     center: [latLngAttestation[1], latLngAttestation[0]],
    //     essential: true,
    //   });

    //   // Add to state
    //   markersRef.current.push(newMarker);
    // }

    // map.current?.on("move", () => {
    //   setLng(map.current.getCenter().lng.toFixed(4));
    //   setLat(map.current.getCenter().lat.toFixed(4));
    //   setZoom(map.current.getZoom().toFixed(2));
    // });

    map.current?.on("click", e => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Set state variables
      // console.log("📍[Mapbox] Clicked at:", e.lngLat.lng, e.lngLat.lat);
      // setLng(latLngAttestation.length > 0 ? latLngAttestation[0] : e.lngLat.lng);
      // setLat(latLngAttestation.length > 0 ? latLngAttestation[1] : e.lngLat.lat);

      // Set state on parent page (to pass on checkin)
      console.log("📍[setLngLat] State var set at:", e.lngLat.lng, e.lngLat.lat);
      setLatLng([parseFloat(e.lngLat.lng.toPrecision(6)), parseFloat(e.lngLat.lat.toPrecision(6))]); // trim precision

      const el = document.createElement("div");
      el.className = "marker bg-primary";
      // Add a pin to the map
      var newMarker = new mapboxgl.Marker(el).setLngLat(e.lngLat).addTo(map.current);

      // Animated flyTo to position marker at center of map
      map.current.flyTo({
        center: e.lngLat,
        essential: true,
        duration: 1000,
        zoom: 12.5,
      });

      // Add to state
      markersRef.current.push(newMarker);

      // Bring up prop value to control map view
      setIsControlsActive && setIsControlsActive(true);
      // Done loading
    });
  }, [latLngAttestation, setLatLng, randomMapView, setIsControlsActive]);

  // Canvas resize side effect
  useEffect(() => {
    var mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: lngLat, // this should be latLng, i.e. the actual form variables ...
        // zoom: zoom,
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
  }, [isCheckInActive, lngLat]);

  return <div ref={mapContainer} className="card mx-4 mt-4 map-container" style={{ height }} />;
}
