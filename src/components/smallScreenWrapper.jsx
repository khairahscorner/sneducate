import styled from "styled-components";
import Logo from "../assets/icons/logo.svg";

const Wrapper = styled.div`
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
  .wrapper {
    position: relative;
    width: 80%;
    top: 53%;
    margin: 0 auto;
    transform: translateY(50%);
    text-align: center;
  }
`;

export const SmallScreenMessage = () => {
  return (
    <Wrapper>
      <img src={Logo} alt="preloader logo" />
      <div className="wrapper">
        <p className=" text-bold italic text-sm">
          Not available on mobile or small screens. Please access the
          application using laptop/desktop/bigger tablets.
        </p>
      </div>
    </Wrapper>
  );
};
