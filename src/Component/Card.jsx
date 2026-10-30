import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { bookingDataContext } from "../context/BookingContext";

function Card({
  title,
  image1,
  image2,
  image3,
  landmark,
  rent,
  city,
  id,
  rating,
  isBooked,
  host,
}) {
  let { userData } = useContext(userDataContext);
  let { handleViewCard } = useContext(listingDataContext);
  let [popUp, setPopUP] = useState(false);
  let { cancelBooking } = useContext(bookingDataContext);
  let navigate = useNavigate();

  const handleClick = () => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="w-full max-w-[380px] sm:max-w-none mx-auto flex flex-col rounded-2xl cursor-pointer relative z-[10] group"
      onClick={() => (!isBooked ? handleClick() : null)}
    >
      {/* Booked Badge */}
      {isBooked && (
        <div className="absolute top-3 right-3 z-20 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-sm">
          <GiConfirmed className="w-4 h-4 text-white" />
          Booked
        </div>
      )}

      {/* Host Cancel Booking Badge */}
      {isBooked && host === userData?._id && (
        <button
          className="absolute top-11 right-3 z-20 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setPopUP(true);
          }}
        >
          <FcCancel className="w-4 h-4" />
          Cancel
        </button>
      )}

      {/* Cancel Confirmation Popup */}
      {popUp && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center text-center gap-4">
            <h4 className="text-lg font-bold text-gray-900">Cancel Booking</h4>
            <p className="text-sm text-gray-600">Are you sure you want to cancel this booking?</p>
            <div className="flex items-center gap-3 w-full">
              <button
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelBooking(id);
                  setPopUP(false);
                }}
              >
                Yes
              </button>
              <button
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopUP(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Carousel / Container */}
      <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-x-auto flex snap-x snap-mandatory scrollbar-none relative shadow-xs">
        <img
          src={image1}
          alt={title}
          className="w-full h-full object-cover flex-shrink-0 snap-center group-hover:scale-102 transition-transform duration-300"
        />
        {image2 && (
          <img
            src={image2}
            alt={title}
            className="w-full h-full object-cover flex-shrink-0 snap-center"
          />
        )}
        {image3 && (
          <img
            src={image3}
            alt={title}
            className="w-full h-full object-cover flex-shrink-0 snap-center"
          />
        )}
      </div>

      {/* Card Info */}
      <div className="w-full pt-3 pb-1 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[15px]">
          <span className="w-[80%] font-semibold text-gray-900 truncate">
            {landmark ? `In ${landmark}, ${city}` : `In ${city}`}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-gray-900 flex-shrink-0">
            <FaStar className="text-[#eb6262] text-xs" />
            {rating || "4.8"}
          </span>
        </div>
        <p className="text-[14px] text-gray-500 truncate">
          {title}
        </p>
        <p className="text-[15px] pt-0.5">
          <span className="font-semibold text-gray-900">₹{Number(rent).toLocaleString()}</span>
          <span className="text-gray-500 text-sm"> / day</span>
        </p>
      </div>
    </div>
  );
}

export default Card;
