import { PreloaderWrapper } from "./pageloader";

// eslint-disable-next-line react/prop-types
export const Placeholder = ({ message, children }) => {
  return (
    <PreloaderWrapper>
      <div className=" text-center text-medium text-p1 p-24 pb-7">{message}</div>
      {children}
    </PreloaderWrapper>
  );
};
