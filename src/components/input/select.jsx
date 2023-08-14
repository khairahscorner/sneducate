/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ArrowdownIcon } from "../../assets/icons/arrowdown";

export const Select = ({
  selectText,
  label,
  selected,
  rowType,
  labelClasses,
  selectClasses,
  children,
  error,
  message,
}) => {
  const [isShow, setIsShow] = useState(false);
  const [dropdown, setdropdown] = useState("none");

  useEffect(() => {
    if (isShow) {
      setdropdown("flex");
    } else {
      setdropdown("none");
    }
  }, [isShow]);

  useEffect(() => {
    setIsShow(false);
  }, [selected]);

  let opendropdown = () => {
    setIsShow(!isShow);
  };

  const wrapperRef = useRef(null);

  // below is the same as componentDidMount and componentDidUnmount
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  return (
    <div ref={wrapperRef}>
      <div
        className={`${
          rowType ? "grid grid-cols-5 gap-2 items-center" : ""
        } relative`}
      >
        <label
          className={`text-p2 font-medium text-type mb-1 capitalize ${
            rowType && `${labelClasses ? labelClasses : "col-span-1"}`
          }`}
        >
          {label}
        </label>
        <div
          onClick={(e) => {
            e.stopPropagation();
            opendropdown();
          }}
          className={`relative z-10 select pointer w-full h-12 rounded flex justify-between items-center mt-0.5  ${
            rowType && (selectClasses ? selectClasses : "col-span-4")
          }`}
        >
          <span className="text-sm">{selected ? selected : selectText}</span>
          <span className={`${isShow ? "svg-rotate" : ""}`}>
            <ArrowdownIcon />
          </span>
        </div>
        {error && <p className="text-p3 text-red-500">{message}</p>}

        <div
          className={`absolute right-0 z-20 w-4/5 select-dropdown overflow-hidden transition transform origin-top ${
            dropdown === "flex"
              ? "flex p-2 opacity-1 translate-y-0"
              : "h-0 opacity-0 -translate-y-2 p-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
