import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ type, handleClose, message, showAlert }) => {
  return (
    <React.Fragment>
      {showAlert === true && (
        <Alert variant={`${type}`} onClose={handleClose} dismissible>
          {message}
        </Alert>
      )}
    </React.Fragment>
  );
};

export default AlertMessage;
