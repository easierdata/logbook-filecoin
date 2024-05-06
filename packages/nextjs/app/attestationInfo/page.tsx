"use client";

import React, { useContext, useEffect, useState } from "react";
import { Attestation } from "@ethereum-attestation-service/eas-sdk";
import type { NextPage } from "next";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";

// import Link from "next/link";

const CheckinFrom: NextPage = () => {
  const { eas, isReady } = useContext(EASContext);
  const [attestation, setAttestation] = useState<Attestation>();

  // Get attestation from EAS api
  useEffect(() => {
    if (!isReady) return;
    eas
      .getAttestation(easConfig.ATTESTATION_ID) // TODO: Read attestation from url slug.
      .then(attestation => {
        console.log("[🧪 DEBUG](attestation):", attestation);
        setAttestation(attestation);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }, [eas, isReady]);

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          {/* TODO: Replace with daisyUI components */}
          <h2>attestation info</h2>
          <ul>uid:{attestation?.uid}</ul>
          <ul>schema:{attestation?.schema}</ul>
          <ul>refUID:{attestation?.refUID}</ul>
          <ul>time:{attestation?.time}</ul>
          <ul>expirationTime:{attestation?.expirationTime}</ul>
          <ul>revocationTime:{attestation?.revocationTime}</ul>
          <ul>recipient:{attestation?.recipient}</ul>
          <ul>attester:{attestation?.attester}</ul>
          <ul>revocable:{attestation?.revocable}</ul>
          <ul>data:{attestation?.data}</ul>
        </div>
      </div>
    </>
  );
};

export default CheckinFrom;
