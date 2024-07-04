"use client";

import React, { Dispatch, SyntheticEvent, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/custom-datepicker.css";
import PintataUpload from "./Piniata";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClockIcon, DocumentTextIcon, MapPinIcon } from "@heroicons/react/24/outline";
import easConfig from "~~/EAS.config";
import { IFormValues } from "~~/app/interface/interface";
import { EASContext } from "~~/components/EasContextProvider";

// To add DaisyUI styles

// To add DaisyUI styles

// import Link from "next/link";

const CheckinForm = ({ latLng = [0, 0], setIsTxLoading }: { latLng: number[]; setIsTxLoading: Dispatch<boolean> }) => {
  // NextJS redirect
  const now = new Date();
  const { push } = useRouter();
  const [formValues, setFormValues] = useState<IFormValues>({
    coordinateInputX: latLng[0].toString(), // to be picked up by prop
    coordinateInputY: latLng[1].toString(), // to be picked up by prop

    eventTimestamp: Math.floor(Number(now) / 1000),
    data: "",
    mediaType: [""],
    mediaData: [ethers.toUtf8Bytes("")],
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // date(date);
      // handleChange({ target: { name: "timestamp", value: date } });
      console.log("[🧪 DEBUG](date):", Math.floor(date.getTime() / 1000));
      setFormValues({ ...formValues, eventTimestamp: Math.floor(date.getTime() / 1000) });
    } else {
      setSelectedDate(null);
    }
  };

  // Use EAS SDK
  const { eas, isReady } = useContext(EASContext);
  // const [attestation, setAttestation] = useState<Attestation>();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(easConfig.RAW_SCHEMA_STRING);

  const schemaUID = easConfig.SCHEMA_UID_SEPOLIA; // TODO: read according to chainId

  const handleChange = (event: { preventDefault?: () => void; target: { name: string; value: any } }) => {
    if (event.preventDefault) event.preventDefault();
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  // Set attestation from EAS api
  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setIsTxLoading(true);

    if (!isReady) return; // notify user

    /* "
    
    uint256 eventTimestamp,
    string srs,
    string locationType,
    bytes location,
    string[] recipeType,
    bytes[] recipePayload,
    string[] mediaType,
    bytes[] mediaData,
    string memo", */

    const encodedData = schemaEncoder.encodeData([
      {
        name: "eventTimestamp",
        value: formValues.eventTimestamp, // here we convert to nowInSeconds
        type: "uint256",
      },
      {
        name: "srs",
        value: "EPSG:4326", // hard coded for v0.1
        type: "string",
      },
      {
        name: "locationType",
        value: "DecimalDegrees<string>", // hard coded for v0.1
        type: "string",
      },
      {
        name: "location",
        value: ethers
          .toUtf8Bytes(`${(formValues.coordinateInputX.toString(), formValues.coordinateInputY.toString())}`)
          .toString(),
        type: "bytes",
      },
      {
        name: "recipeType",
        value: ["NEED A STRING ARRAY HERE"],
        type: "string[]",
      },
      {
        name: "recipePayload",
        value: [ethers.toUtf8Bytes("NEED A BYTES ARRAY HERE")],
        type: "bytes[]",
      },
      {
        //  @RON: Here is where we put in the IPFS hashes
        name: "mediaType",
        value: formValues.mediaType, // storageSystem:MIMEtype
        type: "string[]",
      },
      {
        name: "mediaData",
        value: formValues.mediaData, // CID, encoded as bytes somehow
        type: "bytes[]",
      },
      { name: "memo", value: formValues.data, type: "string" },
    ]);

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
        setIsTxLoading(false);
        push(`/attestation/uid/${newAttestationUID}`);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }

  return (
    <div className="flex items-center flex-col w-full flex-grow">
      <div className="flex-grow center w-full">
        <form onSubmit={handleSubmit} className="card m-5 flex flex-col gap-4">
          <label className="flex flex-row items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0" style={{ flexBasis: "auto" }} />
            <input
              type="number"
              name="coordinateInputX"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={latLng[0]}
              onChange={handleChange}
            />
            <input
              type="number"
              name="coordinateInputY"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={latLng[1]}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-row items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeIntervals={1}
              dateFormat="Pp"
              // value={formValues.eventTimestamp}
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
            />
          </label>
          <label className="flex flex-row items-center gap-2 w-full">
            <DocumentTextIcon className="h-5 w-5 text-primary" />
            <input
              type="text"
              name="data"
              value={formValues.data}
              placeholder="Memo"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              onChange={handleChange}
            />
          </label>
          <PintataUpload formValues={formValues} setFormValues={setFormValues} />
          <input type="submit" value="Record Log Entry" className="input btn btn-primary bg-primary" />
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;
