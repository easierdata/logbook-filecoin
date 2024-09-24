'use client';

import React, { Dispatch, SyntheticEvent, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/custom-datepicker.css';
import PintataUpload from './Piniata';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Config, UseChainIdParameters, useAccount, useChainId } from 'wagmi';
import { ClockIcon, DocumentTextIcon, MapPinIcon } from '@heroicons/react/24/outline';
import easConfig from '~~/EAS.config';
import { IFormValues } from '~~/app/interface/interface';
import { EASContext } from '~~/components/EasContextProvider';
import { wagmiConfig } from '~~/services/web3/wagmiConfig';

const CheckinForm = ({ lngLat, setIsTxLoading }: { lngLat: number[]; setIsTxLoading: Dispatch<boolean> }) => {
  // NextJS redirect
  const now = new Date();
  const { push } = useRouter();
  const [formValues, setFormValues] = useState<IFormValues>({
    longitude: lngLat[0].toString(), // to be picked up by prop
    latitude: lngLat[1].toString(), // to be picked up by prop

    eventTimestamp: Math.floor(Number(now) / 1000),
    data: '',
    mediaType: [''],
    mediaData: [''],
  });

  const { isConnected } = useAccount();
  const chainId = useChainId(wagmiConfig as UseChainIdParameters<Config>);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        eventTimestamp: Math.floor(Number(date) / 1000),
        timestamp: date,
      }));
    }
  };

  // Use EAS SDK
  const { eas, isReady } = useContext(EASContext); // does this need error handling in case EAS is null or not ready?
  // const [attestation, setAttestation] = useState<Attestation>();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(easConfig.schema.rawString);
  const schemaUID = easConfig.chains[chainId.toString() as keyof typeof easConfig.chains].schemaUID;

  const handleChange = (event: { preventDefault?: () => void; target: { name: string; value: any } }) => {
    if (event.preventDefault) event.preventDefault();
    const updatedFormValues = { ...formValues, [event.target.name]: event.target.value };
    setFormValues(updatedFormValues);
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!isConnected) {
      event.preventDefault(); // Prevent form submission or any action
      alert('Please connect to record log entry.');
    } else {
      handleSubmit(event);
    }
  };

  // Set attestation from EAS api
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsTxLoading(true);
    setError(null);

    if (!isReady) {
      setError('EAS is not ready');
      setIsTxLoading(false);
      return;
    }

    if (!schemaUID) {
      throw new Error('Schema UID is null, cannot proceed with attestation');
    }

    try {
      const encodedData = schemaEncoder.encodeData([
        {
          name: 'eventTimestamp',
          value: formValues.eventTimestamp, // here we convert to nowInSeconds
          type: 'uint256',
        },
        {
          name: 'srs',
          value: 'EPSG:4326', // hard coded for v0.1
          type: 'string',
        },
        {
          name: 'locationType',
          value: 'DecimalDegrees<string>', // hard coded for v0.1
          type: 'string',
        },
        {
          name: 'location',
          // value: `${formValues.longitude.toString()}, ${formValues.latitude.toString()}`,
          value: `${formValues.longitude.toString()}, ${formValues.latitude.toString()}`.toString(),
          type: 'string',
        },
        {
          name: 'recipeType',
          value: ['NEED A STRING ARRAY HERE'],
          type: 'string[]',
        },
        {
          name: 'recipePayload',
          value: [ethers.toUtf8Bytes('NEED A BYTES ARRAY HERE')],
          type: 'bytes[]',
        },
        {
          name: 'mediaType',
          value: formValues.mediaType, // storageSystem:MIMEtype
          type: 'string[]',
        },
        {
          name: 'mediaData',
          value: formValues.mediaData, // CID, encoded as bytes somehow
          type: 'string[]',
        },
        { name: 'memo', value: formValues.data, type: 'string' },
      ]);

      const tx = await eas?.attest({
        schema: schemaUID,
        data: {
          recipient: easConfig.chains[String(chainId) as keyof typeof easConfig.chains].easContractAddress, // To be read by chainId: easConfig.chains[chainId].EAScontract;
          expirationTime: 0n,
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });

      const newAttestationUID = await tx?.wait();
      push(`/attestation/uid/${newAttestationUID}`);
    } catch (err) {
      if (err instanceof Error) {
        setError((err.message as string) || 'An error occurred while creating the attestation');
      } else {
        setError('An error occurred while creating the attestationm');
      }
    } finally {
      setIsTxLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col w-full flex-grow">
      <div className="flex-grow center w-full">
        <form onSubmit={handleSubmit} className="card m-5 flex flex-col gap-4">
          <label className="flex flex-row items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0" style={{ flexBasis: 'auto' }} />
            <input
              type="number"
              name="longitude"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={lngLat[0]}
              onChange={handleChange}
            />
            <input
              type="number"
              name="latitude"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={lngLat[1]}
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
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="submit"
            value={isConnected ? 'Record Log Entry' : 'Connect to record'}
            className={`input btn ${
              isConnected
                ? 'bg-primary text-white hover:scale-105 hover:bg-dark-primary cursor-pointer'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            onClick={handleClick} // Control action with onClick
          />
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;
