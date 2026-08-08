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

function Booked() {
  let { bookingData } = useContext(bookingDataContext);
  let navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  let { serverUrl } = useContext(authDataContext);
  let { getCurrentUser } = useContext(userDataContext);
  let { getListing } = useContext(listingDataContext);

  const handleRating = async (id) => {
    try {
      let result = await axios.post(
        serverUrl + `/api/listing/rating/${id}`,
        {
          rating: rating,
        },
        { withCredentials: true },
      );
      await getCurrentUser();
      await getListing();
      console.log(result);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  if (!bookingData) {
    return (
      <div className="w-[100vw] min-h-[100vh] flex items-center justify-center bg-slate-200 flex-col gap-[20px]">
        <RxCross2
          className="w-[40px] h-[40px] bg-[red] text-white p-[8px] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center"
          onClick={() => navigate("/")}
        />
        <p className="text-[20px] font-semibold">No active booking found</p>
        <button
          onClick={() => navigate("/")}
          className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-[100vw] min-h-[100vh] flex items-center
  justify-center gap-[30px] bg-slate-200 flex-col relative"
    >
      <RxCross2
        className="w-[40px] h-[40px] bg-[red] text-white p-[8px] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center"
        onClick={() => navigate("/")}
      />
      <div
        className="w-[95%] max-w-[500px] h-[400px] bg-[white]
      flex items-center justify-center border-[1px] border-[#b5b5b5] 
      flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg"
      >
        <div
          className="w-[100%] h-[50%] text-[20px] flex items-center 
        justify-center flex-col gap-[20px] font-semibold"
        >
          <GiConfirmed className="w-[100px] h-[100px] text-[green]" />
          Booking Confirmed
        </div>
        <div
          className="w-[100%] flex items-center justify-between text-[16px]
        md:text-[18px]"
        >
          <span>Booking Id :</span>
          <span>{bookingData._id}</span>
        </div>
        <div
          className="w-[100%] flex items-center justify-between text-[16px]
        md:text-[18px]"
        >
          <span>Owner Details :</span>
          <span>{bookingData.host?.email}</span>
        </div>
        <div
          className="w-[100%] flex items-center justify-between text-[16px]
        md:text-[18px]"
        >
          <span>Total Rent :</span>
          <span>{bookingData.totalRent}</span>
        </div>
      </div>
      <div
        className="w-[95%] max-w-[600px] h-[200px] bg-[white] flex
      items-center justify-center border-[1px] border-[#b5b5b5] gap-[20px]
      p-[20px] md:w-[80%] rounded-lg flex-col"
      >
        <h1 className="text-[18px] font-medium">{rating} out of 5 Rating</h1>
        <div className="flex gap-[8px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`w-[35px] h-[35px] cursor-pointer transition-colors duration-150 ${
                star <= (hoverRating || rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <button
          className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] 
      rounded-lg text-nowrap transition-transform duration-100 active:scale-[0.98]"
          onClick={() => handleRating(bookingData.listing)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Booked;
