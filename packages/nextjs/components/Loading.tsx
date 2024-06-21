import React from "react";
import { ReactSVG } from "react-svg";

const Loading = () => {
  return (
    <div className="hero min-h-screen bg-base-100 absolute z-10" style={{ opacity: 0.8 }}>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div
            className="svg-container absolute top-1/4 left-1/2 -translate-x-1/2"
            style={{ width: "200px", height: "200px" }}
          >
            <ReactSVG src="/astral-sparkles.svg" className="animated-svg" />
          </div>{" "}
          {/* <Image alt="loading" type="image/svg+xml" src="/astral-sparkles.svg" width={100} height={100} style={{ opacity: 0.8 }} /> */}
        </div>
      </div>
    </div>
  );
};
export default Loading;
