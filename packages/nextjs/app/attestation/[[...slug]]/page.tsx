"use client";

import React, { useContext, useEffect, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { NextPage } from "next";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ArrowUpRightIcon, ClockIcon, DocumentTextIcon, MapPinIcon } from "@heroicons/react/24/outline";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";
import Mapbox from "~~/components/Mapbox";
import Spinner from "~~/components/Spinner";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { LocationAttestation } from "~~/types/attestations";
import hexToDate from "~~/utils/hexToDate";
import parseLocation from "~~/utils/parseLocation";

// import Link from "next/link";
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

const CheckinFrom: NextPage = () => {
  const params = useParams();
  const { eas } = useContext(EASContext); // does this need error handling in case EAS is null or not ready?

  const [attestationUid, setAttestationUid] = useState("");
  const [attestationData, setAttestationData] = useState<LocationAttestation | null>(null);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    if (!(params.slug?.length > 0) && params.slug[0] != "uid") return;
    setAttestationUid(params.slug[1]);
  }, [params.slug]);

  useEffect(() => {
    if (!eas) {
      console.error("EAS is not initialized");
      return;
    }

    eas // this should be async?
      .getAttestation(attestationUid)
      .then(res => {
        const [
          attestationId,
          schemaUID,
          expirationTime,
          revocable,
          refUID,
          initData,
          recipient,
          attester,
          completed,
          dataField,
        ] = res as unknown as any[];

        try {
          const schema = easConfig.schema.rawString;
          const schemaEncoder = new SchemaEncoder(schema);
          const decodedData = schemaEncoder.decodeData(dataField);
          const extractedData: { [key: string]: any } = {};

          decodedData.forEach(item => {
            const { name } = item; // Destructure name and value
            extractedData[name] = item; // Assign to the object, using `name` as the key
          });
          extractedData.attester = attester;
          extractedData.recipient = recipient;
          extractedData.completed = completed;
          extractedData.expirationTime = expirationTime;
          extractedData.revocable = revocable;
          extractedData.refUID = refUID;
          extractedData.initData = initData;
          extractedData.schemaUID = schemaUID;
          extractedData.attestationId = attestationId;
          setAttestationData(extractedData as LocationAttestation);
        } catch (err) {
          console.error("Error decoded attestation data ...", err);
        }
      })
      .catch(err => {
        console.error("A: Error fetching attestation data", err);
      });
  }, [eas, attestationUid]);

  console.log("attestationData", attestationData);

  //logic for error handling within the ErrorBoubdary fallbackRender
  const fallBackLogic = ({ error }: FallbackProps): React.ReactNode => {
    if (error.message.includes("403")) {
      console.log("[🧪 DEBUG](error): Access denied -", error);
      return (
        <div className="text-red-500 text-2xl font-black flex justify-center items-center">
          Access denied. Please check your permissions.
        </div>
      );
    } else {
      console.error("[🧪 DEBUG](error):", error);
      return (
        <div className="text-red-500 text-2xl font-black flex justify-center items-center">
          Error loading attestation data. Please try again later
        </div>
      );
    }
  };
  //ensure the value is not undefined or null with optional chaining, is an array and has a string value with the hash

  const mediaDataFetched = attestationData?.mediaData.value.value as string[];
  const hasValidMedia =
    Array.isArray(mediaDataFetched) &&
    mediaDataFetched.length > 0 &&
    typeof mediaDataFetched[0] === "string" &&
    mediaDataFetched[0].trim() !== "";

  return (
    // TODO: handle error/ no attestation.
    <>
      <ErrorBoundary fallbackRender={({ error }: FallbackProps) => fallBackLogic(error)}>
        <Suspense fallback={<Spinner />}>
          <div className="hero bg-base-200 text-black">
            <div className="overflow-x-auto mx-4 max-w-full">
              <div className="flex flex-col">
                <div className="h-64">
                  <h1 className="text-2xl font-black py-5 text-center">Log Entry Details</h1>
                  {attestationData && (
                    <Mapbox
                      isCheckInActive={true}
                      latLngAttestation={
                        attestationData && parseLocation(attestationData?.location.value.value as string)
                      }
                    />
                  )}
                </div>

                <table className="table bg-primary-content border-gray-400 mx-2 sm:mx-0 sm:flex sm:flex-col">
                  {/* head */}
                  {/* <thead>
              <tr>
                <th></th>
                <th>title</th>
                <th>title</th>
                <th>title</th>
              </tr>
              
            </thead> */}

                  <tbody className="">
                    <tr className="border-gray-200">
                      <td className="">
                        <MapPinIcon
                          className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0"
                          style={{ flexBasis: "auto" }}
                        />
                      </td>
                      <td className="flex flex-col sm:flex-row">
                        <div className="sm:mr-4">
                          {" "}
                          {/* Adjust margin for larger screens */}
                          <strong className="text-sm">Lon: &nbsp;&nbsp;&nbsp; </strong>
                          {(attestationData && parseLocation(attestationData?.location.value.value as string)[0]) ||
                            "fetching"}
                        </div>

                        <div>
                          <strong className="text-sm">Lat: &nbsp;&nbsp;&nbsp;</strong>
                          {(attestationData && parseLocation(attestationData?.location.value.value as string)[1]) ||
                            "fetching"}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-gray-200">
                      <td className="">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </td>
                      <td className="">
                        {(attestationData &&
                          hexToDate((attestationData?.eventTimestamp.value.value as unknown as bigint).toString(16))) ||
                          "fetching"}
                      </td>
                    </tr>
                    <tr className="border-gray-200">
                      <td className="">
                        <DocumentTextIcon className="h-5 w-5 text-primary" />
                      </td>
                      <td>{(attestationData && (attestationData?.memo.value.value as string)) || "fetching"}</td>
                    </tr>
                    <tr className="border-gray-200">
                      <td className="text-sm ">
                        <strong>From:</strong>
                      </td>
                      <td>{(attestationData && attestationData?.attester) || "fetching"}</td>
                    </tr>
                    {hasValidMedia && (
                      <tr className="border-gray-200">
                        <td className="text-sm">
                          <strong>Media:</strong>
                        </td>
                        {/* Conditionally render the media row */}

                        <td>
                          {/* eslint-disable @next/next/no-img-element */}
                          <img
                            src={`https://${GATEWAY_URL}/ipfs/${(attestationData?.mediaData.value.value as string)[0]}`}
                            alt="file upload"
                            className="m-1 border-4 border-primary"
                          />
                          {/* eslint-enable @next/next/no-img-element */}
                        </td>
                      </tr>
                    )}
                    <tr className="sm:flex-row justify-between w-full">
                      <td className="sm:w-1/2 p-2">
                        <Link target="_blank" href="/register">
                          <div className="btn btn-outline btn-primary w-full">
                            New log
                            {/* <ArrowUpRightIcon className="ml-2 h-5 w-5" /> */}
                          </div>
                        </Link>
                      </td>

                      <td className="sm:w-1/2 p-2">
                        <Link
                          target="_blank"
                          href={`https://${targetNetwork.name}.easscan.org/attestation/view/${attestationUid}` || ""}
                        >
                          <div className="btn btn-outline btn-primary w-full">
                            View on EASScan
                            <ArrowUpRightIcon className="ml-2 h-5 w-5" />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default CheckinFrom;
