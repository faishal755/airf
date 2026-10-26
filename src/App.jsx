import React, { useContext, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userDataContext } from "./context/UserContext";
import ChatBot from "./Component/ChatBot/ChatBot";

// Code splitting & dynamic imports (Module 5 performance optimization)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ListingPage1 = lazy(() => import("./pages/ListingPage1"));
const ListingPage2 = lazy(() => import("./pages/ListingPage2"));
const ListingPage3 = lazy(() => import("./pages/ListingPage3"));
const MyListing = lazy(() => import("./pages/MyListing"));
const ViewCard = lazy(() => import("./pages/ViewCard"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const Booked = lazy(() => import("./pages/Booked"));

// Airbnb-styled loading spinner
function RouteLoadingFallback() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-rose-100 border-t-[#FF385C] rounded-full animate-spin mb-3" />
      <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Loading Airbnb...</p>
    </div>
  );
}

function App() {
  let { userData } = useContext(userDataContext);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/ListingPage1"
            element={userData != null ? <ListingPage1 /> : <Navigate to={"/"} />}
          />
          <Route
            path="/ListingPage2"
            element={userData != null ? <ListingPage2 /> : <Navigate to={"/"} />}
          />
          <Route
            path="/ListingPage3"
            element={userData != null ? <ListingPage3 /> : <Navigate to={"/"} />}
          />
          <Route
            path="/MyListing"
            element={userData != null ? <MyListing /> : <Navigate to={"/"} />}
          />
          <Route
            path="/viewCard"
            element={userData != null ? <ViewCard /> : <Navigate to={"/"} />}
          />
          <Route
            path="/mybooking"
            element={userData != null ? <MyBooking /> : <Navigate to={"/"} />}
          />
          <Route
            path="/booked"
            element={userData != null ? <Booked /> : <Navigate to={"/"} />}
          />
        </Routes>
      </Suspense>
      <ChatBot />
    </div>
  );
}

export default App;
