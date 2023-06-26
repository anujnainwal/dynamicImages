import React from "react";
import { Form } from "react-bootstrap";
export const InputControl = ({ inputHandler, object, index }) => {
  return (
    <div>
      <Form.Control
        type="text"
       
        placeholder={object.text}
        index={index}
        data-id={index}
        
        onChange={(e) => inputHandler(e, index)}
      />
    </div>
  );
}; 
