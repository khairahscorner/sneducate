/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { Closeicon } from "../../assets/icons/closeicon";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    zIndex: 100,
  },
  content: {
    background: "#ffffff",
    border: "1px solid transparent",
    borderRadius: "4px",
    padding: "20px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "50%",
    height: "fit-content",
  },
};

// Modal component
const CustomModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      style={customStyles}
      ariaHideApp={false} // To prevent accessibility errors
    >
      <div className="flex flex-row-reverse items-end">
        <button
          onClick={onRequestClose}
          className=" text-gray-500 hover:text-gray-700 cursor-pointer w-8 h-8 has-svg"
        >
          <Closeicon />
        </button>
      </div>
      {children}
    </Modal>
  );
};

export default CustomModal;
