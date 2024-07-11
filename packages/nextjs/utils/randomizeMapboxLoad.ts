type MapLocation = {
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
};

const mapLocations: MapLocation[] = [
  {
    name: "NA East Coast",
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 5,
  },
  {
    name: "NA West Coast",
    center: { lat: 34.0522, lng: -118.2437 },
    zoom: 5,
  },
  {
    name: "Europe",
    center: { lat: 50.1109, lng: 8.6821 },
    zoom: 5,
  },
  {
    name: "Sub-Saharan Africa",
    center: { lat: -1.2921, lng: 36.8219 },
    zoom: 5,
  },
  {
    name: "India",
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
  },
  {
    name: "Southeast Asia",
    center: { lat: 13.7563, lng: 100.5018 },
    zoom: 5,
  },
  {
    name: "East Asia + Japan",
    center: { lat: 35.6895, lng: 139.6917 },
    zoom: 5,
  },
  {
    name: "Australia and NZ",
    center: { lat: -33.8688, lng: 151.2093 },
    zoom: 4,
  },
  {
    name: "South America",
    center: { lat: -23.5505, lng: -46.6333 },
    zoom: 4,
  },
];

const randomMapLoad = (): MapLocation => {
  return mapLocations[Math.floor(Math.random() * mapLocations.length)];
};

export default randomMapLoad;
