/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { Closeicon } from "../../assets/icons/closeicon";
import { ReactComponent as LogoIcon } from "../../assets/icons/logo.svg";
import Button from "../button";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    background: "#ffffff",
    border: "1px solid transparent",
    borderRadius: "4px",
    padding: "20px 40px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "50%",
    height: "fit-content",
  },
};

// Modal component
const WelcomeModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-row-reverse items-end">
        <button
          onClick={onRequestClose}
          className=" text-gray-500 hover:text-gray-700 cursor-pointer w-8 h-8 has-svg"
        >
          <Closeicon />
        </button>
      </div>
      <div className="illustration w-2/3 has-svg mx-auto">
        <LogoIcon />
      </div>
      <p className="italic text-center text-sm">
        Built For SEN Schools in Nigeria
      </p>
      <div className="container mt-4 mx-auto px-4 py-8">
        <p className="text-xl text-bold text-gray-800 mb-5 text-center">
          Platform Features
        </p>
        <ul className="list-disc pl-6">
          <li className="mb-3">
            <span className="text-bold">
              Account registration and onboarding:
            </span>
            Set up teacher/consultant accounts for your staff and manage student
            data.
          </li>
          <li className="mb-3">
            <span className="text-bold">
              Curriculum planning and Goals/Targets Setting:
            </span>{" "}
            Create IEPs (term curriculums), short-term goals and targets.
          </li>
          <li className="mb-3">
            <span className="text-bold">Documentation and Reporting:</span> Fill
            detailed assessment reports, generate termly report, school and
            staff reports.
          </li>
        </ul>
      </div>
      <div className="flex flex-row-reverse items-end">
        <Button
          click={() => onRequestClose()}
          type="secondary"
          extraClasses="w-auto mb-4 ml-3"
          size="small"
        >
          <span className="text-p1">Close</span>
        </Button>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
