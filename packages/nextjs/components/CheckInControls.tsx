import React, { Dispatch } from "react";

const CheckInControls = ({
  isControlsActive,
  setCheckInActive,
}: {
  isControlsActive: boolean;
  setCheckInActive: Dispatch<boolean>;
}) => {
  return (
    <div className="toast-center m-5 toast-bottom">
      <div className="alert alert-info flex">
        <span>Tap the map to add your logbook item.</span>
        <div
          className={`btn ${isControlsActive ? `btn-primary` : `btn-disabled`}`}
          onClick={() => setCheckInActive(true)}
        >
          RECORD
        </div>
      </div>
    </div>
  );
};
export default CheckInControls;
