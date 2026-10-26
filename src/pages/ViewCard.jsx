import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";
import { userDataContext } from "../context/UserContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { bookingDataContext } from "../context/BookingContext";
import { toast } from "react-toastify";
import AirbnbLeafletMap from "../Component/AirbnbLeaflet.jsx";
import Footer from "../Component/Footer.jsx";
import ReviewsSection from "../Component/Reviews/ReviewsSection.jsx";

function ViewCard() {
  let navigate = useNavigate();
  let { cardDetails: contextCardDetails, setCardDetails } = useContext(listingDataContext);
  let cardDetails =
    contextCardDetails ||
    (() => {
      try {
        let saved = localStorage.getItem("cardDetails");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

  useEffect(() => {
    if (!contextCardDetails && cardDetails && setCardDetails) {
      setCardDetails(cardDetails);
    }
  }, [contextCardDetails, cardDetails, setCardDetails]);

  let { userData } = useContext(userDataContext);
  let [updatePopUp, setUpdatePopUp] = useState(false);
  let [bookingPopUp, setBookingPopUp] = useState(false);
  let [title, setTitle] = useState(cardDetails?.title || "");
  let [description, setDescription] = useState(cardDetails?.description || "");
  let [backEndImage1, setBackEndImage1] = useState(null);
  let [backEndImage2, setBackEndImage2] = useState(null);
  let [backEndImage3, setBackEndImage3] = useState(null);
  let [rent, setRent] = useState(cardDetails?.rent || "");
  let [city, setCity] = useState(cardDetails?.city || "");
  let [landmark, setLandmark] = useState(cardDetails?.landmark || "");
  let [category, setCategory] = useState("");
  let { serverUrl } = useContext(authDataContext);
  let [deleting, setDeleting] = useState(false);
  let { updating, setUpdating } = useContext(listingDataContext);
  let [minDate, setMinDate] = useState();

  // Availability & Overlap validation states
  const [bookedRanges, setBookedRanges] = useState([]);
  const [hasDateConflict, setHasDateConflict] = useState(false);

  let {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    total,
    setTotal,
    night,
    setNight,
    handleBooking,
    booking,
  } = useContext(bookingDataContext);

  // Fetch booked date ranges for overlap validation
  useEffect(() => {
    if (!cardDetails?._id || !serverUrl) return;
    axios
      .get(`${serverUrl}/api/booking/dates/${cardDetails._id}`)
      .then((res) => {
        if (res.data?.bookedDates) {
          setBookedRanges(res.data.bookedDates);
        }
      })
      .catch(() => {});
  }, [cardDetails?._id, serverUrl]);

  // Check if selected checkIn / checkOut overlaps any booked intervals
  useEffect(() => {
    if (!checkIn || !checkOut || bookedRanges.length === 0) {
      setHasDateConflict(false);
      return;
    }
    const reqIn = new Date(checkIn).getTime();
    const reqOut = new Date(checkOut).getTime();

    const conflict = bookedRanges.some((b) => {
      const bIn = new Date(b.checkIn).getTime();
      const bOut = new Date(b.checkOut).getTime();
      return reqIn < bOut && reqOut > bIn;
    });

    setHasDateConflict(conflict);
  }, [checkIn, checkOut, bookedRanges]);

  useEffect(() => {
    if (checkIn && checkOut && cardDetails?.rent) {
      let inDate = new Date(checkIn);
      let outDate = new Date(checkOut);
      let n = (outDate - inDate) / (24 * 60 * 60 * 1000);
      setNight(n);
      let airBnbCharge = cardDetails.rent * (7 / 100);
      let tax = cardDetails.rent * (7 / 100);

      if (n > 0) {
        setTotal(cardDetails.rent * n + airBnbCharge + tax);
      } else {
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, cardDetails, rent]);

  const handleUpdateListing = async () => {
    setUpdating(true);
    try {
      let formData = new FormData();
      formData.append("title", title);
      if (backEndImage1) formData.append("image1", backEndImage1);
      if (backEndImage2) formData.append("image2", backEndImage2);
      if (backEndImage3) formData.append("image3", backEndImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);

      let result = await axios.post(
        serverUrl + `/api/listing/update/${cardDetails._id}`,
        formData,
        { withCredentials: true }
      );
      setUpdating(false);
      toast.success("Listing Updated");
      navigate("/");
      setTitle("");
      setDescription("");
      setBackEndImage1(null);
      setBackEndImage2(null);
      setBackEndImage3(null);
      setRent("");
      setCity("");
      setLandmark("");
      setCategory("");
    } catch (error) {
      setUpdating(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update listing");
    }
  };

  const handleDeleteListing = async () => {
    setDeleting(true);
    try {
      await axios.delete(serverUrl + `/api/listing/delete/${cardDetails._id}`, {
        withCredentials: true,
      });
      navigate("/");
      toast.success("Listing deleted");
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  const handleImage1 = (e) => setBackEndImage1(e.target.files[0]);
  const handleImage2 = (e) => setBackEndImage2(e.target.files[0]);
  const handleImage3 = (e) => setBackEndImage3(e.target.files[0]);

  useEffect(() => {
    let today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  if (!cardDetails) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-700 font-semibold">No listing selected</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-medium shadow-md hover:bg-rose-600 transition"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="w-[100%] min-h-[100vh] bg-white flex items-center justify-start gap-[10px] flex-col overflow-auto relative pb-[60px]">
      {/* Back button */}
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center z-10"
        onClick={() => navigate("/")}
      >
        <FaLongArrowAltLeft className="w-[25px] h-[25px] text-[white]" />
      </div>

      <div className="w-[95%] flex items-start justify-start text-[25px] md:w-[80%] mb-[10px] mt-[80px] md:mt-[40px]">
        <h1 className="text-[20px] text-[#272727] md:text-[30px] text-ellipsis text-nowrap overflow-hidden px-[30px] md:px-[0px]">
          {`In ${cardDetails.landmark?.toUpperCase() || ""}, ${cardDetails.city?.toUpperCase() || ""}`}
        </h1>
      </div>

      {/* Images preview */}
      <div className="w-[95%] h-[400px] flex items-center justify-center flex-col md:w-[80%] md:flex-row rounded-2xl overflow-hidden shadow-sm">
        <div className="w-[100%] h-[65%] md:w-[70%] md:h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
          <img src={cardDetails.image1} alt="" className="w-[100%] h-[100%] object-cover" />
        </div>
        <div className="w-[100%] h-[30%] flex items-center justify-center md:w-[30%] md:h-[100%] md:flex-col">
          <div className="w-[100%] h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
            <img src={cardDetails.image2} alt="" className="w-[100%] h-[100%] object-cover" />
          </div>
          <div className="w-[100%] h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
            <img src={cardDetails.image3} alt="" className="w-[100%] h-[100%] object-cover" />
          </div>
        </div>
      </div>

      {/* Title & Info */}
      <div className="w-[95%] flex items-center justify-start text-[18px] md:w-[80%] md:text-[25px] font-semibold mt-2">
        {`${cardDetails.title?.toUpperCase() || ""} • ${cardDetails.category?.toUpperCase() || ""}`}
      </div>
      <div className="w-[95%] flex items-center justify-start text-[15px] md:w-[80%] md:text-[18px] text-gray-700 leading-relaxed">
        {cardDetails.description || ""}
      </div>
      <div className="w-[95%] flex items-center justify-between text-[18px] md:w-[80%] md:text-[25px] border-b border-gray-100 pb-4">
        <div>
          <span className="font-bold text-gray-900">₹{Number(cardDetails.rent || 0).toLocaleString()}</span>
          <span className="text-sm text-gray-500 font-normal"> / night</span>
        </div>
        <div className="flex items-center gap-1.5 text-base font-semibold text-gray-800">
          <FaStar className="text-amber-500" />
          <span>{cardDetails.rating ? Number(cardDetails.rating).toFixed(2) : "4.90"}</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="w-[95%] md:w-[80%] flex items-center justify-start mt-2">
        {cardDetails.host === userData?._id ? (
          <button
            className="px-[30px] py-[10px] bg-neutral-900 hover:bg-black text-white text-[16px] md:px-[60px] rounded-xl font-semibold shadow-md transition cursor-pointer"
            onClick={() => setUpdatePopUp((prev) => !prev)}
          >
            Edit Listing
          </button>
        ) : (
          <button
            className="px-[30px] py-[12px] bg-[#FF385C] hover:bg-[#E00B41] text-white text-[17px] md:px-[70px] rounded-xl font-bold shadow-md transition cursor-pointer"
            onClick={() => setBookingPopUp((prev) => !prev)}
          >
            Reserve Now
          </button>
        )}
      </div>

      {/* Where you'll be Section (Leaflet Map) */}
      <div className="w-[95%] md:w-[80%] my-8 border-t border-gray-200 pt-8 flex flex-col items-start justify-start gap-2">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#272727]">
          Where you&apos;ll be
        </h2>
        <p className="text-[16px] md:text-[18px] text-gray-600 mb-2">
          {cardDetails.landmark}, {cardDetails.city}
        </p>
        <div className="w-full h-[380px] md:h-[450px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <AirbnbLeafletMap singleListing={cardDetails} height="100%" />
        </div>
      </div>

      {/* ── Reviews & Ratings Section (Module 4) ── */}
      {cardDetails._id && (
        <ReviewsSection
          listingId={cardDetails._id}
          currentRating={cardDetails.rating}
          onRatingUpdated={(newRating) =>
            setCardDetails((prev) => ({ ...prev, rating: newRating }))
          }
        />
      )}

      {/* Footer */}
      <div className="w-full mt-10">
        <Footer />
      </div>

      {/* ── UPDATE LISTING MODAL ── */}
      {updatePopUp && (
        <div className="w-[100%] h-[100%] flex items-center justify-center bg-[#000000a9] fixed top-0 left-0 z-[100] backdrop-blur-sm">
          <RxCross2
            className="w-[40px] h-[40px] bg-[red] text-white cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center p-2"
            onClick={() => setUpdatePopUp(false)}
          />
          <form
            className="max-w-[700px] w-[90%] max-h-[85vh] flex items-center justify-start flex-col gap-[15px] overflow-auto text-white bg-[#272727] p-[25px] rounded-2xl shadow-2xl relative"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateListing();
            }}
          >
            <div className="w-full pb-3 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Update Property Details</h2>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                type="text"
                id="title"
                className="w-full h-[40px] bg-neutral-800 border border-neutral-600 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-rose-500"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-600 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-sm font-medium">Nightly Rent (₹)</label>
                <input
                  type="number"
                  required
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className="w-full h-[40px] bg-neutral-800 border border-neutral-600 rounded-lg px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-[40px] bg-neutral-800 border border-neutral-600 rounded-lg px-3 text-sm text-white"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              <label className="text-sm font-medium">Update Images (Optional)</label>
              <input type="file" onChange={handleImage1} className="text-xs text-gray-300" />
              <input type="file" onChange={handleImage2} className="text-xs text-gray-300" />
              <input type="file" onChange={handleImage3} className="text-xs text-gray-300" />
            </div>

            <div className="w-full flex items-center justify-between pt-4 border-t border-neutral-700">
              <button
                type="button"
                onClick={handleDeleteListing}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-semibold cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete Listing"}
              </button>
              <button
                type="submit"
                disabled={updating}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs px-6 py-2 rounded-lg font-semibold cursor-pointer"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── BOOKING MODAL (WITH OVERLAP VALIDATION) ── */}
      {bookingPopUp && (
        <div className="w-[100%] h-[100%] flex items-center justify-center bg-[#000000a9] fixed top-0 left-0 z-[100] backdrop-blur-sm">
          <RxCross2
            className="w-[40px] h-[40px] bg-[red] text-white cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center p-2"
            onClick={() => setBookingPopUp(false)}
          />

          <div className="max-w-[950px] w-[92%] max-h-[90vh] bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 overflow-y-auto shadow-2xl relative">
            {/* Left: Date Selection Form */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Confirm and Pay</h3>
                <p className="text-xs text-gray-500 mb-6">Select your trip dates to view complete breakdown</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-rose-500">
                    <label htmlFor="checkIn" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Check-In
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      id="checkIn"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none mt-1"
                    />
                  </div>

                  <div className="border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-rose-500">
                    <label htmlFor="checkOut" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      min={checkIn || minDate}
                      id="checkOut"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none mt-1"
                    />
                  </div>
                </div>

                {/* Date Conflict Alert (Module 3) */}
                {hasDateConflict && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <span className="font-bold">⚠️ Notice:</span>
                    <span>This property is already reserved for these dates. Please choose an alternative timeframe.</span>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={booking || hasDateConflict || !checkIn || !checkOut || night <= 0}
                  onClick={(e) => {
                    e.preventDefault();
                    handleBooking(cardDetails._id);
                  }}
                  className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-base font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {booking ? "Reserving Stay..." : "Confirm & Reserve"}
                </button>
              </div>
            </div>

            {/* Right: Booking Summary Receipt Card */}
            <div className="w-full md:w-[360px] bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex gap-3 pb-4 border-b border-gray-200">
                <img
                  src={cardDetails.image1}
                  alt={cardDetails.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{cardDetails.title}</h4>
                  <p className="text-xs text-gray-500">{cardDetails.landmark}, {cardDetails.city}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-800 font-semibold mt-1">
                    <FaStar className="text-amber-500 text-[11px]" />
                    <span>{cardDetails.rating ? Number(cardDetails.rating).toFixed(2) : "4.90"}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>₹{Number(cardDetails.rent).toLocaleString()} × {night > 0 ? night : 0} nights</span>
                  <span className="font-medium">₹{Number(cardDetails.rent * (night > 0 ? night : 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Airbnb Service Fee (7%)</span>
                  <span>₹{Number((cardDetails.rent * 0.07).toFixed(0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Taxes (7%)</span>
                  <span>₹{Number((cardDetails.rent * 0.07).toFixed(0)).toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Amount (INR)</span>
                <span className="text-base text-rose-600 font-extrabold">₹{Number(total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCard;
