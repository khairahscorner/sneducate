/* eslint-disable react/prop-types */

export const Textinput = ({
  autocomplete,
  label,
  inputid,
  message,
  iserror,
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <label
        className="text-p2 font-medium text-type mb-1 capitalize"
        htmlFor={inputid}
      >
        {label}
      </label>
      <input
        className={`bg-neutral-300 rounded placeholder-type-200 text-type text-p2 font-normal px-2 py-3 transition focus:border-type focus:ring-0
        ${iserror ? "border-status-danger" : "border-neutral-200"}`}
        id={inputid}
        autoComplete={autocomplete || "off"}
        {...rest}
      />
      {iserror ? (
        <small className="text-p3 text-status-danger mt-1">{message}</small>
      ) : null}
    </div>
  );
};
