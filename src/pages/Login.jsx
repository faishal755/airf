import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { userDataContext } from "../context/UserContext";
import logo from "../assets/logo.png";

function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { serverUrl, loading, setLoading } = useContext(authDataContext);
  const { setUserData } = useContext(userDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data);
      localStorage.setItem("userData", JSON.stringify(result.data));
      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
      }
      navigate("/");
      toast.success("Login successful");
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Red Back button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 sm:absolute sm:top-6 sm:left-6 w-11 h-11 rounded-full bg-[red] hover:bg-[#d00] active:scale-95 shadow-lg flex items-center justify-center text-white transition cursor-pointer"
        title="Back to Home"
        aria-label="Back to Home"
      >
        <FaLongArrowAltLeft className="w-5 h-5 text-white" />
      </button>

      {/* Main Form Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-10 my-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <img
            src={logo}
            alt="Airbnb"
            className="w-28 mb-4 cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("/")}
          />
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
            Welcome to Airbnb
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Log in to manage bookings and stays
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-base text-gray-900 placeholder:text-gray-400 transition"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative w-full">
              <input
                type={show ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-base text-gray-900 placeholder:text-gray-400 transition"
              />
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-1 cursor-pointer transition"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] hover:opacity-95 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">
            or
          </span>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#FF385C] font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
