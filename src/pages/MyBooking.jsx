import React, { useContext } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import Card from "../Component/Card";

function MyBooking() {
  let navigate = useNavigate();
  let { userData } = useContext(userDataContext);
  return (
    <div
      className="w-[100vw] min-h-[100vh] flex items-center justify-start
    flex-col gap-[10px] relative"
    >
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[6%] left-[20px] rounded-[50%] 
            flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaLongArrowAltLeft className="w-[25px] h-[25px] text-[white]" />
      </div>
      <div
        className="w-[50%] h-[10%] border-[2px] border-[#908c8c] p-[15px] flex items-center justify-center
       text-[30px] rounded-md text-[#613b3b] font-semibold mt-[50px] md:w-[600px] text-nowrap"
      >
        MY Booking
      </div>
      <div
        className="w-[100%] h-[90%] flex items-cemter justify-center 
      gap-[25px] flex-wrap mt-[30px]"
      >
        {userData.booking.map((list) => (
          <Card
            key={list._id}
            title={list.title}
            landmark={list.landmark}
            city={list.city}
            image1={list.image1}
            image2={list.image2}
            image3={list.image3}
            rent={list.rent}
            id={list._id}
            rating={list.rating}
          />
        ))}
      </div>
    </div>
  );
}

export default MyBooking;
