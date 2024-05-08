"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Attestation } from "@ethereum-attestation-service/eas-sdk";
import type { NextPage } from "next";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";

// import Link from "next/link";

const CheckinFrom: NextPage = () => {
  const { eas, isReady } = useContext(EASContext);
  const [attestation, setAttestation] = useState<Attestation>();
  const params = useParams();

  console.log("[🧪 DEBUG](pathname):", params.slug);
  // Get attestation from EAS api
  useEffect(() => {
    if (!isReady) return;
    // if UID path, pick up uid slug e.g "/attestation/uid/0xff08...cc3e"
    const attestationUID =
      params.slug?.length > 0 && params.slug[0] === "uid" ? params.slug[1] : easConfig.ATTESTATION_UID;
    eas
      .getAttestation(attestationUID) // TODO: Read attestation from url slug.
      .then(attestation => {
        console.log("[🧪 DEBUG](attestation):", attestation);
        setAttestation(attestation);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }, [eas, isReady]);

  return (
    // TODO: handle error/ no attestation.
    <>
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
              {/* row 1 */}
              <tr>
                <td>uid</td>
                <td>{attestation?.uid || "fetching"}</td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>schema</td>
                <td>{attestation?.schema || "fetching"}</td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>refUID</td>
                <td>{attestation?.refUID || "fetching"}</td>
              </tr>
              {/* row 4 */}
              <tr>
                <td>time</td>
                <td>{attestation?.time || "fetching"}</td>
              </tr>
              {/* row 5 */}
              <tr>
                <td>expirationTime</td>
                <td>{attestation?.expirationTime || "fetching"}</td>
              </tr>
              {/* row 6 */}
              <tr>
                <td>revocationTime</td>
                <td>{attestation?.revocationTime || "fetching"}</td>
              </tr>
              {/* row 6 */}
              <tr>
                <td>recipient</td>
                <td>{attestation?.recipient || "fetching"}</td>
              </tr>
              {/* row 6 */}
              <tr>
                <td>attester</td>
                <td>{attestation?.attester || "fetching"}</td>
              </tr>
              {/* row 6 */}
              <tr>
                <td>revocable</td>
                <td>{attestation?.revocable || "fetching"}</td>
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
