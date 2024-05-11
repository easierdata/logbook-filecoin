"use client";

import React, { useState } from "react";
import Mapbox from "../components/Mapbox";
import { useQuery } from "@apollo/client";
// import { Address } from "../components/scaffold-eth";
// import { MapPinIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import easConfig from "~~/EAS.config";
import CheckInControls from "~~/components/CheckInControls";
import CheckinForm from "~~/components/CheckinForm";
import { GET_ATTESTATIONS } from "~~/services/queries";

// import Link from "next/link";
// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const [isCheckInActive, setCheckInActive] = useState(false);
  const [isControlsActive, setIsControlsActive] = useState(false);
  const [latLng, setLatLng] = useState([0, 0]);

  const {
    loading,
    error,
    data: attestationsData,
  } = useQuery(GET_ATTESTATIONS, {
    variables: { schemaId: easConfig.SCHEMA_UID_SEPOLIA },
  });

  ////
  // DEGUGGING:
  console.log("[🧪 DEBUG](Attestations loading):", loading);
  if (error) console.log("[🧪 DEBUG](Attestations error):", error);
  //

  return (
    <div className="">
      <Mapbox
        setIsControlsActive={setIsControlsActive}
        setLatLng={setLatLng}
        isCheckInActive={isCheckInActive}
        attestationsData={attestationsData}
      />
      {isCheckInActive && <CheckinForm latLng={latLng} />}
      {!isCheckInActive && <CheckInControls isControlsActive={isControlsActive} setCheckInActive={setCheckInActive} />}
    </div>
  );
};

export default Home;

{
  /* <div className="flex justify-center items-center flex-col w-full flex-grow">
<div className="flex-grow center w-full">

  <div role="alert" className="alert bg-white w-[90%] mx-auto m-4 p-4 absolute bottom-4 left-0 right-0 z-10 shadow-lg flex  gap-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>

    <span className="">Tap your location on the map.</span>
    <div className="ml-auto">
      <button className="btn btn-md btn-neutral btn-outline rounded-full mr-3" disabled={!isCheckInActive} onClick={cancelCheckIn}>
        X
      </button>
      <button className="btn btn-md btn-primary px-12 text-neutral-content" disabled={!isCheckInActive} onClick={handleCheckIn}>
        Check In
      </button>
    </div>
  </div>
</div>
</div> */
}
