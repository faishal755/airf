import React, { useState, useContext } from "react";
import Nav from "../Component/Nav";
import { listingDataContext } from "../context/ListingContext";
import Card from "../Component/Card.jsx";
import AirbnbLeafletMap from "../Component/AirbnbLeaflet.jsx";
import Footer from "../Component/Footer.jsx";
import { FaMapMarkedAlt, FaListUl } from "react-icons/fa";

function Home() {
  const { newListData } = useContext(listingDataContext);
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"

  return (
    <div className="relative min-h-screen bg-white flex flex-col justify-between">
      <Nav />

      {/* Floating Airbnb "Show map" / "Show list" Toggle Button */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="flex items-center gap-2.5 bg-[#222222] text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer font-semibold text-sm border border-neutral-700 select-none tracking-wide"
        >
          {viewMode === "list" ? (
            <>
              <span>Show map</span>
              <FaMapMarkedAlt className="text-base text-rose-400" />
            </>
          ) : (
            <>
              <span>Show list</span>
              <FaListUl className="text-base text-rose-400" />
            </>
          )}
        </button>
      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="flex flex-col min-h-screen justify-between w-full">
          <main className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 mt-[210px] md:mt-[165px] pb-24 md:pb-28 flex-1">
            {newListData && newListData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {newListData.map((list) => (
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
                    rating={list.rating}
                    isBooked={list.isBooked}
                    host={list.host}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-xl font-semibold text-gray-800">No listings found</p>
                <p className="text-sm text-gray-500 mt-1">Try selecting another category or location</p>
              </div>
            )}

            {/* Generous breathing space after the rooms listings before the footer */}
            <div className="h-12 sm:h-16 w-full" aria-hidden="true" />
          </main>
          <Footer />
        </div>
      )}

      {/* MAP VIEW */}
      {viewMode === "map" && (
        <div className="w-full h-[calc(100vh-210px)] md:h-[calc(100vh-165px)] mt-[210px] md:mt-[165px] relative">
          <AirbnbLeafletMap
            listings={newListData || []}
            height="100%"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

export default Home;
