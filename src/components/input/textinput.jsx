/* eslint-disable react/prop-types */

export const Textinput = ({
  autocomplete,
  label,
  inputid,
  message,
  iserror,
  disabled,
  rowType,
  labelClasses,
  inputClasses,
  ...rest
}) => {
  return (
    <div
      className={`${
        rowType ? "grid grid-cols-5 gap-2 items-center" : "flex flex-col"
      }`}
    >
      <label
        className={`text-p2 font-medium text-type mb-1 capitalize ${
          rowType && `${labelClasses ? labelClasses : "col-span-1"} mr-2`
        }`}
        htmlFor={inputid}
      >
        {label}
      </label>
      <input
        className={`rounded placeholder-type-200 text-p2 font-normal px-2 py-3 transition focus:border-type focus:ring-0
        ${iserror ? "border-status-danger" : "border-neutral-200"} ${
          disabled
            ? "border-gray-100 bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-neutral-300 text-type"
        }
        ${rowType && (inputClasses ? inputClasses : "col-span-4")}`}
        id={inputid}
        disabled={disabled}
        autoComplete={autocomplete || "off"}
        {...rest}
      />
      {iserror ? (
        <small className="text-p3 text-status-danger mt-1 col-span-5">{message}</small>
      ) : null}
    </div>
  );
};
