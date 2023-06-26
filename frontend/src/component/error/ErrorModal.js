import React from "react";
import Modal from "react-bootstrap/Modal";
import "./asset/errorModal.css";
const ErrorModal = ({
  title,
  handleShow,
  children,
  handleClose,
  setShow,
  show,
}) => {
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="error__uploading">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='error__body'>{children}</Modal.Body>
      </Modal>
    </div>
  );
};

export default ErrorModal;
