"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { ethers } from "ethers";
import type { NextPage } from "next";
import Mapbox from "~~/components/Mapbox";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { GET_ATTESTATION } from "~~/services/queries";

// import Link from "next/link";

const CheckinFrom: NextPage = () => {
  const params = useParams();

  const [attestationUid, setAttestationUid] = useState("");
  const { targetNetwork } = useTargetNetwork();
  console.log("[🧪 DEBUG](targetNetwork):", targetNetwork);
  useEffect(() => {
    if (!(params.slug?.length > 0) && params.slug[0] != "uid") return;
    setAttestationUid(params.slug[1]);
  }, [params.slug]);

  const { data } = useQuery(GET_ATTESTATION, {
    variables: { id: attestationUid },
  });

  const hexToDate = (hex: string) => {
    const timeInSeconds = parseInt(hex, 16);
    // convert to miliseconds
    const timeInMiliseconds = timeInSeconds * 1000;
    const currentTime = new Date(timeInMiliseconds).toLocaleDateString();
    return currentTime;
  };
  {
    console.log("[🧪 DEBUG](data?.attestation):", data?.attestation);
  }

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
              {data?.attestation?.decodedDataJson && (
                <Mapbox
                  isCheckInActive={true}
                  latLngAttestation={
                    data?.attestation?.decodedDataJson && JSON.parse(data?.attestation?.decodedDataJson)[0].value.value
                  }
                />
              )}
            </div>
            <table className="table bg-primary-content border-black text-lg ">
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
                <tr className="border-black">
                  <td>
                    <Image src="/location.svg" alt="location_svg" width="30" height="30" />
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      JSON.parse(data?.attestation?.decodedDataJson)[0].value.value[0]) ||
                      "fetching"}
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      JSON.parse(data?.attestation?.decodedDataJson)[0].value.value[1]) ||
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-black">
                  <td>
                    <Image src="/message.svg" alt="message" width="30" height="30" style={{ marginLeft: "4px" }} />
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      ethers.decodeBytes32String(JSON.parse(data?.attestation?.decodedDataJson)[3].value.value)) ||
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-black">
                  <td>
                    <Image
                      src="/datetime_icon.svg"
                      alt="datetime_svg"
                      style={{ marginLeft: "-8px" }}
                      width="60"
                      height="60"
                    />
                  </td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      hexToDate(JSON.parse(data?.attestation?.decodedDataJson)[2].value.value.hex.toString())) ||
                      "fetching"}
                  </td>
                </tr>
                <tr className="border-black">
                  <td>From</td>
                  <td>
                    {(data?.attestation?.decodedDataJson &&
                      JSON.parse(data?.attestation?.decodedDataJson)[1].value.value.toString()) ||
                      "fetching"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Link
                      target="_blank"
                      href={`https://${targetNetwork.name}.easscan.org/attestation/view/${attestationUid}` || ""}
                    >
                      <div className="btn btn-primary">view on easscan</div>
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
