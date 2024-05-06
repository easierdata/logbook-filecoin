"use client";

import React, { SyntheticEvent, useContext, useState } from "react";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";
import Mapbox from "~~/components/Mapbox";

// import Link from "next/link";

const CheckinForm: NextPage = () => {
  const { address: connectedAddress } = useAccount(); //get address from wagmi
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const [formValues, setFormValues] = useState({
    coordinateInputX: 0, // to be picked up by prop
    coordinateInputY: 0, // to be picked up by prop
    timestamp: nowInSeconds,
    data: "Something you wanna add.",
  });

  // Use EAS SDK
  const { eas, isReady } = useContext(EASContext);
  // const [attestation, setAttestation] = useState<Attestation>();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("string[] coordinates,address subject,int256 timestamp,bytes data");
  const encodedData = schemaEncoder.encodeData([
    {
      name: "coordinates",
      value: [formValues.coordinateInputX.toString(), formValues.coordinateInputY.toString()],
      type: "string[]",
    },
    { name: "subject", value: connectedAddress || "0xA332573D0520ee4653a878FA23774726811ae31A", type: "address" },
    { name: "timestamp", value: formValues.timestamp, type: "int256" },
    { name: "data", value: ethers.encodeBytes32String(formValues.data), type: "bytes" },
  ]);

  const schemaUID = easConfig.SCHEMA_UID_SEPOLIA; // TODO: read according to chainId

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  // Set attestation from EAS api
  function handleSubmit(event: SyntheticEvent) {
    if (!isReady) return; // notify user

    event.preventDefault();
    eas
      .attest({
        schema: schemaUID,
        data: {
          recipient: easConfig.EAS_CONTRACT_SEPOLIA, // To be read by chainId
          expirationTime: 0n,
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      })
      .then(tx => {
        return tx.wait();
      })
      .then(newAttestationUID => {
        console.log("[🧪 DEBUG](newAttestationUID):", newAttestationUID);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }

  return (
    <>
      <h1>Checkin form view</h1>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          <form onSubmit={handleSubmit} className="card m-10 bg-base-100 shadow-xl">
            <Mapbox height={"200px"} />
            <div className="card-body mt-5">
              <h2 className="card-title">Check-in details:</h2>
              <div className="flex-col card-actions justify-end">
                {/* <label className="flex center flex-row items-center w-full">
                  <div>Address:</div>
                  <input type="text" name="subject" value={connectedAddress} className="input w-full" />
                </label> */}
                <label className="flex center flex-row items-center">
                  <div>Coordinate:&nbsp;</div>
                  (
                  <input
                    type="number"
                    name="coordinateInputX"
                    placeholder={formValues.coordinateInputX.toString()}
                    className="input w-full max-w-xs"
                    value={formValues.coordinateInputX}
                    onChange={handleChange}
                  />
                  ,
                  <input
                    type="number"
                    name="coordinateInputY"
                    placeholder={formValues.coordinateInputY.toString()}
                    className="input w-full max-w-xs"
                    value={formValues.coordinateInputY}
                    onChange={handleChange}
                  />
                  )
                </label>
                <label className="flex center flex-row items-center">
                  <div>Timestamp:</div>
                  {/* Not Sure we input this, might be on EAS.sol in the case of onchain attestations */}
                  <input
                    type="number"
                    name="timestamp"
                    value={formValues.timestamp}
                    onChange={handleChange}
                    className="input w-full max-w-xs"
                  />
                </label>
                <label className="flex center flex-row items-center w-full">
                  <div>Data:</div>
                  {/* Not Sure we input this, might be on EAS.sol in the case of onchain attestations */}
                  <input
                    type="text"
                    name="data"
                    value={formValues.data}
                    placeholder={formValues.data}
                    className="input w-full"
                    onChange={handleChange}
                  />
                </label>

                <input type="submit" value="Check-in" className="input btn btn-primary" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckinForm;
