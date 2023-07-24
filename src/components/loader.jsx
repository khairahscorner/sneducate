import styled, { keyframes } from "styled-components";

const dot1 = keyframes`
    0% { transform: scale(0) }
    100% { transform: scale(1) }
`;
const dot2 = keyframes`
    0% { transform: translate(0, 0) }
    100% { transform: translate(16px, 0) }
`;
const dot3 = keyframes`
    0% { transform: scale(1) }
    100% { transform: scale(0) }
`;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .wrapper {
    width: 0;
    display: flex;
    align-items: center;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(50%);
    div {
      position: absolute;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ecc52c;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
      &:nth-child(1) {
        left: -20px;
        animation: ${dot1} 0.6s infinite;
      }
      &:nth-child(2) {
        left: -20px;
        animation: ${dot2} 0.6s infinite;
      }
      &:nth-child(3) {
        left: -4px;
        animation: ${dot2} 0.6s infinite;
      }
      &:nth-child(4) {
        left: 12px;
        animation: ${dot3} 0.6s infinite;
      }
    }
  }
`;

export default function Loader() {
  return (
    <Wrapper>
      <div className="wrapper">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Wrapper>
  );
}
