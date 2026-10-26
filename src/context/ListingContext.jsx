import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dummyListings } from "../data/dummyListings";

export const listingDataContext = createContext();

function ListingContext({ children }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontEndImage1, setFrontEndImage1] = useState(null);
  const [frontEndImage2, setFrontEndImage2] = useState(null);
  const [frontEndImage3, setFrontEndImage3] = useState(null);
  const [backEndImage1, setBackEndImage1] = useState(null);
  const [backEndImage2, setBackEndImage2] = useState(null);
  const [backEndImage3, setBackEndImage3] = useState(null);
  const [rent, setRent] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Initialize with dummy listings so the website is immediately full of rich content
  const [listingData, setListingData] = useState(dummyListings);
  const [newListData, setNewListData] = useState(dummyListings);

  const { serverUrl } = useContext(authDataContext);

  const [cardDetails, setCardDetails] = useState(() => {
    try {
      const saved = localStorage.getItem("cardDetails");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    if (cardDetails) {
      localStorage.setItem("cardDetails", JSON.stringify(cardDetails));
    }
  }, [cardDetails]);

  const handleAddListing = async () => {
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image1", backEndImage1);
      formData.append("image2", backEndImage2);
      formData.append("image3", backEndImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);

      const result = await axios.post(serverUrl + "/api/listing/add", formData, {
        withCredentials: true,
      });
      console.log(result);
      setAdding(false);
      navigate("/");
      toast.success("Listing added successfully");
      setTitle("");
      setDescription("");
      setFrontEndImage1(null);
      setFrontEndImage2(null);
      setFrontEndImage3(null);
      setBackEndImage1(null);
      setBackEndImage2(null);
      setBackEndImage3(null);
      setRent("");
      setCity("");
      setLandmark("");
      setCategory("");
    } catch (error) {
      setAdding(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to add listing");
    }
  };

  const handleViewCard = async (id) => {
    try {
      const result = await axios.get(
        serverUrl + `/api/listing/findlistingbyid/${id}`,
        { withCredentials: true },
      );
      if (result.data) {
        setCardDetails(result.data);
        localStorage.setItem("cardDetails", JSON.stringify(result.data));
        navigate("/viewcard");
        return;
      }
    } catch (error) {
      console.log("Could not fetch listing from backend, checking local listings:", error);
    }

    // Fallback to local / dummy listings
    const localMatch = [...(listingData || []), ...dummyListings].find(
      (item) => String(item._id) === String(id)
    );
    if (localMatch) {
      setCardDetails(localMatch);
      localStorage.setItem("cardDetails", JSON.stringify(localMatch));
      navigate("/viewcard");
    } else {
      toast.error("Listing details not found");
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setSearchData([]);
      setNewListData(listingData);
      return;
    }
    const cleanQuery = query.toLowerCase().trim();

    try {
      const result = await axios.get(
        serverUrl + `/api/listing/search?query=${encodeURIComponent(query)}`,
      );
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setSearchData(result.data);
        setNewListData(result.data);
        return;
      }
    } catch (error) {
      console.log("Backend search error, falling back to local filter:", error);
    }

    // Local search filter across title, city, landmark, category
    const filtered = (listingData || []).filter((item) =>
      (item.title || "").toLowerCase().includes(cleanQuery) ||
      (item.city || "").toLowerCase().includes(cleanQuery) ||
      (item.landmark || "").toLowerCase().includes(cleanQuery) ||
      (item.category || "").toLowerCase().includes(cleanQuery)
    );
    setSearchData(filtered);
    setNewListData(filtered);
  };

  const getListing = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/listing/get", {
        withCredentials: true,
      });
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Merge real backend listings with dummy listings so the app stays populated
        const realIds = new Set(result.data.map((r) => String(r._id)));
        const nonDuplicateDummies = dummyListings.filter((d) => !realIds.has(String(d._id)));
        const combined = [...result.data, ...nonDuplicateDummies];
        setListingData(combined);
        setNewListData(combined);
      } else {
        setListingData(dummyListings);
        setNewListData(dummyListings);
      }
    } catch (error) {
      console.log("Could not load backend listings, using dummy listings fallback:", error);
      setListingData(dummyListings);
      setNewListData(dummyListings);
    }
  };

  useEffect(() => {
    getListing();
  }, [serverUrl, adding, updating, deleting]);

  const value = {
    title,
    setTitle,
    description,
    setDescription,
    frontEndImage1,
    setFrontEndImage1,
    frontEndImage2,
    setFrontEndImage2,
    frontEndImage3,
    setFrontEndImage3,
    backEndImage1,
    setBackEndImage1,
    backEndImage2,
    setBackEndImage2,
    backEndImage3,
    setBackEndImage3,
    rent,
    setRent,
    city,
    setCity,
    landmark,
    setLandmark,
    category,
    setCategory,
    handleAddListing,
    adding,
    setAdding,
    listingData,
    setListingData,
    getListing,
    newListData,
    setNewListData,
    handleViewCard,
    cardDetails,
    setCardDetails,
    updating,
    setUpdating,
    deleting,
    setDeleting,
    handleSearch,
    searchData,
    setSearchData,
  };

  return (
    <listingDataContext.Provider value={value}>
      {children}
    </listingDataContext.Provider>
  );
}

export default ListingContext;
