import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// define max file size and allowed file types
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

//receives a POST request from client with a file in the form data.
export async function POST(request: NextRequest) {
  try {
    //get the file from the form data
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    // EDGE CASES
    // If no file is uploaded, return early with a success message
    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 200 });
    }

    // Only perform file checks if a file is present
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10 MB limit" }, { status: 400 });
    }
    //check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG and GIF are allowed" }, { status: 400 });
    }

    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));

    //timeout handling for the Pinata API
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
      //passing the abort signal as an option here allowing timeoutId to be called and abort request
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for 403 Forbidden error
    if (res.status === 403) {
      console.error("Access denied: ", res.statusText);
      return NextResponse.json({ error: "Access denied. Please check your permissions." }, { status: 403 });
    }

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Pinata API error: ", errorData);
      return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: res.status });
    }

    const { IpfsHash } = await res.json();
    console.log("File uploaded to IPFS:", IpfsHash);
    return NextResponse.json({ IpfsHash }, { status: 200 });
  } catch (e: any) {
    // adding more failure scenarios
    console.error("Error uploading file: ", e);
    if (e.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Oh no! Something went wrong. Please try again later" }, { status: 500 });
  }
}
