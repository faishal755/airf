import React, { useContext } from "react";
import { FaLongArrowAltLeft, FaPlus, FaHome, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";
import Card from "../Component/Card";
import Footer from "../Component/Footer";

function MyListing() {
  const navigate = useNavigate();
  const { userData } = useContext(userDataContext);
  const { listingData } = useContext(listingDataContext);

  // Safely get user's listings from populated userData or by matching host ID
  const myListings =
    userData?.listing && userData.listing.length > 0 && typeof userData.listing[0] === "object"
      ? userData.listing
      : (listingData || []).filter(
          (item) => String(item.host) === String(userData?._id)
        );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition shadow-sm cursor-pointer"
            title="Back to Explore"
          >
            <FaLongArrowAltLeft className="text-gray-700 text-lg" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Manage Listings
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              {userData?.name ? `Host: ${userData.name}` : "Your Hosting Dashboard"}
            </p>
          </div>
        </div>

        {/* "+ Create Listing" Button */}
        <button
          onClick={() => navigate("/listingpage1")}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span className="hidden sm:inline">Create New Listing</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-8 flex-1">
        {/* Host Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs uppercase font-semibold text-gray-400">
              Active Properties
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
              {myListings.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs uppercase font-semibold text-gray-400">
              Booked Status
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-emerald-600 mt-1">
              {myListings.filter((l) => l.isBooked).length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs uppercase font-semibold text-gray-400">
              Hosting Rating
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-amber-500 mt-1 flex items-center gap-1.5">
              <FaStar className="text-xl" />
              <span>4.9</span>
            </p>
          </div>
        </div>

        {/* Listings Section */}
        {myListings.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Your Properties ({myListings.length})
              </h2>
            </div>
            <div className="flex items-start justify-center sm:justify-start gap-6 flex-wrap pb-10">
              {myListings.map((list) => (
                <Card
                  key={list._id}
                  title={list.title}
                  landmark={list.landmark}
                  city={list.city}
                  image1={list.image1}
                  image2={list.image2}
                  image3={list.image3}
                  rent={list.rent}
                  id={list._id}
                  isBooked={list.isBooked}
                  host={list.host}
                  rating={list.rating}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
              <FaHome />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              You haven&apos;t published any listings yet
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Earn money by sharing your extra home, apartment, villa, or cabin with
              millions of travelers from around the world.
            </p>
            <button
              onClick={() => navigate("/listingpage1")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <FaPlus className="text-xs" />
              <span>Set Up Your First Listing</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyListing;
