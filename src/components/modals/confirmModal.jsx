/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { Closeicon } from "../../assets/icons/closeicon";
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
    padding: "20px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "50%",
    height: "fit-content",
  },
};

// Modal component
const ConfirmationModal = ({
  isOpen,
  onRequestClose,
  confirmAction,
  type,
  message,
}) => {
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
      <h2 className=" text-h3 font-bold mb-3">Confirm Action?</h2>
      <p className="mb-8">Are you sure you want to carry out this action? {message}</p>
      <div className="flex flex-row-reverse items-end">
        <Button
          click={() => onRequestClose()}
          type="secondary"
          extraClasses="w-auto mb-4 ml-3"
          size="big"
        >
          <span className="text-p1">Cancel</span>
        </Button>
        <Button
          click={() => confirmAction()}
          type={type ? type : "primary"}
          extraClasses="w-auto mb-4"
          size="big"
        >
          <span className="text-p1">Continue</span>
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
