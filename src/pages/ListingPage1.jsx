import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";
import { FiUploadCloud, FiArrowLeft, FiArrowRight, FiCheck, FiMapPin, FiHome, FiDollarSign, FiImage } from "react-icons/fi";
import logo from "../assets/logo.png";

const STEPS = [
  { id: 1, label: "Details", icon: <FiHome /> },
  { id: 2, label: "Category", icon: <FiMapPin /> },
  { id: 3, label: "Preview", icon: <FiCheck /> },
];

function ImageDropZone({ label, preview, onChange, id, required }) {
  const [drag, setDrag] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
      <label
        htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const file = e.dataTransfer.files[0];
          if (file) onChange({ target: { files: [file] } });
        }}
        className={`relative flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${drag ? "border-[#FF385C] bg-rose-50 scale-[1.01]" : preview ? "border-transparent" : "border-gray-200 hover:border-[#FF385C] hover:bg-rose-50"}`}
        style={{ minHeight: "140px" }}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-[140px] object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center text-xl">
              <FiUploadCloud />
            </div>
            <p className="text-sm font-medium text-gray-600">Drop photo here or <span className="text-[#FF385C] font-semibold">browse</span></p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB</p>
          </div>
        )}
        <input type="file" id={id} className="sr-only" accept="image/*" required={required} onChange={onChange} />
      </label>
    </div>
  );
}

function ListingPage1() {
  const navigate = useNavigate();
  const {
    title, setTitle,
    description, setDescription,
    frontEndImage1, setFrontEndImage1,
    frontEndImage2, setFrontEndImage2,
    frontEndImage3, setFrontEndImage3,
    backEndImage1, setBackEndImage1,
    backEndImage2, setBackEndImage2,
    backEndImage3, setBackEndImage3,
    rent, setRent,
    city, setCity,
    landmark, setLandmark,
  } = useContext(listingDataContext);

  const handleImage1 = (e) => { const f = e.target.files[0]; if (f) { setBackEndImage1(f); setFrontEndImage1(URL.createObjectURL(f)); } };
  const handleImage2 = (e) => { const f = e.target.files[0]; if (f) { setBackEndImage2(f); setFrontEndImage2(URL.createObjectURL(f)); } };
  const handleImage3 = (e) => { const f = e.target.files[0]; if (f) { setBackEndImage3(f); setFrontEndImage3(URL.createObjectURL(f)); } };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full bg-[red] hover:bg-[#d00] flex items-center justify-center text-white transition cursor-pointer shadow-sm active:scale-95"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <FiArrowLeft size={18} />
            </button>
            <img src={logo} alt="Airbnb" className="w-[85px] sm:w-[100px] cursor-pointer" onClick={() => navigate("/")} />
          </div>
          {/* Step Indicators */}
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                  ${step.id === 1 ? "bg-[#FF385C] text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-6 h-px ${step.id < 1 ? "bg-[#FF385C]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/")} className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline cursor-pointer transition">
            Save &amp; exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-widest mb-2">Step 1 of 3</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Tell us about your place</h1>
            <p className="text-gray-500 mt-2 text-base">Share some basic info, then we'll add details about amenities and next steps.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); navigate("/listingPage2"); }}
            className="flex flex-col gap-6"
          >
            {/* Title & Description */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><FiHome className="text-rose-500" /> Property Info</h2>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-sm font-semibold text-gray-700">Listing Title</label>
                <input
                  type="text" id="title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-rose-100 transition placeholder-gray-300 bg-gray-50"
                  placeholder="e.g., 3BHK Sea-View Villa in Goa"
                  required value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  id="description" rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-rose-100 transition placeholder-gray-300 bg-gray-50 resize-none"
                  placeholder="Describe what makes your space special…"
                  required value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><FiMapPin className="text-rose-500" /> Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-sm font-semibold text-gray-700">City</label>
                  <input
                    type="text" id="city"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-rose-100 transition placeholder-gray-300 bg-gray-50"
                    placeholder="e.g., Mumbai"
                    required value={city} onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="landmark" className="text-sm font-semibold text-gray-700">Landmark / Area</label>
                  <input
                    type="text" id="landmark"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-rose-100 transition placeholder-gray-300 bg-gray-50"
                    placeholder="e.g., Near Gateway of India"
                    required value={landmark} onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><FiDollarSign className="text-rose-500" /> Pricing</h2>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rent" className="text-sm font-semibold text-gray-700">Price per night (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                  <input
                    type="number" id="rent"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-[15px] outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-rose-100 transition placeholder-gray-300 bg-gray-50"
                    placeholder="2500"
                    required value={rent} onChange={(e) => setRent(e.target.value)}
                    min={1}
                  />
                </div>
                {rent > 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <FiCheck /> Estimated monthly: ₹{(Number(rent) * 30).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><FiImage className="text-rose-500" /> Photos</h2>
              <p className="text-xs text-gray-500 -mt-2">Upload at least 3 high-quality photos. Great photos attract more guests!</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ImageDropZone label="Cover Photo" preview={frontEndImage1} onChange={handleImage1} id="img1" required />
                <ImageDropZone label="Photo 2" preview={frontEndImage2} onChange={handleImage2} id="img2" required />
                <ImageDropZone label="Photo 3" preview={frontEndImage3} onChange={handleImage3} id="img3" required />
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between gap-4 pt-4 pb-12">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 hover:text-black py-2.5 px-3 rounded-xl hover:bg-gray-100 transition cursor-pointer active:scale-95"
              >
                <FiArrowLeft size={18} /> Back
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Next</span> <FiArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ListingPage1;
