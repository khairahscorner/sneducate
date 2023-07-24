/* eslint-disable react/prop-types */

const Button = ({
  type,
  children,
  click,
  disabled,
  id,
  extraClasses,
  size,
}) => {
  return (
    <button
      id={id}
      disabled={disabled}
      onClick={click}
      className={`font-semibold rounded text-p2 text-center transition
        ${extraClasses}
        ${
          size === "big"
            ? `px-6 py-3`
            : size === "small"
            ? `px-4 py-2`
            : "px-4 py-2"
        }
        ${disabled ? `opacity-40 cursor-not-allowed` : `opacity-100`}
        ${
          type === "primary"
            ? `bg-primary text-white hover:bg-primary-bg`
            : type === "secondary"
            ? `bg-neutral-200 text-type-100 hover:bg-neutral-100`
            : type === "delete"
            ? `bg-status-danger text-white hover:bg-status-danger-100`
            : "bg-primary text-white hover:bg-primary-bg"
        }`}
    >
      {children}
    </button>
  );
};

export default Button;
