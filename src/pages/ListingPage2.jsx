import React, { useContext } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdVilla } from "react-icons/md";
import { GiGreenhouse } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { MdBedroomParent } from "react-icons/md";
import { BsBuildingAdd } from "react-icons/bs";
import { MdOutlineBed } from "react-icons/md";
import { MdCabin } from "react-icons/md";
import { BsShopWindow } from "react-icons/bs";
import { listingDataContext } from "../context/ListingContext";

function ListingPage2() {
  let navigate = useNavigate();
  let { category, setCategory } = useContext(listingDataContext);
  return (
    <div
      className="w-[100%] h-[100vh] bg-white flex items-center justify-center 
   overflow-auto relative"
    >
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[5%] left-[20px] rounded-[50%] 
                  flex items-center justify-center md:top-[2%]"
        onClick={() => navigate("/listingpage1")}
      >
        <FaLongArrowAltLeft className="w-[25px] h-[25px] text-[white]" />
      </div>
      <div
        className="w-[200px] h-[50px] text-[20px] bg-[#f14242] text-[white] flex items-center 
        justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg md:top-[2%] px-[10px]"
      >
        Set Your Category
      </div>

      <div
        className="max-w-[900px] w-[100%] h-[550px] overflow-auto bg-white flex items-center 
          justify-start flex-col gap-[40px] mt-[30px]  "
      >
        <h1 className="text-[18px] text-[black] md:text-[30px] ">
          Which of these best describe your place?
        </h1>

        <div
          className="max-w-[900px] w-[100%] h-[100%] flex flex-wrap items-center 
          justify-center gap-[15px] md:w-[70%] md:mx-[150px] "
        >
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "villa" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("villa")}
          >
            <MdVilla className="w-[30px] h-[30px] text-[black]" />
            <h3>Villa</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "farm house" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("farm house")}
          >
            <GiGreenhouse className="w-[30px] h-[30px] text-[black] " />
            <h3>Farm House</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "pool house" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("pool house")}
          >
            {" "}
            <FaHouseFloodWater className="w-[30px] h-[30px] text-[black]" />
            <h3>Pool House</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "rooms" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("rooms")}
          >
            <MdBedroomParent className="w-[30px] h-[30px] text-[black]" />
            <h3>Rooms</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "flat" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("flat")}
          >
            <BsBuildingAdd className="w-[30px] h-[30px] text-[black]" />
            <h3>Flat</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "pg" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("pg")}
          >
            <MdOutlineBed className="w-[30px] h-[30px] text-[black]" />
            <h3>PG</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "cabin" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("cabin")}
          >
            <MdCabin className="w-[30px] h-[30px] text-[black]" />
            <h3>Cabin</h3>
          </div>
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center
            flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] 
            text-[16px] rounded-lg ${category == "shop" ? "border-[3px] border-[#8b8b8b]" : ""}`}
            onClick={() => setCategory("shop")}
          >
            <BsShopWindow className="w-[30px] h-[30px] text-[black]" />
            <h3>Shops</h3>
          </div>
        </div>
      </div>
      <button
        className="px-[50px] py-[10px] bg-[#a03535] text-[white] text-[18px]
       md:px-[100px] rounded-lg absolute right-[5%] bottom-[5%]"
        onClick={() => navigate("/listingpage3")}
        disabled={!category}
      >
        Next
      </button>
    </div>
  );
}

export default ListingPage2;
