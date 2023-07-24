/* eslint-disable react/prop-types */
import { useState } from "react";
import { HidePasswordIcon } from "../../assets/icons/hideeye";
import { ShowPasswordIcon } from "../../assets/icons/showeye";

export const TextinputwithLeftIcon = ({
  label,
  inputid,
  message,
  onclickicon,
  iserror,
  ...rest
}) => {
  const [isHideEye, setIsHideEye] = useState(true);
  const clickicon = () => {
    setIsHideEye(!isHideEye);
  };
  return (
    <div className="flex flex-col">
      <label className="text-p2 font-medium text-type mb-1" htmlFor={inputid}>
        {label}
      </label>
      <div
        className={`bg-neutral-300 border rounded flex items-center justify-between font-normal px-2 py-3 transition focus-within:border-type focus-within:ring-0
                ${iserror ? "border-status-danger" : "border-neutral-200"}`}
      >
        <input
          className=" placeholder-type-200 bg-transparent text-p2 w-11/12 text-type p-0 border-0 focus:ring-0 focus:outline-none"
          id={inputid}
          {...rest}
        />
        <div onClick={clickicon}>
          {isHideEye ? (
            <span className="pointer" onClick={onclickicon}>
              <HidePasswordIcon />
            </span>
          ) : (
            <span className="pointer" onClick={onclickicon}>
              <ShowPasswordIcon />
            </span>
          )}
        </div>
      </div>
      {iserror ? (
        <small className="text-status-danger mt-1">{message}</small>
      ) : null}
    </div>
  );
};
