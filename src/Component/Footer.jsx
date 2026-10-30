import React, { useState, useContext } from "react";
import {
  FaGlobe,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaChevronDown,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";

export default function Footer() {
  const navigate = useNavigate();
  const { handleSearch } = useContext(listingDataContext) || {};
  const [activeTab, setActiveTab] = useState("popular");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (IN)");
  const [selectedCurrency, setSelectedCurrency] = useState("INR (₹)");

  const inspirationTabs = [
    { id: "popular", label: "Popular" },
    { id: "beach", label: "Beach Escapes" },
    { id: "mountains", label: "Mountains & Nature" },
    { id: "cities", label: "Iconic Cities" },
    { id: "unique", label: "Unique Stays" },
  ];

  const inspirationDestinations = {
    popular: [
      { name: "Goa", desc: "Beachfront villas & resorts", query: "goa" },
      { name: "Manali", desc: "Chic mountain chalets", query: "manali" },
      { name: "Mumbai", desc: "Luxury sea-facing flats", query: "mumbai" },
      { name: "Jaipur", desc: "Heritage havelis & palaces", query: "jaipur" },
      { name: "Bangalore", desc: "Modern urban studios", query: "bangalore" },
      { name: "Udaipur", desc: "Lakeside royal suites", query: "udaipur" },
      { name: "Delhi", desc: "Contemporary penthouses", query: "delhi" },
      { name: "Rishikesh", desc: "Serene riverfront retreats", query: "rishikesh" },
    ],
    beach: [
      { name: "North Goa", desc: "Party villas & beach shacks", query: "goa" },
      { name: "South Goa", desc: "Peaceful coastal havens", query: "goa" },
      { name: "Kochi", desc: "Backwater heritage homes", query: "kochi" },
      { name: "Pondicherry", desc: "French colonial bungalows", query: "pondicherry" },
      { name: "Alibaug", desc: "Private pool weekend villas", query: "alibaug" },
      { name: "Bali", desc: "Tropical luxury retreats", query: "bali" },
    ],
    mountains: [
      { name: "Shimla", desc: "Pine forest cottages", query: "shimla" },
      { name: "Mussoorie", desc: "Himalayan view stays", query: "mussoorie" },
      { name: "Ooty", desc: "Tea estate heritage stays", query: "ooty" },
      { name: "Kodaikanal", desc: "Misty hill chalets", query: "kodaikanal" },
      { name: "Leh Ladakh", desc: "High-altitude homestays", query: "leh" },
      { name: "Dharamshala", desc: "Quiet mountain lofts", query: "dharamshala" },
    ],
    cities: [
      { name: "Paris", desc: "Classic Haussmann lofts", query: "paris" },
      { name: "London", desc: "Historic townhouses", query: "london" },
      { name: "New York", desc: "Skyline view apartments", query: "new york" },
      { name: "Tokyo", desc: "Minimalist city pods", query: "tokyo" },
      { name: "Dubai", desc: "Futuristic marina towers", query: "dubai" },
      { name: "Singapore", desc: "Modern garden suites", query: "singapore" },
    ],
    unique: [
      { name: "Treehouses", desc: "Live among the forest canopy", query: "cabin" },
      { name: "Farmhouses", desc: "Rustic country getaways", query: "farm house" },
      { name: "Houseboats", desc: "Glide along peaceful waters", query: "kerala" },
      { name: "Cabins", desc: "Cozy timber wilderness nests", query: "cabin" },
      { name: "Pool Houses", desc: "Exclusive private splash stays", query: "pool house" },
      { name: "Heritage Haveli", desc: "Timeless artisanal architecture", query: "jaipur" },
    ],
  };

  const handleDestinationClick = (query) => {
    if (handleSearch) {
      handleSearch(query);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#f7f7f7] border-t border-gray-200 text-gray-700 font-sans mt-auto">
      {/* 1. Inspiration for future getaways Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 border-b border-gray-200">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">
          Inspiration for future getaways
        </h3>

        {/* Tabs Bar */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200 mb-6">
          {inspirationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm pb-3 font-medium whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-950 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of destinations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-4 gap-x-6">
          {inspirationDestinations[activeTab]?.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => handleDestinationClick(dest.query)}
              className="group cursor-pointer text-left"
              
            >
              <p className="text-sm font-semibold text-gray-900 group-hover:underline">
                {dest.name}
              </p>
              <p className="text-xs text-gray-500 truncate group-hover:text-gray-700">
                {dest.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main 4-Column Navigation Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-200 text-sm">
        {/* Column 1: Support */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-base">Support & Safety</h4>
          <ul className="space-y-3 text-gray-600">
            <li>
              <span className="hover:underline hover:text-gray-950 transition cursor-pointer">
                Help Centre
              </span>
            </li>
            <li>
              <span className="hover:underline hover:text-gray-950 transition cursor-pointer">
                AirCover Protection
              </span>
            </li>
            <li>
              <span className="hover:underline hover:text-gray-950 transition cursor-pointer">
                Safety Information
              </span>
            </li>
            <li>
              <a href="#disabilities" className="hover:underline hover:text-gray-950 transition">
                Supporting people with disabilities
              </a>
            </li>
            <li>
              <span className="hover:underline hover:text-gray-950 transition cursor-pointer">
                Flexible cancellation options
              </span>
            </li>
            <li>
              <a href="#concerns" className="hover:underline hover:text-gray-950 transition">
                Report a neighbourhood concern
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Community */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-base">Community</h4>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="#relief" className="hover:underline hover:text-gray-950 transition">
                Disaster relief housing
              </a>
            </li>
            <li>
              <a href="#diversity" className="hover:underline hover:text-gray-950 transition">
                Combating discrimination
              </a>
            </li>
            <li>
              <a href="#forum" className="hover:underline hover:text-gray-950 transition">
                Community forum & stories
              </a>
            </li>
            <li>
              <a href="#guest" className="hover:underline hover:text-gray-950 transition">
                Guest referral rewards
              </a>
            </li>
            <li>
              <a href="#events" className="hover:underline hover:text-gray-950 transition">
                Local meetup events
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Hosting */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-base">Hosting</h4>
          <ul className="space-y-3 text-gray-600">
            <li>
              <button
                onClick={() => navigate("/listingpage1")}
                className="hover:underline hover:text-gray-950 transition text-left"
              >
                List your home
              </button>
            </li>
            <li>
              <a href="#aircover-host" className="hover:underline hover:text-gray-950 transition">
                AirCover for Hosts
              </a>
            </li>
            <li>
              <a href="#resources" className="hover:underline hover:text-gray-950 transition">
                Hosting resources & guides
              </a>
            </li>
            <li>
              <a href="#responsible" className="hover:underline hover:text-gray-950 transition">
                Host responsibly
              </a>
            </li>
            <li>
              <a href="#community-host" className="hover:underline hover:text-gray-950 transition">
                Host community hub
              </a>
            </li>
            <li>
              <a href="#academy" className="hover:underline hover:text-gray-950 transition">
                Join a free hosting class
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: About */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-base">About Us</h4>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="#newsroom" className="hover:underline hover:text-gray-950 transition">
                Newsroom & press
              </a>
            </li>
            <li>
              <a href="#features" className="hover:underline hover:text-gray-950 transition">
                Learn about new features
              </a>
            </li>
            <li>
              <a href="#founders" className="hover:underline hover:text-gray-950 transition">
                Letter from our founders
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:underline hover:text-gray-950 transition">
                Careers & opportunities
              </a>
            </li>
            <li>
              <a href="#investors" className="hover:underline hover:text-gray-950 transition">
                Investors
              </a>
            </li>
            <li>
              <a href="#giftcards" className="hover:underline hover:text-gray-950 transition">
                Gift cards & vouchers
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal, Language/Currency & Social Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        {/* Left: Copyright & Legal */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
          <span>&copy; {new Date().getFullYear()} Stays & Homes, Inc.</span>
          <span>&middot;</span>
          <a href="#privacy" className="hover:underline hover:text-gray-900">
            Privacy
          </a>
          <span>&middot;</span>
          <a href="#terms" className="hover:underline hover:text-gray-900">
            Terms
          </a>
          <span>&middot;</span>
          <a href="#sitemap" className="hover:underline hover:text-gray-900">
            Sitemap
          </a>
          <span>&middot;</span>
          <a href="#company" className="hover:underline hover:text-gray-900">
            Company details
          </a>
          <span className="hidden lg:inline">&middot;</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-rose-500">
            Made with <FaHeart className="text-xs" /> for travelers
          </span>
        </div>

        {/* Right: Language, Currency & Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-gray-800">
          {/* Language Selector */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center gap-2 hover:underline hover:text-black cursor-pointer transition"
          >
            <FaGlobe className="text-base text-gray-700" />
            <span>{selectedLanguage}</span>
          </button>

          {/* Currency Selector */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center gap-1 hover:underline hover:text-black cursor-pointer transition"
          >
            <span>{selectedCurrency}</span>
          </button>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5 text-gray-700 ml-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-blue-600 transition shadow-sm"
            >
              <FaFacebookF className="text-xs" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-sky-500 transition shadow-sm"
            >
              <FaTwitter className="text-xs" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-rose-500 transition shadow-sm"
            >
              <FaInstagram className="text-xs" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-blue-700 transition shadow-sm"
            >
              <FaLinkedinIn className="text-xs" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-gray-950 transition shadow-sm"
            >
              <FaGithub className="text-xs" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Language & Currency Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Language and Currency Settings
            </h3>

            {/* Language Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Suggested Languages
              </label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "English (IN)",
                  "English (US)",
                  "English (UK)",
                  "Hindi (हिन्दी)",
                  "French (Français)",
                  "Spanish (Español)",
                ].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-2 rounded-xl text-left border transition ${
                      selectedLanguage === lang
                        ? "border-rose-500 bg-rose-50 text-rose-600 font-semibold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { code: "INR (₹)", name: "Indian Rupee" },
                  { code: "USD ($)", name: "United States Dollar" },
                  { code: "EUR (€)", name: "Euro" },
                  { code: "GBP (£)", name: "British Pound" },
                  { code: "AED (د.إ)", name: "Emirati Dirham" },
                  { code: "JPY (¥)", name: "Japanese Yen" },
                ].map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`px-3 py-2 rounded-xl text-left border transition ${
                      selectedCurrency === curr.code
                        ? "border-rose-500 bg-rose-50 text-rose-600 font-semibold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <p className="font-medium">{curr.code}</p>
                    <p className="text-xs text-gray-500">{curr.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowLanguageModal(false)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition text-sm shadow-md"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
