"use client";

import React, { useContext } from "react";
import type { NextPage } from "next";
import { EASContext } from "~~/components/EasContextProvider";

// import Link from "next/link";

const CheckinFrom: NextPage = () => {
  const eas = useContext(EASContext);
  console.log("[🧪 DEBUG](eas Instance):", eas);

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          <h2>attestation info</h2>
        </div>
      </div>
    </>
  );
};

export default CheckinFrom;
