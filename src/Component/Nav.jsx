import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle, FaHome, FaCalendarAlt, FaSignOutAlt, FaSignInAlt, FaStar, FaRobot } from "react-icons/fa";
import { MdWhatshot, MdVilla, MdBedroomParent, MdCabin, MdOutlineBed } from "react-icons/md";
import { GiGreenhouse } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { BsBuildingAdd, BsShopWindow } from "react-icons/bs";
import { IoClose, IoSparkles } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";

const CATEGORIES = [
  { id: "trending", label: "Trending", icon: <MdWhatshot className="w-[26px] h-[26px]" /> },
  { id: "villa", label: "Villa", icon: <MdVilla className="w-[26px] h-[26px]" /> },
  { id: "farm house", label: "Farm House", icon: <GiGreenhouse className="w-[26px] h-[26px]" /> },
  { id: "pool house", label: "Pool House", icon: <FaHouseFloodWater className="w-[26px] h-[26px]" /> },
  { id: "rooms", label: "Rooms", icon: <MdBedroomParent className="w-[26px] h-[26px]" /> },
  { id: "flat", label: "Flat", icon: <BsBuildingAdd className="w-[26px] h-[26px]" /> },
  { id: "pg", label: "PG", icon: <MdOutlineBed className="w-[26px] h-[26px]" /> },
  { id: "cabin", label: "Cabin", icon: <MdCabin className="w-[26px] h-[26px]" /> },
  { id: "shop", label: "Shops", icon: <BsShopWindow className="w-[26px] h-[26px]" /> },
];

function Nav() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeCategory, setActiveCategory] = useState("trending");
  const [input, setInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  const { listingData, setListingData, newListData, setNewListData, searchData, handleSearch, handleViewCard } =
    useContext(listingDataContext);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    handleSearch(input);
  }, [input]);

  const handleLogout = async () => {
    try {
      await axios.post(serverUrl + "/api/auth/logout", { withCredentials: true });
      setUserData(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      setShowPopup(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategory = (selectedCat) => {
    setActiveCategory(selectedCat);
    if (!selectedCat || selectedCat === "trending") {
      setNewListData(listingData);
    } else {
      const target = selectedCat.toLowerCase().replace(/[\s_-]+/g, "");
      setNewListData(
        listingData.filter(
          (list) => (list.category || "").toLowerCase().replace(/[\s_-]+/g, "") === target
        )
      );
    }
  };

  const handleClick = (id) => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
    setInput("");
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-white z-50">
      {/* ── Top Bar ── */}
      <div className="w-full border-b border-[#EBEBEB] px-5 md:px-10 flex items-center justify-between h-[80px]">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Airbnb" className="w-[110px] md:w-[130px]" />
        </div>

        {/* Search Bar – desktop */}
        <div className="hidden md:flex flex-1 max-w-[460px] mx-6 relative">
          <div
            className={`w-full flex items-center rounded-full border transition-all duration-200 bg-white overflow-hidden
              ${searchFocused ? "border-[#222] shadow-[0_4px_24px_rgba(0,0,0,0.12)]" : "border-[#DDDDDD] shadow-sm hover:shadow-md"}`}
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none px-5 py-3 text-[15px] text-gray-800 placeholder-gray-400"
              placeholder="Any Where  |  Any Location  |  Any City"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            {input && (
              <button onClick={() => setInput("")} className="px-2 text-gray-400 hover:text-gray-700 transition">
                <IoClose size={18} />
              </button>
            )}
            <button className="m-1.5 p-2.5 rounded-full bg-[#FF385C] hover:bg-[#E31C5F] text-white transition-colors flex-shrink-0">
              <FiSearch size={16} />
            </button>
          </div>

          {/* Search Dropdown */}
          {searchData?.length > 0 && (
            <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
              {searchData.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                  onMouseDown={() => handleClick(item._id)}
                >
                  <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <FiSearch size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.landmark}, {item.city}</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-gray-800">₹{Number(item.rent).toLocaleString()}<span className="font-normal text-gray-400">/night</span></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Ask AI Concierge button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-airbnb-concierge"))}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 rounded-full px-3.5 py-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
            title="Ask Airbnb AI Concierge"
          >
            <IoSparkles className="text-[#FF385C] text-sm animate-spin-slow" />
            <span className="text-[#FF385C] font-bold">Ask AI</span>
          </button>

          {/* List your home – text button */}
          <button
            className="hidden md:block text-[14px] font-semibold text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2.5 transition-colors cursor-pointer"
            onClick={() => navigate("/listingpage1")}
          >
            Airbnb your home
          </button>

          {/* Hamburger + Avatar */}
          <div className="relative" ref={popupRef}>
            <button
              className="flex items-center gap-2.5 border border-[#DDDDDD] rounded-full px-3 py-2 hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => setShowPopup((prev) => !prev)}
            >
              <GiHamburgerMenu className="text-gray-700" size={16} />
              {userData == null ? (
                <FaUserCircle className="text-gray-600" size={28} />
              ) : (
                <span className="w-[30px] h-[30px] bg-[#222] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showPopup && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-[240px] bg-white rounded-2xl shadow-[0_8px_36px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-50 py-2 animate-[fadeInDown_0.15s_ease]">
                {userData ? (
                  <>
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-[#222] text-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
                          {userData?.name?.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{userData.name}</p>
                          <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <MenuItem icon={<FaHome />} label="My Listing" onClick={() => { navigate("/mylisting"); setShowPopup(false); }} />
                      <MenuItem icon={<FaCalendarAlt />} label="My Bookings" onClick={() => { navigate("/mybooking"); setShowPopup(false); }} />
                      <MenuItem icon={<FaStar />} label="Airbnb your home" onClick={() => { navigate("/listingpage1"); setShowPopup(false); }} />
                      <MenuItem icon={<FaRobot />} label="Ask AI Concierge" onClick={() => { setShowPopup(false); window.dispatchEvent(new CustomEvent("open-airbnb-concierge")); }} />
                      <div className="my-1 h-px bg-gray-100 mx-3" />
                      <MenuItem icon={<FaSignOutAlt />} label="Log out" onClick={handleLogout} danger />
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <MenuItem icon={<FaSignInAlt />} label="Log in" onClick={() => { navigate("/login"); setShowPopup(false); }} bold />
                    <MenuItem label="Sign up" onClick={() => { navigate("/signup"); setShowPopup(false); }} />
                    <div className="my-1 h-px bg-gray-100 mx-3" />
                    <MenuItem label="Airbnb your home" onClick={() => { navigate("/listingpage1"); setShowPopup(false); }} />
                    <MenuItem icon={<FaRobot />} label="AI Concierge & Help" onClick={() => { setShowPopup(false); window.dispatchEvent(new CustomEvent("open-airbnb-concierge")); }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Search Bar ── */}
      <div className="md:hidden w-full px-5 py-2.5 border-b border-[#EBEBEB]">
        <div className="relative flex items-center bg-white rounded-full border border-[#DDDDDD] shadow-sm overflow-hidden">
          <input
            type="text"
            className="flex-1 outline-none px-5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 bg-transparent"
            placeholder="Any Where  |  Any Location  |  Any City"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input && (
            <button onClick={() => setInput("")} className="px-2 text-gray-400">
              <IoClose size={16} />
            </button>
          )}
          <button className="m-1.5 p-2 rounded-full bg-[#FF385C] text-white flex-shrink-0">
            <FiSearch size={14} />
          </button>
        </div>
        {/* Mobile search dropdown */}
        {searchData?.length > 0 && (
          <div className="mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {searchData.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0"
                onClick={() => handleClick(item._id)}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.landmark}, {item.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Category Filter Bar ── */}
      <div className="w-full bg-white overflow-x-auto pb-[10px]">
        <div className="flex items-center gap-1 px-5 md:px-10 min-w-max mx-auto md:justify-center pt-1">
          {CATEGORIES.map((cat) => {
            const isActive =
              activeCategory === cat.id ||
              (cat.id === "trending" && !activeCategory) ||
              (cat.id !== "trending" &&
                (activeCategory || "").replace(/[\s_-]+/g, "") === cat.id.replace(/[\s_-]+/g, ""));
            return (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`group flex flex-col items-center gap-1 px-4 py-3 cursor-pointer transition-all duration-150 relative flex-shrink-0 rounded-xl
                  ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
              >
                <span className={`transition-transform duration-150 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                  {cat.icon}
                </span>
                <span className="text-[11px] font-semibold whitespace-nowrap">{cat.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gray-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Reusable dropdown menu item
function MenuItem({ icon, label, onClick, danger = false, bold = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer
        ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"}
        ${bold ? "font-semibold" : "font-normal"}`}
    >
      {icon && <span className={`text-base flex-shrink-0 ${danger ? "text-red-400" : "text-gray-500"}`}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default Nav;
