import styled from "styled-components";
import Logo from "../assets/icons/logo.svg";

const PreloaderWrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: relative;
    img {
        position: absolute;
        max-width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const Preloader = () => {
  return (
    <PreloaderWrapper>
      <img src={Logo} alt="preloader logo" />
    </PreloaderWrapper>
  )
};