import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { listingDataContext } from "./ListingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const bookingDataContext = createContext();

// Dynamic script loader for Razorpay checkout SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function BookingContext({ children }) {
  let [checkIn, setCheckIn] = useState("");
  let [checkOut, setCheckOut] = useState("");
  let [total, setTotal] = useState(0);
  let [night, setNight] = useState(0);
  let { serverUrl } = useContext(authDataContext);
  let { getCurrentUser, userData } = useContext(userDataContext);
  let { getListing } = useContext(listingDataContext);
  let [bookingData, setBookingData] = useState(null);
  let [booking, setBooking] = useState(false);
  let navigate = useNavigate();

  // Booking with Razorpay Payment Integration
  const handleBooking = async (id) => {
    // 1. Guard against demo/dummy listings
    if (String(id).startsWith("dummy_")) {
      toast.info(
        "📌 This is a demo listing — real bookings are not available for it.",
        { autoClose: 4000 }
      );
      return;
    }

    if (!checkIn || !checkOut || Number(total) <= 0) {
      toast.error("Please select valid check-in and check-out dates");
      return;
    }

    setBooking(true);
    try {
      // 2. Ensure Razorpay Checkout SDK is ready
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        toast.error("Unable to load Razorpay payment SDK. Please check your internet connection.");
        setBooking(false);
        return;
      }

      // 3. Create order on backend (with validation for dates & own listing)
      const orderRes = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        {
          amount: total,
          listingId: id,
          checkIn,
          checkOut,
        },
        { withCredentials: true }
      );

      const { order, keyId } = orderRes.data;

      // 4. Configure Razorpay modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Airbnb Stay Reservation",
        description: `Booking reservation (${night} night${night > 1 ? "s" : ""})`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 5. Verify payment signature on backend and confirm reservation
            const verifyRes = await axios.post(
              `${serverUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: {
                  listingId: id,
                  checkIn,
                  checkOut,
                  totalRent: total,
                },
              },
              { withCredentials: true }
            );

            if (verifyRes.data?.success) {
              await getCurrentUser();
              await getListing();
              setBookingData(verifyRes.data.booking);
              navigate("/booked");
              toast.success("Payment verified! Booking confirmed 🎉");
            }
          } catch (verifyError) {
            console.error("Verification failed:", verifyError);
            const verifyMsg =
              verifyError?.response?.data?.message ||
              verifyError?.message ||
              "Payment verification failed";
            toast.error(verifyMsg);
          } finally {
            setBooking(false);
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phone || "",
        },
        theme: {
          color: "#FF385C",
        },
        modal: {
          ondismiss: function () {
            setBooking(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setBooking(false);
        toast.error(`Payment failed: ${response?.error?.description || "Transaction failed"}`);
      });
      razorpayInstance.open();
    } catch (error) {
      setBooking(false);
      console.error("Booking creation error:", error);
      setBookingData([]);

      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string" ? error.response.data : "") ||
        error?.message ||
        "Booking failed";

      if (msg.toLowerCase().includes("token")) {
        toast.error("Please log in to complete your booking");
      } else {
        toast.error(msg);
      }
    }
  };

  const cancelBooking = async (id) => {
    try {
      let result = await axios.delete(serverUrl + `/api/booking/cancel/${id}`, {
        withCredentials: true,
      });
      await getCurrentUser();
      await getListing();
      console.log(result.data);
      toast.success("Booking Cancelled");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    }
  };

  let value = {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    total,
    setTotal,
    night,
    setNight,
    bookingData,
    setBookingData,
    handleBooking,
    cancelBooking,
    booking,
    setBooking,
  };

  return (
    <bookingDataContext.Provider value={value}>
      {children}
    </bookingDataContext.Provider>
  );
}

export default BookingContext;
