'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import type { NextPage } from 'next';
import { ArrowUpRightIcon, ClockIcon, DocumentTextIcon, MapPinIcon } from '@heroicons/react/24/outline';
import easConfig from '~~/EAS.config';
import { EASContext } from '~~/components/EasContextProvider';
import Mapbox from '~~/components/Mapbox';
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork';
import { LocationAttestation } from '~~/types/attestations';
import hexToDate from '~~/utils/hexToDate';
import parseLocation from '~~/utils/parseLocation';

// import Link from "next/link";
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : 'https://gateway.pinata.cloud';

const CheckinFrom: NextPage = () => {
  const params = useParams();
  const { eas } = useContext(EASContext); // does this need error handling in case EAS is null or not ready?

  const [attestationUid, setAttestationUid] = useState('');
  const [attestationData, setAttestationData] = useState<LocationAttestation | null>(null);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    if (!(params.slug?.length > 0) && params.slug[0] != 'uid') return;
    setAttestationUid(params.slug[1]);
  }, [params.slug]);

  useEffect(() => {
    if (!eas) {
      console.error('EAS is not initialized');
      return;
    }

    eas
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
          console.error('Error decoded attestation data ...', err);
        }
      })
      .catch(err => {
        console.error('A: Error fetching attestation data', err);
      });
  }, [eas, attestationUid]);

  console.log('attestationData', attestationData);

  return (
    // TODO: handle error/ no attestation.
    <>
      <div className="hero bg-base-200 text-black">
        <div className="overflow-x-auto">
          <div className="flex flex-col">
            <div className="h-52">
              <h1>Log Entry Details</h1>
              {attestationData && (
                <Mapbox
                  isCheckInActive={true}
                  latLngAttestation={attestationData && parseLocation(attestationData?.location.value.value as string)}
                />
              )}
            </div>

            <table className="table bg-primary-content border-gray-400">
              <tbody>
                <tr className="border-gray-200">
                  <td>
                    <MapPinIcon
                      className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0"
                      style={{ flexBasis: 'auto' }}
                    />
                  </td>
                  <td>
                    <strong className="text-sm">Lon: &nbsp;&nbsp;&nbsp; </strong>
                    {(attestationData && parseLocation(attestationData?.location.value.value as string)[0]) ||
                      'fetching'}
                  </td>
                  <td>
                    <strong className="text-sm">Lat: &nbsp;&nbsp;&nbsp;</strong>
                    {(attestationData && parseLocation(attestationData?.location.value.value as string)[1]) ||
                      'fetching'}
                  </td>
                </tr>
                <tr className="border-gray-200">
                  <td>
                    <ClockIcon className="h-5 w-5 text-primary" />
                  </td>
                  <td>
                    {(attestationData &&
                      hexToDate((attestationData?.eventTimestamp.value.value as unknown as bigint).toString(16))) ||
                      'fetching'}
                  </td>
                </tr>
                <tr className="border-gray-200">
                  <td>
                    <DocumentTextIcon className="h-5 w-5 text-primary" />
                  </td>
                  <td>{(attestationData && (attestationData?.memo.value.value as string)) || 'fetching'}</td>
                </tr>
                <tr className="border-gray-200">
                  <td className="text-sm">
                    <strong>From:</strong>
                  </td>
                  <td>{(attestationData && attestationData?.attester) || 'fetching'}</td>
                </tr>
                <tr className="border-gray-200">
                  <td className="text-sm">
                    <strong>Media:</strong>
                  </td>
                  <td>
                    {' '}
                    {(attestationData && (
                      <img
                        src={`https://${GATEWAY_URL}/ipfs/${(attestationData?.mediaData.value.value as string)[0]}`}
                        alt="file upload"
                        className="m-1 border-4 border-primary"
                      />
                    )) ||
                      'fetching'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Link
                      target="_blank"
                      href={`https://${targetNetwork.name}.easscan.org/attestation/view/${attestationUid}` || ''}
                    >
                      <div className="btn btn-outline btn-primary">
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
    </>
  );
};

export default CheckinFrom;
