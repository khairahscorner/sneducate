/* eslint-disable react/prop-types */
export const Closeicon = ({ height, width, color }) => {
  return (
    <svg
      width={width || "24"}
      height={height || "24"}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.0002 26.1L13.5002 36.6C13.2002 36.9 12.8502 37.05 12.4502 37.05C12.0502 37.05 11.7002 36.9 11.4002 36.6C11.1002 36.3 10.9502 35.95 10.9502 35.55C10.9502 35.15 11.1002 34.8 11.4002 34.5L21.9002 24L11.4002 13.5C11.1002 13.2 10.9502 12.85 10.9502 12.45C10.9502 12.05 11.1002 11.7 11.4002 11.4C11.7002 11.1 12.0502 10.95 12.4502 10.95C12.8502 10.95 13.2002 11.1 13.5002 11.4L24.0002 21.9L34.5002 11.4C34.8002 11.1 35.1502 10.95 35.5502 10.95C35.9502 10.95 36.3002 11.1 36.6002 11.4C36.9002 11.7 37.0502 12.05 37.0502 12.45C37.0502 12.85 36.9002 13.2 36.6002 13.5L26.1002 24L36.6002 34.5C36.9002 34.8 37.0502 35.15 37.0502 35.55C37.0502 35.95 36.9002 36.3 36.6002 36.6C36.3002 36.9 35.9502 37.05 35.5502 37.05C35.1502 37.05 34.8002 36.9 34.5002 36.6L24.0002 26.1Z"
        fill={color || "#1E2329"}
      />
    </svg>
  );
};
