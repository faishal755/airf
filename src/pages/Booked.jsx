import React, { useContext, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { bookingDataContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";
import { toast } from "react-toastify";

function Booked() {
  let { bookingData } = useContext(bookingDataContext);
  let navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  let { serverUrl } = useContext(authDataContext);
  let { getCurrentUser } = useContext(userDataContext);
  let { getListing } = useContext(listingDataContext);

  const handleRating = async (id) => {
    setSubmitting(true);
    try {
      try {
        await axios.post(
          serverUrl + `/api/review/add/${id}`,
          {
            rating: rating || 5,
            comment: comment.trim() || "Excellent stay! Everything went smoothly.",
          },
          { withCredentials: true }
        );
      } catch {
        await axios.post(
          serverUrl + `/api/listing/rating/${id}`,
          { rating: rating || 5 },
          { withCredentials: true }
        );
      }

      await getCurrentUser();
      await getListing();
      toast.success("Review and rating submitted! Thank you.");
      navigate("/");
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="w-full min-h-[100vh] flex items-center justify-center bg-slate-100 flex-col gap-[20px]">
        <RxCross2
          className="w-[40px] h-[40px] bg-[red] text-white p-[8px] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center"
          onClick={() => navigate("/")}
        />
        <p className="text-[20px] font-semibold text-gray-700">No active booking found</p>
        <button
          onClick={() => navigate("/")}
          className="px-[30px] py-[10px] bg-[#FF385C] text-white text-[16px] rounded-xl font-semibold shadow-md hover:bg-[#E00B41] transition"
        >
          Explore Stays
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center gap-[25px] bg-slate-100 flex-col relative py-12 px-4">
      <RxCross2
        className="w-[40px] h-[40px] bg-neutral-900 text-white p-[8px] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center hover:scale-105 transition"
        onClick={() => navigate("/")}
      />

      {/* Confirmation Card */}
      <div className="w-[95%] max-w-[520px] bg-white flex items-center justify-center border border-gray-200 flex-col gap-4 p-8 rounded-3xl shadow-xl">
        <div className="text-xl flex items-center justify-center flex-col gap-2 font-bold text-gray-900">
          <GiConfirmed className="w-16 h-16 text-emerald-500" />
          <span>Booking Confirmed!</span>
          <span className="text-xs text-gray-400 font-normal">You are all set for your upcoming trip</span>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl p-4 space-y-2.5 text-xs text-gray-700 border border-gray-100 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking Reference:</span>
            <span className="font-mono font-bold text-gray-900">#{bookingData._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Host Contact:</span>
            <span className="font-medium text-gray-900">{bookingData.host?.email || "Host Verified"}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm text-gray-900">
            <span>Total Paid:</span>
            <span className="text-emerald-600">₹{Number(bookingData.totalRent || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating & Review Box */}
      <div className="w-[95%] max-w-[520px] bg-white flex items-center justify-center border border-gray-200 gap-3 p-6 rounded-3xl shadow-xl flex-col">
        <h3 className="text-base font-bold text-gray-900">Rate & Review Your Experience</h3>
        <p className="text-xs text-gray-500 text-center">
          How was your reservation experience? Leave a quick star rating and feedback.
        </p>

        {/* Stars */}
        <div className="flex gap-2 my-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`w-8 h-8 cursor-pointer transition-transform hover:scale-125 ${
                star <= (hoverRating || rating) ? "text-amber-400" : "text-gray-200"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        {/* Comment input */}
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional: share feedback with host and future guests..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:border-rose-400 resize-none mt-1"
        />

        <div className="w-full flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
          >
            Skip for now
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRating(bookingData.listing)}
            className="flex-1 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booked;
