// Smart Coordinate Resolver for Airbnb Listings
// Maps city names and landmarks to geographical coordinates [lat, lng]
// with deterministic jittering to avoid overlapping markers.

export const CITY_COORDINATES = {
  // Major Indian Metros & Cities
  "delhi": [28.6139, 77.2090],
  "new delhi": [28.6139, 77.2090],
  "noida": [28.5355, 77.3910],
  "gurgaon": [28.4595, 77.0266],
  "gurugram": [28.4595, 77.0266],
  "mumbai": [19.0760, 72.8777],
  "navi mumbai": [19.0330, 73.0297],
  "thane": [19.2183, 72.9781],
  "bangalore": [12.9716, 77.5946],
  "bengaluru": [12.9716, 77.5946],
  "hyderabad": [17.3850, 78.4867],
  "chennai": [13.0827, 80.2707],
  "kolkata": [22.5726, 88.3639],
  "pune": [18.5204, 73.8567],
  "ahmedabad": [23.0225, 72.5714],
  "jaipur": [26.9124, 75.7873],
  "udaipur": [24.5854, 73.7125],
  "jodhpur": [26.2389, 73.0243],
  "jaisalmer": [26.9157, 70.9083],

  // Vacation & Tourist Destinations in India
  "goa": [15.2993, 74.1240],
  "north goa": [15.5494, 73.7535],
  "south goa": [15.2832, 73.9862],
  "calangute": [15.5440, 73.7554],
  "candolim": [15.5176, 73.7628],
  "baga": [15.5553, 73.7517],
  "anjuna": [15.5843, 73.7438],
  "panaji": [15.4909, 73.8278],
  "manali": [32.2432, 77.1892],
  "shimla": [31.1048, 77.1734],
  "dharamshala": [32.2190, 76.3234],
  "kasol": [32.0099, 77.3150],
  "rishikesh": [30.0869, 78.2676],
  "haridwar": [29.9457, 78.1642],
  "mussoorie": [30.4598, 78.0644],
  "dehradun": [30.3165, 78.0322],
  "nainital": [29.3919, 79.4542],
  "srinagar": [34.0837, 74.7973],
  "gulmarg": [34.0484, 74.3805],
  "leh": [34.1526, 77.5771],
  "ladakh": [34.1526, 77.5771],
  "agra": [27.1767, 78.0081],
  "varanasi": [25.3176, 82.9739],
  "amritsar": [31.6340, 74.8723],
  "chandigarh": [30.7333, 76.7794],
  "kochi": [9.9312, 76.2673],
  "cochin": [9.9312, 76.2673],
  "munnar": [10.0889, 77.0595],
  "alleppey": [9.4981, 76.3388],
  "alappuzha": [9.4981, 76.3388],
  "kerala": [10.8505, 76.2711],
  "ooty": [11.4102, 76.6950],
  "kodaikanal": [10.2381, 77.4892],
  "coorg": [12.3375, 75.8069],
  "wayanad": [11.6854, 76.1320],
  "pondicherry": [11.9416, 79.8083],
  "lonavala": [18.7557, 73.4091],
  "khandala": [18.7614, 73.3752],
  "mahabaleshwar": [17.9307, 73.6477],
  "alibaug": [18.6584, 72.8773],
  "darjeeling": [27.0410, 88.2663],
  "gangtok": [27.3389, 88.6065],
  "lucknow": [26.8467, 80.9462],
  "kanpur": [26.4499, 80.3319],
  "indore": [22.7196, 75.8577],
  "bhopal": [23.2599, 77.4126],
  "surat": [21.1702, 72.8311],
  "vadodara": [22.3072, 73.1812],
  "nagpur": [21.1458, 79.0882],
  "nashik": [19.9975, 73.7898],

  // Popular Global Destinations
  "paris": [48.8566, 2.3522],
  "london": [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  "nyc": [40.7128, -74.0060],
  "tokyo": [35.6762, 139.6503],
  "dubai": [25.2048, 55.2708],
  "singapore": [1.3521, 103.8198],
  "rome": [41.9028, 12.4964],
  "barcelona": [41.3851, 2.1734],
  "amsterdam": [52.3676, 4.9041],
  "berlin": [52.5200, 13.4050],
  "bangkok": [13.7563, 100.5018],
  "phuket": [7.8804, 98.3923],
  "bali": [-8.4095, 115.1889],
  "sydney": [-33.8688, 151.2093],
  "melbourne": [-37.8136, 144.9631],
  "los angeles": [34.0522, -118.2437],
  "san francisco": [37.7749, -122.4194],
  "toronto": [43.6532, -79.3832],
  "vancouver": [49.2827, -123.1207],
};

/**
 * Returns [lat, lng] for a listing.
 * Checks explicit coordinates first, then matches city/landmark against database,
 * and adds a small deterministic offset based on listing ID to space out items.
 */
export function getListingCoordinates(listing) {
  if (!listing) return [20.5937, 78.9629]; // India center default

  // 1. Explicit coordinates
  if (typeof listing.lat === "number" && typeof listing.lng === "number") {
    return [listing.lat, listing.lng];
  }
  if (typeof listing.latitude === "number" && typeof listing.longitude === "number") {
    return [listing.latitude, listing.longitude];
  }
  if (Array.isArray(listing.coordinates) && listing.coordinates.length === 2) {
    return [Number(listing.coordinates[0]), Number(listing.coordinates[1])];
  }

  const cleanText = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .trim();

  const cityStr = cleanText(listing.city);
  const landmarkStr = cleanText(listing.landmark);

  let baseCoords = null;

  // Search exact or partial city/landmark match
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (
      cityStr === key ||
      cityStr.includes(key) ||
      landmarkStr.includes(key) ||
      key.includes(cityStr)
    ) {
      baseCoords = coords;
      break;
    }
  }

  // Fallback: generate deterministic pseudo coordinates based on city text
  if (!baseCoords) {
    const seed = cityStr || landmarkStr || "india";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const pseudoLat = 18.0 + (Math.abs(hash % 1000) / 1000) * 10; // 18 to 28 N
    const pseudoLng = 73.0 + (Math.abs((hash >> 3) % 1000) / 1000) * 12; // 73 to 85 E
    baseCoords = [pseudoLat, pseudoLng];
  }

  // Deterministic jitter based on listing ID or title so multiple listings in
  // the same city/landmark don't overlap on the exact same pixel.
  const idStr = String(listing._id || listing.id || listing.title || "item");
  let idHash = 0;
  for (let i = 0; i < idStr.length; i++) {
    idHash = (idHash << 5) - idHash + idStr.charCodeAt(i);
    idHash |= 0;
  }

  // Generates roughly ±1.5 km spread around base center
  const jitterLat = ((Math.abs(idHash % 100) - 50) / 100) * 0.035;
  const jitterLng = ((Math.abs((idHash >> 2) % 100) - 50) / 100) * 0.035;

  return [
    Number((baseCoords[0] + jitterLat).toFixed(6)),
    Number((baseCoords[1] + jitterLng).toFixed(6)),
  ];
}
