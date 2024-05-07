"use client";

import React, { useState } from "react";
import Mapbox from "../components/Mapbox";
// import { Address } from "../components/scaffold-eth";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";

// import Link from "next/link";
// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isCheckInActive, setCheckInActive] = useState(false);
  const handleCheckIn = () => {
    console.log("Moving on to the next step!");
    // Display check-in form
  };
  const cancelCheckIn = () => {
    console.log("Canceled check-in!");
    // Clear marker
  };

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          <button className="my-2 p-5 bg-base-300" disabled={!isCheckInActive} onClick={handleCheckIn}>
            <p className="text-center text-lg">CHECK - IN</p>
          </button>
          <button className="my-2 p-5 bg-base-300" disabled={!isCheckInActive} onClick={cancelCheckIn}>
            <p className="text-center text-lg">CANCEL</p>
          </button>
          <div className="my-2 p-5 bg-base-300">
            <p className="text-center text-lg">CONFIDENCE LEADERBOARD</p>
          </div>
          <Mapbox setCheckInActive={setCheckInActive} />
        </div>
      </div>
    </>
  );
};

export default Home;
