import React, { Dispatch } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

// Ensure correct path

const CheckInControls = ({
  isControlsActive,
  setCheckInActive,
}: {
  isControlsActive: boolean;
  setCheckInActive: Dispatch<boolean>;
}) => {
  return (
    <div className="toast-center m-5 toast-bottom">
      <div className="alert alert-info flex bg-white border border-black text-black flex justify-between items-center w-full shadow-lg">
        <span className="flex items-center">
          <MapPinIcon className={`h-5 w-5 mr-2 ${isControlsActive ? "text-primary" : "text-gray-400"}`} />
          Tap the map to add your logbook entry.
        </span>
        <button
          className={`btn ${isControlsActive ? "btn-primary" : "btn-disabled custom-disabled"}`}
          disabled={!isControlsActive}
          onClick={() => setCheckInActive(true)}
        >
          RECORD
        </button>
      </div>
    </div>
  );
  // return (
  //   <div className="toast-center m-5 toast-bottom">
  //     <div className="alert alert-info flex bg-white border border-black text-black  flex justify-between items-center w-full">
  //       <span>Tap the map to add your logbook entry.</span>
  //       <div className="flex">
  //         <button className={`btn ${isControlsActive ? `btn-primary` : `btn-disabled`}`}>
  //           RECORD
  //         </button>
  //       </div>
  //       {/* <div
  //         className={`btn ${isControlsActive ? `btn-primary` : `btn-disabled`}`}
  //         onClick={() => setCheckInActive(true)}
  //       >
  //         RECORD
  //       </div> */}
  //     </div>
  //   </div>
  // );
};
export default CheckInControls;
