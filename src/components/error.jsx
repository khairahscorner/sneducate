/* eslint-disable react/prop-types */
export const ErrorMessage = ({ message, ...rest }) => {
  return (
    <>
      {message ? (
        <div {...rest} className="bg-status-danger-bg text-status-danger mt-1 p-3 rounded">
          <p className="text-p2">{message}</p>
        </div>
      ) : null}
    </>
  );
};
