"use client";

import React, { SyntheticEvent, useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from "wagmi";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";

// import Link from "next/link";

const CheckinForm = ({ latLng = [0, 0] }) => {
  // NextJS redirect
  const { push } = useRouter();

  const { address: connectedAddress } = useAccount(); //get address from wagmi
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const [formValues, setFormValues] = useState({
    coordinateInputX: latLng[0], // to be picked up by prop
    coordinateInputY: latLng[1], // to be picked up by prop
    timestamp: nowInSeconds,
    data: "Memo.",
  });

  // Use EAS SDK
  const { eas, isReady } = useContext(EASContext);
  // const [attestation, setAttestation] = useState<Attestation>();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("string[] coordinates,address subject,uint256 timestamp,bytes32 message");

  const schemaUID = easConfig.SCHEMA_UID_SEPOLIA; // TODO: read according to chainId

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  // Set attestation from EAS api
  function handleSubmit(event: SyntheticEvent) {
    if (!isReady) return; // notify user

    const encodedData = schemaEncoder.encodeData([
      {
        name: "coordinates",
        value: [formValues.coordinateInputX.toString(), formValues.coordinateInputY.toString()],
        type: "string[]",
      },
      { name: "subject", value: connectedAddress || "0xA332573D0520ee4653a878FA23774726811ae31A", type: "address" },
      { name: "timestamp", value: formValues.timestamp, type: "uint256" },
      { name: "message", value: formValues.data, type: "bytes32" },
    ]);

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
        push(`/attestation/uid/${newAttestationUID}`);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }

  return (
    <>
      <div className="flex items-center flex-col w-full flex-grow">
        <div className="flex-grow center w-full">
          <form onSubmit={handleSubmit} className="card m-5 flex-col gap-2 ">
            <label className="flex center flex-row items-center flex-grow gap-3">
              <Image src="/location.svg" alt="location_svg" width="50" height="50" />
              <input
                type="number"
                name="coordinateInputX"
                // placeholder={formValues.coordinateInputX.toString()}
                className="input input-bordered w-full  bg-base-200 border-indigo-500 text-black"
                value={latLng[0]}
                onChange={handleChange}
              />
              <input
                type="number"
                name="coordinateInputY"
                // placeholder={formValues.coordinateInputY.toString()}
                className="input input-bordered w-full  bg-base-200  border-indigo-500 text-black"
                value={latLng[1]}
                onChange={handleChange}
              />
            </label>
            <label className="flex center flex-row flex-grow items-center gap-2">
              {/* Not Sure we input this, might be on EAS.sol in the case of onchain attestations */}
              <Image src="/datetime.svg" alt="datetime" width="30" height="30" />

              <input
                type="number"
                name="timestamp"
                value={formValues.timestamp}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              />
            </label>
            <label className="flex center flex-row items-center gap-2 w-full">
              <Image src="/message-icon.svg" alt="location_svg" width="30" height="30" />
              {/* Not Sure we input this, might be on EAS.sol in the case of onchain attestations */}
              <input
                type="text"
                name="data"
                value={formValues.data}
                placeholder={formValues.data}
                className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
                onChange={handleChange}
              />
            </label>

            <input type="submit" value="Check-in" className="input btn btn-primary bg-primary" />
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckinForm;
