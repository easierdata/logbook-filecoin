"use client";

import React from "react";
import Mapbox from "../components/Mapbox";
// import { Address } from "../components/scaffold-eth";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";

// import Link from "next/link";
// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          <Mapbox />
        </div>
      </div>
    </>
  );
};

export default Home;
