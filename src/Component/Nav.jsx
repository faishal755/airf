import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { MdWhatshot } from "react-icons/md";
import { MdVilla } from "react-icons/md";
import { GiGreenhouse } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { MdBedroomParent } from "react-icons/md";
import { BsBuildingAdd } from "react-icons/bs";
import { MdOutlineBed } from "react-icons/md";
import { MdCabin } from "react-icons/md";
import { BsShopWindow } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";

function Nav() {
  let [showpopup, setShowpopup] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);
  let [category, setCategory] = useState();
  let {
    listingData,
    setListingData,
    newListData,
    setNewListData,
    searchData,
    handleSearch,
    handleViewCard,
  } = useContext(listingDataContext);
  let [input, setInput] = useState("");

  const handleLogout = async () => {
    try {
      let result = await axios.post(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCategory = async (category) => {
    setCategory(category);
    if (category == "trending") {
      setNewListData(listingData);
    } else {
      setNewListData(listingData.filter((list) => list.category == category));
    }
  };
  const handleClick = (id) => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    handleSearch(input);
  }, [input]);
  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm ">
      <div
        className="w-[100vw] min-h-[80px]  border-b-[1px] border-[#dcdcdc]
         px-[20px] flex items-center justify-between md:px-[40px]"
      >
        <div>
          <img src={logo} alt="" className="w-[130px] " />
        </div>
        <div className="w-[35%] relative hidden md:block">
          <input
            type="text"
            className="w-[100%] px-[30px] py-[10px] border-[2px] 
                border-[#bdbaba] outline-none overflow-auto rounded-[30px] text-[17px]"
            placeholder="Any Where  |  Any Location  |  Any City"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button className="absolute p-[10px] rounded-[50px] bg-[red] right-[3%] top-[4.5px]">
            <FiSearch className="w-[20px] h-[20px] text-[white]" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-[10px] rounded-[30px] hover:bg-[#ded9d9] relative">
          <span
            className="text-[18px] cursor-pointer rounded-[50px] hover:bg-[#ded9d9] px-[8px] 
                py-[5px] hidden md:block"
            onClick={() => navigate("/listingpage1")}
          >
            List your Home
          </span>
          <button
            className="px-[20px] py-[10px] flex items-center justify-center gap-[5px] 
                border-[1px] border-[#8d8c8c] rounded-[50px] hover:shadow-lg mr-2 "
            onClick={() => setShowpopup((prev) => !prev)}
          >
            <span>
              <GiHamburgerMenu className="w-[20px] h-[20px]" />
            </span>

            {userData == null && (
              <span>
                <FaUserCircle className="w-[23px] h-[23px]" />
              </span>
            )}

            {userData != null && (
              <span
                className="w-[30px] h-[30px] bg-[#080808] text-[white]
             rounded-full flex items-center justify-center"
              >
                {userData?.name.slice(0, 1)}
              </span>
            )}
          </button>
          {showpopup && (
            <div
              className="w-[220px] h-[250px] absolute bg-slate-50 top-[110%] right-[3%] 
          border-[1px] border-[#aaa9a9] z-10 rounded-lg md:right-[10%]"
            >
              <ul
                className="w-[100%] h-[100%] text-[17px] flex items-start justify-around 
            flex-col py-[10px]"
              >
                {!userData && (
                  <li
                    className="w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer"
                    onClick={() => {
                      navigate("/login");
                      setShowpopup(false);
                    }}
                  >
                    Login
                  </li>
                )}
                {userData && (
                  <li
                    className="w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setShowpopup(false);
                    }}
                  >
                    Logout
                  </li>
                )}
                <div className="w-[100%] h-[1px] bg-[#c1c0c0]"></div>
                <li
                  className="w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer"
                  onClick={() => {
                    navigate("/listingpage1");
                    setShowpopup(false);
                  }}
                >
                  List your home
                </li>
                <li
                  className="w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer"
                  onClick={() => {
                    navigate("/mylisting");
                    setShowpopup(false);
                  }}
                >
                  My Listing
                </li>
                <li
                  className="w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer"
                  onClick={() => {
                    navigate("/mybooking");
                    setShowpopup(false);
                  }}
                >
                  My Booking
                </li>
              </ul>
            </div>
          )}
        </div>
        {searchData?.length > 0 && (
          <div
            className="w-[100vw] h-[450px] flex flex-col gap-[20px] absolute
        top-[50%] overflow-auto left-[0] justify-start items-center"
          >
            <div
              className="max-w-[700px] w-[100vw] h-[300px] overflow-auto
          flex flex-col bg-[#fefdfd] p-[20px] rounded-lg border-[1px]
          border-[#a2a1a1]"
            >
              {searchData.map((item) => (
                <div
                  key={item._id}
                  className="border-b border-[black] p-[10px] cursor-pointer hover:bg-slate-100"
                  onClick={() => handleClick(item._id)}
                >
                  {item.title} in {item.landmark},{item.city}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[100%] h-[60px] flex items-center justify-center md:hidden">
        <div className="w-[80%] relative ">
          <input
            type="text"
            className="w-[100%] px-[30px] py-[10px] border-[2px] 
                border-[#bdbaba] outline-none overflow-auto rounded-[30px] text-[17px]"
            placeholder="Any Where  |  Any Location  |  Any City"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button className="absolute p-[10px] rounded-[50px] bg-[red] right-[3%] top-[4.5px]">
            <FiSearch className="w-[20px] h-[20px] text-[white]" />
          </button>
        </div>
      </div>

      <div
        className="w-[100vw] h-[85px] bg-white flex items-center 
      justify-start cursor-pointer gap-[40px] overflow-auto md:justify-center
      px-[15px]"
      >
        <div
          className="flex items-center justify-center flex-col 
          hover:border-b-[1px] border-[#a6a5a5] text-[13px]"
          onClick={() => {
            handleCategory("trending");
            setCategory("");
          }}
        >
          <MdWhatshot className="w-[30px] h-[30px] text-[black]" />
          <h3>Trending</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px] 
        ${category == "villa" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("villa")}
        >
          <MdVilla className="w-[30px] h-[30px] text-[black]" />
          <h3>Villa</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px] text-nowrap 
        ${category == "farmhouse" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("farmHouse")}
        >
          <GiGreenhouse className="w-[30px] h-[30px] text-[black] " />
          <h3>Farm House</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px] text-nowrap
         ${category == "poolHouse" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("poolHouse")}
        >
          <FaHouseFloodWater className="w-[30px] h-[30px] text-[black]" />
          <h3>Pool House</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px]
        ${category == "rooms" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("rooms")}
        >
          <MdBedroomParent className="w-[30px] h-[30px] text-[black]" />
          <h3>Rooms</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px]
        ${category == "flat" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("flat")}
        >
          <BsBuildingAdd className="w-[30px] h-[30px] text-[black]" />
          <h3>Flat</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px]
        ${category == "pg" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("pg")}
        >
          <MdOutlineBed className="w-[30px] h-[30px] text-[black]" />
          <h3>PG</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px]
        ${category == "cabin" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("cabin")}
        >
          <MdCabin className="w-[30px] h-[30px] text-[black]" />
          <h3>Cabin</h3>
        </div>
        <div
          className={`flex items-center justify-center flex-col 
        hover:border-b-[1px] border-[#a6a5a5] text-[13px]
        ${category == "shop" ? "border-b-[1px] border-[#a6a5a5]" : ""}`}
          onClick={() => handleCategory("shop")}
        >
          <BsShopWindow className="w-[30px] h-[30px] text-[black]" />
          <h3>Shops</h3>
        </div>
      </div>
    </div>
  );
}

export default Nav;
