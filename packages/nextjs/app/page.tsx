"use client";

import React, { useState } from "react";
import Mapbox from "../components/Mapbox";
import { useQuery } from "@apollo/client";
// import { Address } from "../components/scaffold-eth";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import easConfig from "~~/EAS.config";
import CheckinForm from "~~/components/CheckinForm";
import { GET_ATTESTATIONS } from "~~/services/queries";

// import Link from "next/link";
// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const [isCheckInActive, setCheckInActive] = useState(false);
  const [latLng, setLatLng] = useState([0, 0]);

  const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
    variables: { schemaId: easConfig.SCHEMA_UID_SEPOLIA },
  });

  ////
  // DEGUGGING:
  if (data) console.log("[🧪 DEBUG](Attestations data):", data);
  console.log("[🧪 DEBUG](Attestations loading):", loading);
  if (error) console.log("[🧪 DEBUG](Attestations error):", error);
  //

  const handleCheckIn = () => {
    console.log("Moving on to the next step!");
    // Display check-in form
    // redirect('/ch)
  };
  const cancelCheckIn = () => {
    console.log("Canceled check-in!");
    // Clear marker
  };

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow m-2 center w-full">
          <button className="btn btn-alert bg-base-300" disabled={!isCheckInActive} onClick={handleCheckIn}>
            CHECK - IN
          </button>
          <button className="btn bg-base-300" disabled={!isCheckInActive} onClick={cancelCheckIn}>
            CANCEL{" "}
          </button>
          {/* <div className="my-2 p-5 bg-base-300">
            <p className="text-center text-lg">CONFIDENCE LEADERBOARD</p>
          </div> */}
          {isCheckInActive && <CheckinForm latLng={latLng} />}
          <Mapbox
            setCheckInActive={setCheckInActive}
            setLatLng={setLatLng}
            height={isCheckInActive ? "200px" : "90vh"}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
