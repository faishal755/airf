import React from "react";
import Nav from "../Component/Nav";
import { useContext } from "react";
import { listingDataContext } from "../context/ListingContext";
import Card from "../Component/Card.jsx";

function Home() {
  let { listingData, setListingData, newListData } =
    useContext(listingDataContext);
  return (
    <div>
      <Nav />
      <div
        className="w-[100vw] min-h-[77vh] flex items-start
     justify-center gap-[25px] flex-wrap mt-[250px] md:mt-[180px] pb-[40px]  "
      >
        {newListData.map((list) => (
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
            isBooked={list.isBooked}
            host={list.host}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
