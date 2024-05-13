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
import Loading from "~~/components/Loading";
import { GET_ATTESTATIONS } from "~~/services/queries";

// import Link from "next/link";
// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const [isCheckInActive, setCheckInActive] = useState(false);
  const [isControlsActive, setIsControlsActive] = useState(false);
  const [latLng, setLatLng] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(false);

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
      {(isLoading || isTxLoading) && <Loading />}
      <Mapbox
        setIsControlsActive={setIsControlsActive}
        setLatLng={setLatLng}
        isCheckInActive={isCheckInActive}
        attestationsData={attestationsData}
        setIsLoading={setIsLoading}
      />

      {isCheckInActive && <CheckinForm latLng={latLng} setIsTxLoading={setIsTxLoading} />}
      {!isCheckInActive && <CheckInControls isControlsActive={isControlsActive} setCheckInActive={setCheckInActive} />}
    </div>
  );
};

export default Home;
