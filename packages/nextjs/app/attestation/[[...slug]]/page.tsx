"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { GET_ATTESTATION } from "~~/services/queries";

// import Link from "next/link";

const CheckinFrom: NextPage = () => {
  const params = useParams();

  const { data } = useQuery(GET_ATTESTATION, {
    variables: { id: params.slug?.length > 0 && params.slug[0] === "uid" ? params.slug[1] : "" },
  });

  const hexToDate = (hex: string) => {
    const timeInSeconds = parseInt(hex, 16);
    // convert to miliseconds
    const timeInMiliseconds = timeInSeconds * 1000;
    const currentTime = new Date(timeInMiliseconds).toLocaleDateString();
    return currentTime;
  };
  return (
    // TODO: handle error/ no attestation.
    <>
      {console.log(
        "[🧪 DEBUG](decodedDataJson):",
        data?.attestation?.decodedDataJson && JSON.parse(data?.attestation?.decodedDataJson),
      )}
      <div className="hero min-h-screen bg-base-100">
        <div className="overflow-x-auto">
          <table className="table">
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
              <tr>
                <td>coordinate</td>
                <td>
                  (
                  {(data?.attestation?.decodedDataJson &&
                    JSON.parse(data?.attestation?.decodedDataJson)[0].value.value.toString()) ||
                    "fetching"}
                  )
                </td>
              </tr>
              <tr>
                <td>attester</td>
                <td>
                  {(data?.attestation?.decodedDataJson &&
                    JSON.parse(data?.attestation?.decodedDataJson)[1].value.value.toString()) ||
                    "fetching"}
                </td>
              </tr>
              <tr>
                <td>attester</td>
                <td>
                  {(data?.attestation?.decodedDataJson &&
                    hexToDate(JSON.parse(data?.attestation?.decodedDataJson)[2].value.value.hex.toString())) ||
                    "fetching"}
                </td>
              </tr>
              <tr>
                <td>message</td>
                <td>
                  {(data?.attestation?.decodedDataJson &&
                    ethers.decodeBytes32String(JSON.parse(data?.attestation?.decodedDataJson)[3].value.value)) ||
                    "fetching"}
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
    </>
  );
};

export default CheckinFrom;
