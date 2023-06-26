import React from "react";
import Form from "react-bootstrap/Form";
const DropDownTag = ({ items }) => {
  return (
    <Form.Select aria-label="Default select example">
      {items.map((item, key) => (
        <option key={key} value={item.value}>
          {item.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default DropDownTag;
