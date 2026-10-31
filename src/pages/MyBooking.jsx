import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaSuitcase, FaMapMarkerAlt, FaStar, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";
import Card from "../Component/Card";
import Footer from "../Component/Footer";

function MyBooking() {
  const navigate = useNavigate();
  const { userData, getCurrentUser } = useContext(userDataContext);
  const { handleViewCard } = useContext(listingDataContext);
  const [filter, setFilter] = useState("all"); // "all" | "confirmed"

  // Fetch updated active bookings whenever this page loads
  useEffect(() => {
    if (getCurrentUser) {
      getCurrentUser();
    }
  }, []);

  const myBookings = Array.isArray(userData?.booking) ? userData.booking : [];

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
              Your Trips & Reservations
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              {userData?.name ? `Traveler: ${userData.name}` : "Manage Your Bookings"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
        >
          Explore More Places
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-8 flex-1">
        {/* Trips Summary Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setFilter("all")}
              className={`text-sm pb-2 font-semibold transition border-b-2 cursor-pointer ${
                filter === "all"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              All Reservations ({myBookings.length})
            </button>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Status: {myBookings.length > 0 ? "Active Travel Plan" : "No Active Trips"}
          </span>
        </div>

        {myBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {myBookings.map((booking, idx) => {
              if (!booking || typeof booking !== "object") return null;
              return (
                <div
                  key={booking._id || idx}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition group text-left flex flex-col justify-between"
                >
                  {/* Property Image & Status Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={booking.image1 || booking.image2 || booking.image3}
                      alt={booking.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      <span>Confirmed Stay</span>
                    </div>
                    {booking.rating > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaStar className="text-amber-400 text-xs" />
                        <span>{booking.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-rose-500 mb-1">
                        {booking.category || "Vacation Stay"}
                      </p>
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">
                        {booking.title}
                      </h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-1.5">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{booking.landmark}, {booking.city}</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-gray-900">
                          ₹{Number(booking.rent || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/ day</span>
                      </div>
                      <button
                        onClick={() => handleViewCard(booking._id)}
                        className="text-xs font-semibold px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Trips State */
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
              <FaSuitcase />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No trips booked... yet!
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Time to dust off your bags and start planning your next getaway. Explore
              beachfront villas, cozy mountain cabins, and luxury city lofts.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>Start Exploring Stays</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyBooking;
