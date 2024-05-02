"use client";

import React from "react";
import Mapbox from "../components/Mapbox";
import { Address } from "../components/scaffold-eth";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
// import Link from "next/link";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Astral check-in ✨ </span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow center w-full">
          <div className="my-2 p-5 bg-base-300">
            <p className="text-center text-lg">CHECK - IN</p>
          </div>
          <div className="my-2 p-5 bg-base-300">
            <p className="text-center text-lg">CONFIDENCE LEADERBOARD</p>
          </div>
          <Mapbox />
        </div>
      </div>
    </>
  );
};

export default Home;
