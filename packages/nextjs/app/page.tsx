"use client";

import React, { useState } from "react";
import Mapbox from "../components/Mapbox";
import type { NextPage } from "next";
import CheckInControls from "~~/components/CheckInControls";
import CheckinForm from "~~/components/CheckinForm";
import Disclaimer from "~~/components/Disclaimer";
import Loading from "~~/components/Loading";

const Home: NextPage = () => {
  const [isCheckInActive, setCheckInActive] = useState(false);
  const [isControlsActive, setIsControlsActive] = useState(false);
  const [latLng, setLatLng] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [isDisclaimer, setIsDisclaimer] = useState(true);

  return (
    <div className={`relative flex flex-col items-center ${isCheckInActive ? "w-full max-w-2xl mx-auto" : ""}`}>
      {(isLoading || isTxLoading) && <Loading txLoading={isTxLoading} />}
      {isCheckInActive && isDisclaimer && <Disclaimer setIsDisclaimer={setIsDisclaimer} />}
      <div
        className={`relative w-full ${
          isCheckInActive ? "h-[20vh]" : "h-[calc(100vh-4rem)] sm:h-[60vh] lg:h-[calc(100vh-4rem)]"
        } m-4`}
      >
        <Mapbox
          setIsControlsActive={setIsControlsActive}
          setLatLng={setLatLng}
          isCheckInActive={isCheckInActive}
          setIsLoading={setIsLoading}
        />
        {!isCheckInActive && (
          <CheckInControls isControlsActive={isControlsActive} setCheckInActive={setCheckInActive} />
        )}
      </div>
      {isCheckInActive && <CheckinForm latLng={latLng} setIsTxLoading={setIsTxLoading} />}
    </div>
  );
};

export default Home;
