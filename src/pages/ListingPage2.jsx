import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdVilla } from "react-icons/md";
import { GiGreenhouse } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { MdBedroomParent, MdCabin, MdOutlineBed } from "react-icons/md";
import { BsBuildingAdd, BsShopWindow } from "react-icons/bs";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import { listingDataContext } from "../context/ListingContext";
import logo from "../assets/logo.png";

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Category" },
  { id: 3, label: "Preview" },
];

const CATEGORIES = [
  {
    id: "villa",
    label: "Villa",
    icon: <MdVilla size={32} />,
    desc: "Luxury private villa with exclusive amenities",
    emoji: "🏖️",
  },
  {
    id: "farm house",
    label: "Farm House",
    icon: <GiGreenhouse size={32} />,
    desc: "Serene rural getaway surrounded by nature",
    emoji: "🌾",
  },
  {
    id: "pool house",
    label: "Pool House",
    icon: <FaHouseFloodWater size={32} />,
    desc: "Private pool included for a refreshing stay",
    emoji: "🏊",
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: <MdBedroomParent size={32} />,
    desc: "Comfortable furnished rooms for short stays",
    emoji: "🛏️",
  },
  {
    id: "flat",
    label: "Flat",
    icon: <BsBuildingAdd size={32} />,
    desc: "Modern apartment in the heart of the city",
    emoji: "🏙️",
  },
  {
    id: "pg",
    label: "PG",
    icon: <MdOutlineBed size={32} />,
    desc: "Affordable paying guest accommodation",
    emoji: "🏘️",
  },
  {
    id: "cabin",
    label: "Cabin",
    icon: <MdCabin size={32} />,
    desc: "Cozy cabin retreat in the mountains or forest",
    emoji: "🏔️",
  },
  {
    id: "shop",
    label: "Shops",
    icon: <BsShopWindow size={32} />,
    desc: "Commercial space or retail property",
    emoji: "🏪",
  },
];

function ListingPage2() {
  const navigate = useNavigate();
  const { category, setCategory } = useContext(listingDataContext);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/listingpage1")}
              className="w-9 h-9 rounded-full bg-[red] hover:bg-[#d00] flex items-center justify-center text-white transition cursor-pointer shadow-sm active:scale-95"
              title="Back to Step 1"
              aria-label="Back to Step 1"
            >
              <FiArrowLeft size={18} />
            </button>
            <img src={logo} alt="Airbnb" className="w-[85px] sm:w-[100px] cursor-pointer" onClick={() => navigate("/")} />
          </div>
          {/* Steps */}
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                  ${step.id < 2 ? "bg-gray-900 text-white" : step.id === 2 ? "bg-[#FF385C] text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>
                  {step.id < 2 ? <FiCheck /> : <span>{step.id}</span>}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px ${step.id < 2 ? "bg-gray-900" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/")} className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline cursor-pointer transition">
            Save &amp; exit
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-widest mb-2">Step 2 of 3</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">What type of place is this?</h1>
            <p className="text-gray-500 mt-2 text-base">Pick the category that best describes your property so guests can find you easily.</p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {CATEGORIES.map((cat) => {
              const isSelected =
                category === cat.id ||
                (category || "").toLowerCase().replace(/[\s_-]+/g, "") === cat.id.replace(/[\s_-]+/g, "");
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`group relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "border-[#FF385C] bg-rose-50 shadow-md scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#FF385C] text-white rounded-full flex items-center justify-center text-xs">
                      <FiCheck />
                    </span>
                  )}
                  <span className={`text-3xl ${isSelected ? "scale-110 transition-transform" : "group-hover:scale-105 transition-transform"}`}>
                    {cat.emoji}
                  </span>
                  <div className={`text-sm font-bold ${isSelected ? "text-[#FF385C]" : "text-gray-800"}`}>{cat.label}</div>
                  <p className="text-[11px] text-gray-400 leading-snug hidden sm:block">{cat.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Footer Nav */}
          <div className="flex items-center justify-between gap-4 pt-6 pb-12">
            <button
              type="button"
              onClick={() => navigate("/listingpage1")}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 hover:text-black py-2.5 px-3 rounded-xl hover:bg-gray-100 transition cursor-pointer active:scale-95"
            >
              <FiArrowLeft size={18} /> Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/listingpage3")}
              disabled={!category}
              className={`flex items-center gap-2 font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer active:scale-95
                ${category
                  ? "bg-[#FF385C] hover:bg-[#E31C5F] text-white hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
            >
              <span>Next</span> <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListingPage2;
