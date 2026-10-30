import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";
import { FiArrowLeft, FiCheck, FiMapPin, FiTag, FiDollarSign, FiFileText, FiLoader } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import logo from "../assets/logo.png";

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Category" },
  { id: 3, label: "Preview" },
];

function ListingPage3() {
  const navigate = useNavigate();
  const {
    title, description,
    frontEndImage1, frontEndImage2, frontEndImage3,
    rent, city, landmark, category,
    handleAddListing, adding,
  } = useContext(listingDataContext);

  const [activeImg, setActiveImg] = useState(0);
  const images = [frontEndImage1, frontEndImage2, frontEndImage3].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/listingpage2")}
              className="w-9 h-9 rounded-full bg-[red] hover:bg-[#d00] flex items-center justify-center text-white transition cursor-pointer shadow-sm active:scale-95"
              title="Back to Step 2"
              aria-label="Back to Step 2"
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
                  ${step.id < 3 ? "bg-gray-900 text-white" : "bg-[#FF385C] text-white shadow-md"}`}>
                  {step.id < 3 ? <FiCheck /> : <span>{step.id}</span>}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-900" />}
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
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-widest mb-2">Step 3 of 3</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Review your listing</h1>
            <p className="text-gray-500 mt-2 text-base">Here's what guests will see. Looks good? Go ahead and publish!</p>
          </div>

          {/* Preview Card – Airbnb Listing Style */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Image Gallery */}
            <div className="relative">
              {images.length > 0 ? (
                <>
                  <div className="w-full h-[280px] md:h-[380px] overflow-hidden bg-gray-100">
                    <img
                      src={images[activeImg]}
                      alt={title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  </div>
                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImg(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === activeImg ? "bg-white scale-125" : "bg-white/60 hover:bg-white/90"}`}
                        />
                      ))}
                    </div>
                  )}
                  {/* Thumbnails row */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImg(idx)}
                          className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${idx === activeImg ? "border-[#FF385C] shadow-md" : "border-transparent hover:border-gray-300"}`}
                        >
                          <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm">No photos uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="p-6 md:p-8">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3">
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-[#FF385C] text-xs font-bold rounded-full uppercase tracking-wider">
                    <FiTag size={11} /> {category}
                  </span>
                )}
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  <FaStar className="text-amber-400" /> <span>New listing</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1 leading-snug">{title || "Untitled Listing"}</h2>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
                <FiMapPin className="text-rose-400 flex-shrink-0" />
                <span>{landmark ? `${landmark}, ` : ""}{city || "Location not set"}</span>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* Description */}
              {description && (
                <div className="mb-5">
                  <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiFileText className="text-rose-400" /> Description
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
              )}

              <div className="h-px bg-gray-100 mb-5" />

              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">₹{Number(rent || 0).toLocaleString()}</span>
                <span className="text-gray-500 text-base">/ night</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Estimated monthly income: <span className="text-emerald-600 font-semibold">₹{(Number(rent || 0) * 30).toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-8">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-sm font-bold text-amber-800">Almost there!</p>
              <p className="text-xs text-amber-700 mt-0.5">Once you publish, guests can discover and book your property. You can edit details anytime from "My Listing".</p>
            </div>
          </div>

          {/* Footer Nav */}
          <div className="flex items-center justify-between gap-4 pt-4 pb-12">
            <button
              type="button"
              onClick={() => navigate("/listingpage2")}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 hover:text-black py-2.5 px-3 rounded-xl hover:bg-gray-100 transition cursor-pointer active:scale-95"
            >
              <FiArrowLeft size={18} /> Back
            </button>
            <button
              type="button"
              onClick={handleAddListing}
              disabled={adding}
              className={`flex items-center gap-2 font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer active:scale-95
                ${adding
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#FF385C] hover:bg-[#E31C5F] text-white hover:shadow-xl"
                }`}
            >
              {adding ? (
                <><FiLoader className="animate-spin" /> Publishing…</>
              ) : (
                <><FiCheck /> Publish Listing</>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListingPage3;
