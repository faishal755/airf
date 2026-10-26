import React, { useContext } from "react";
import { FaStar, FaMapMarkerAlt, FaExternalLinkAlt, FaCompass } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../../context/ListingContext";
import { userDataContext } from "../../context/UserContext";
import { toast } from "react-toastify";

function ChatListingCard({ listing, onApplyToPage }) {
  const navigate = useNavigate();
  const { handleViewCard } = useContext(listingDataContext);
  const { userData } = useContext(userDataContext);

  if (!listing) return null;

  const handleOpenDetails = () => {
    if (!userData) {
      toast.info("Please login to view listing & make reservations", {
        position: "top-center",
        autoClose: 2500,
      });
      navigate("/login");
      return;
    }
    handleViewCard(listing._id);
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col my-2 group">
      {/* Listing Thumbnail with Badge */}
      <div className="relative w-full h-36 overflow-hidden bg-gray-100">
        <img
          src={listing.image1 || listing.image2 || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80";
          }}
        />
        {/* Category Pill */}
        {listing.category && (
          <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize">
            {listing.category}
          </span>
        )}
        {/* Rating Pill */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-neutral-800 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <FaStar className="text-amber-500 text-[10px]" />
          <span>{listing.rating ? Number(listing.rating).toFixed(2) : "4.90"}</span>
        </div>
      </div>

      {/* Listing Info */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h4
            onClick={handleOpenDetails}
            className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-[#FF385C] cursor-pointer transition-colors"
            title={listing.title}
          >
            {listing.title}
          </h4>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <FaMapMarkerAlt className="text-[#FF385C] flex-shrink-0 text-[11px]" />
            <span className="truncate">
              {listing.landmark ? `${listing.landmark}, ` : ""}
              {listing.city}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-sm font-bold text-gray-900">
              ₹{Number(listing.rent || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 font-normal"> / night</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onApplyToPage && (
              <button
                type="button"
                onClick={() => onApplyToPage(listing)}
                className="text-[11px] text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                title="Filter on home map"
              >
                <FaCompass className="text-xs text-rose-500" />
                <span>Map</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenDetails}
              className="text-[11px] text-white bg-[#FF385C] hover:bg-[#E00B41] px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium shadow-sm transition-colors cursor-pointer"
            >
              <span>View</span>
              <FaExternalLinkAlt className="text-[9px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListingCard;
