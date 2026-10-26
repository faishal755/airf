import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaStar, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";
import { userDataContext } from "../context/UserContext";
import { getListingCoordinates } from "../utils/coordinates";

// Fix default Leaflet marker assets if standard icons are used
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Helper component inside MapContainer to manage view changes,
 * bounds auto-fitting, and Leaflet size invalidation.
 */
function MapController({ bounds, center, zoom, searchOnMove, onMapMoved }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  // Invalidate size on mount / layout resize to prevent grey tiles
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  // Adjust view when bounds or center changes
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: hasInitialized.current,
      });
      hasInitialized.current = true;
    } else if (center) {
      map.setView(center, zoom || 13, {
        animate: hasInitialized.current,
      });
      hasInitialized.current = true;
    }
  }, [map, bounds, center, zoom]);

  // Map events for "Search as I move the map"
  useMapEvents({
    dragend: () => {
      if (searchOnMove && onMapMoved) {
        onMapMoved(map.getCenter(), map.getZoom(), map.getBounds());
      }
    },
    zoomend: () => {
      if (searchOnMove && onMapMoved) {
        onMapMoved(map.getCenter(), map.getZoom(), map.getBounds());
      }
    },
  });

  return null;
}

export default function AirbnbLeafletMap({
  listings = [],
  singleListing = null,
  selectedListingId = null,
  onSelectListing = null,
  className = "",
  height = "100%",
  showSearchCheckbox = true,
  initialCenter = null,
  initialZoom = null,
}) {
  const navigate = useNavigate();
  const { handleViewCard } = useContext(listingDataContext);
  const { userData } = useContext(userDataContext);

  const [activeListingId, setActiveListingId] = useState(selectedListingId);
  const [searchAsIMove, setSearchAsIMove] = useState(true);

  // Sync external selected listing if provided
  useEffect(() => {
    if (selectedListingId !== undefined) {
      setActiveListingId(selectedListingId);
    }
  }, [selectedListingId]);

  // Handle click on listing card inside popup
  const handleListingClick = (id) => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
  };

  // 1. Single Listing Mode (for ViewCard page)
  if (singleListing) {
    const singleCoords = getListingCoordinates(singleListing);

    const formattedRent = Number(singleListing.rent || 0).toLocaleString();
    const categoryText = (singleListing.category || "Stay").toUpperCase();
    const addressText = [singleListing.landmark, singleListing.city].filter(Boolean).join(", ") || singleListing.city || "Location";

    // Rich property marker with Category, Address & Price
    const singlePinIcon = L.divIcon({
      className: "airbnb-div-icon",
      html: `
        <div class="airbnb-rich-marker active">
          <div class="airbnb-marker-top">
            <span class="airbnb-marker-category">${categoryText}</span>
            <span class="airbnb-marker-price">₹${formattedRent}</span>
          </div>
          <div class="airbnb-marker-address">
            <svg class="airbnb-marker-pin-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>${addressText}</span>
          </div>
          <div class="airbnb-marker-tip"></div>
        </div>
      `,
      iconSize: null,
      iconAnchor: [75, 48],
      popupAnchor: [0, -50],
    });

    return (
      <div
        className={`w-full relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 z-0 ${className}`}
        style={{ height }}
      >
        <MapContainer
          center={singleCoords}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={singleCoords} zoom={14} />

          <Marker position={singleCoords} icon={singlePinIcon}>
            <Popup className="airbnb-map-popup" offset={[0, -10]}>
              <div className="p-4 bg-white text-gray-800">
                <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider mb-1">
                  <FaMapMarkerAlt /> Exact Area
                </div>
                <h4 className="font-bold text-gray-900 text-base leading-snug">
                  {singleListing.landmark}, {singleListing.city}
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  Exact location details are provided after reservation is confirmed.
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating location notice pill */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2 text-xs font-medium text-gray-700 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>{singleListing.landmark}, {singleListing.city}</span>
        </div>
      </div>
    );
  }

  // 2. Multi-Listings Mode (for Home / Search page)
  // Calculate coordinates and compute bounds
  const mappedListings = useMemo(() => {
    return (listings || []).map((listing) => ({
      ...listing,
      coordinates: getListingCoordinates(listing),
    }));
  }, [listings]);

  // Compute bounding box to encompass all visible listings
  const bounds = useMemo(() => {
    if (!mappedListings || mappedListings.length === 0) return null;
    const latLngs = mappedListings.map((l) => l.coordinates);
    try {
      return L.latLngBounds(latLngs);
    } catch {
      return null;
    }
  }, [mappedListings]);

  // Fallback center if bounds are empty (e.g. India center)
  const defaultCenter = initialCenter || [20.5937, 78.9629];
  const defaultZoom = initialZoom || (mappedListings.length > 0 ? 12 : 5);

  return (
    <div
      className={`w-full relative overflow-hidden z-0 ${className}`}
      style={{ height }}
    >
      {/* "Search as I move the map" Airbnb Floating Pill */}
      {showSearchCheckbox && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-auto">
          <button
            type="button"
            onClick={() => setSearchAsIMove(!searchAsIMove)}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                searchAsIMove ? "bg-rose-500 text-white" : "border border-gray-400 bg-white"
              }`}
            >
              {searchAsIMove && <FaCheck className="text-[10px]" />}
            </div>
            <span>Search as I move the map</span>
          </button>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false} // Clean map, we position or let Leaflet handle it
      >
        {/* OpenStreetMap Tile Layer - 100% Free & No API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          bounds={bounds}
          center={defaultCenter}
          zoom={defaultZoom}
          searchOnMove={searchAsIMove}
          onMapMoved={() => {}}
        />

        {/* Listing Rich Markers (Category + Address + Price) */}
        {mappedListings.map((listing) => {
          const isSelected = activeListingId === listing._id;
          const formattedRent = Number(listing.rent || 0).toLocaleString();
          const categoryText = (listing.category || "Stay").toUpperCase();
          const addressText = [listing.landmark, listing.city].filter(Boolean).join(", ") || listing.city || "Location";

          // Rich Airbnb Marker with Category, Address & Price
          const richIcon = L.divIcon({
            className: "airbnb-div-icon",
            html: `
              <div class="airbnb-rich-marker ${isSelected ? "active" : ""}">
                <div class="airbnb-marker-top">
                  <span class="airbnb-marker-category">${categoryText}</span>
                  <span class="airbnb-marker-price">₹${formattedRent}</span>
                </div>
                <div class="airbnb-marker-address">
                  <svg class="airbnb-marker-pin-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>${addressText}</span>
                </div>
                <div class="airbnb-marker-tip"></div>
              </div>
            `,
            iconSize: null,
            iconAnchor: [75, 48],
            popupAnchor: [0, -50],
          });

          return (
            <Marker
              key={listing._id}
              position={listing.coordinates}
              icon={richIcon}
              eventHandlers={{
                click: () => {
                  setActiveListingId(listing._id);
                  if (onSelectListing) onSelectListing(listing);
                },
                mouseover: () => {
                  setActiveListingId(listing._id);
                },
              }}
            >
              {/* Airbnb Listing Preview Card in Leaflet Popup */}
              <Popup className="airbnb-map-popup" autoPanPadding={[40, 40]}>
                <div
                  className="w-[280px] bg-white cursor-pointer group select-none text-left"
                  onClick={() => handleListingClick(listing._id)}
                >
                  {/* Property Image Carousel / Preview */}
                  <div className="relative h-[180px] w-full overflow-hidden bg-gray-100">
                    <img
                      src={listing.image1 || listing.image2 || listing.image3}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {listing.category && (
                      <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-800 shadow-sm capitalize">
                        {listing.category}
                      </span>
                    )}
                    {listing.rating > 0 && (
                      <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <FaStar className="text-amber-400 text-[11px]" />
                        {listing.rating}
                      </span>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {listing.landmark ? `${listing.landmark}, ` : ""}
                        {listing.city}
                      </h4>
                    </div>
                    <p className="text-gray-500 text-xs truncate mt-0.5">
                      {listing.title}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="font-bold text-gray-950 text-base">
                          ₹{formattedRent}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">/ night</span>
                      </div>
                      <span className="text-rose-600 text-xs font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}