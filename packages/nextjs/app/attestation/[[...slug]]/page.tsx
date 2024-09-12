"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { ArrowUpRightIcon, ClockIcon, DocumentTextIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Mapbox from "~~/components/Mapbox";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { GET_ATTESTATION } from "~~/services/queries";
import { EASContext } from "~~/components/EasContextProvider";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk"
import easConfig from "~~/EAS.config";
import hexToDate from "~~/utils/hexToDate";
import parseLocation from "~~/utils/parseLocation";
import { LocationAttestation } from "~~/types/attestations";

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

    eas
      .getAttestation(attestationUid)
      .then(res => {
        const [
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          attestationId,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          schemaUID,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          expirationTime,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          revocable,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          refUID,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          initData,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          recipient,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          attester,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          completed,
          dataField,
        ] = res;

        try {
          const schema = easConfig.schema.rawString;
          const schemaEncoder = new SchemaEncoder(schema);
          const decodedData = schemaEncoder.decodeData(dataField);
          const extractedData: { [key: string]: any } = {};

          decodedData.forEach(item => {
            console.log("Array item:", item);
            const { name } = item; // Destructure name and value
            extractedData[name] = item; // Assign to the object, using `name` as the key
          });
          console.log("Setting extractedData:", extractedData);
          setAttestationData(extractedData as LocationAttestation);
        } catch (err) {
          console.error("Error decoded attestation data ...", err);
        }
      })
      .catch(err => {
        console.error("A: Error fetching attestation data", err);
      });
  }, [eas, attestationUid]);

  const { data } = useQuery(GET_ATTESTATION, {
    // problem is this doesn't take chainId into account ...
    variables: { id: attestationUid },
  });

  {
    console.log("[🧪 DEBUG](data?.attestation):", data?.attestation);
  }

  console.log("AttestationData", attestationData);

  return (
    // TODO: handle error/ no attestation.
    <>
      {console.log(
        "[🧪 DEBUG](decodedDataJson):",
        data?.attestation?.decodedDataJson && JSON.parse(data?.attestation?.decodedDataJson),
      )}
      <div className="hero bg-base-200 text-black">
        <div className="overflow-x-auto">
          <div className="flex flex-col">
            <div className="h-52">
              <h1>Log Entry Details</h1>
              {data?.attestation?.decodedDataJson && (
                <Mapbox
                  isCheckInActive={true}
                  latLngAttestation={attestationData && parseLocation(attestationData?.location.value.value as string)}
                />
              )}
            </div>

            <table className="table bg-primary-content border-gray-400">
              {/* head */}
              {/* <thead>
              <tr>
                <th></th>
                <th>title</th>
                <th>title</th>
                <th>title</th>
              </tr>
              
            </thead> */}

              <tbody>
                <tr className="border-gray-200">
                  <td>
                    <MapPinIcon
                      className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0"
                      style={{ flexBasis: "auto" }}
                    />
                  </td>
                  {/* <td>
                    { (data?.attestation?.decodedDataJson &&
                      hexToDate(JSON.parse(data?.attestation?.decodedDataJson)[0].value.value.hex.toString())) || // should filter by `name` rather than specify by index imo
                      "fetching"}
                  </td> */}

                  <td>
                    <strong className="text-sm">Lon: &nbsp;&nbsp;&nbsp; </strong>
                    {(data?.attestation?.decodedDataJson &&
                      parseLocation(attestationData?.location.value.value)[0]) ||
                      "fetching"}
                  </td>
                  <td>
                    <strong className="text-sm">Lat: &nbsp;&nbsp;&nbsp;</strong>

                    {(data?.attestation?.decodedDataJson &&
                      parseLocation(attestationData?.location.value.value)[1]) ||
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-gray-200">
                  <td>
                    <ClockIcon className="h-5 w-5 text-primary" />
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      hexToDate(attestationData?.eventTimestamp.value.value.toString(16))) || // should filter by `name` rather than specify by index imo
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-gray-200">
                  <td>
                    <DocumentTextIcon className="h-5 w-5 text-primary" />
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      JSON.parse(data?.attestation?.decodedDataJson)[8].value.value) || // should filter by `name` rather than specify by index imo
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-gray-200">
                  <td className="text-sm">
                    <strong>From:</strong>
                  </td>
                  <td>{(data?.attestation?.decodedDataJson && data?.attestation?.attester) || "fetching"}</td>
                </tr>
                <tr className="border-gray-200">
                  <td className="text-sm">
                    <strong>Media:</strong>
                  </td>
                  <td>
                    {" "}
                    {(data?.attestation?.decodedDataJson && (
                      <img
                        src={`https://${GATEWAY_URL}/ipfs/${
                          JSON.parse(data?.attestation?.decodedDataJson)[7].value.value
                        }`}
                        alt="file upload"
                        className="m-1 border-4 border-primary"
                      />
                    )) ||
                      "fetching"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Link
                      target="_blank"
                      href={`https://${targetNetwork.name}.easscan.org/attestation/view/${attestationUid}` || ""}
                    >
                      <div className="btn btn-outline btn-primary">
                        View on EASScan
                        <ArrowUpRightIcon className="ml-2 h-5 w-5" />
                      </div>
                    </Link>
                  </td>
                </tr>
                {/* row 6 */}
                {/* TODO: parse attestation info (opt ethers abi decoder) */}
                {/* <tr>
                <td>data</td>
                <td>{attestation?.data || "fetching"}</td>
              </tr>*/}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckinFrom;
