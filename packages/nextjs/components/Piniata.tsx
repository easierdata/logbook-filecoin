"use client";

import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
// import Image from "next/image";
import { IFormValues } from "~~/app/interface/interface";

export default function PintataUpload({
  formValues,
  setFormValues,
}: {
  formValues: IFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>;
}) {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
    ? process.env.NEXT_PUBLIC_GATEWAY_URL
    : "https://gateway.pinata.cloud";

  const inputFile = useRef<any>(null);

  const uploadFile = async (fileToUpload: Blob) => {
    try {
      setUploading(true);
      const data: FormData = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      setCid(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  useEffect(() => {
    if (cid) setFormValues({ ...formValues, mediaData: [ethers.toUtf8Bytes(cid)] });
  }, [cid, file]);

  // @ts-expect-error: Let's ignore a compile error like this unreachable code
  const handleChange = e => {
    setFile(e.target.files[0]);
    setFormValues({ ...formValues, mediaType: [e.target.files[0].type] });

    uploadFile(e.target.files[0]);
  };

  return (
    <div className="relative">
      <label className="flex flex-row items-center gap-2 w-full">
        <input
          type="file"
          ref={inputFile}
          onChange={handleChange}
          name="file"
          // value={cid}
          className="input input-bordered file-input file-input-primary w-full bg-base-200 border-indigo-500 text-black p-0"
        />
      </label>
      {uploading && <progress className="progress w-56 progress-primary absolute mt-1 ml-1" />}
      {cid && (
        <img src={`https://${GATEWAY_URL}/ipfs/${cid}`} alt="file upload" className="m-1 border-4 border-primary" />
      )}
    </div>
  );
}
