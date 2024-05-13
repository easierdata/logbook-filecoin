import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="hero min-h-screen bg-base-100 absolute z-10" style={{ opacity: 0.8 }}>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <Image alt="loading" src="/astral_sparkels.svg" width={100} height={100} style={{ opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
};
export default Loading;
