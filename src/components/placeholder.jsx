import { PreloaderWrapper } from "./pageloader";

// eslint-disable-next-line react/prop-types
export const Placeholder = ({ message }) => {
  return (
    <PreloaderWrapper>
      <div className=" text-center p-24">{message}</div>
    </PreloaderWrapper>
  );
};
