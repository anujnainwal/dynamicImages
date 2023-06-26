import React, { useEffect } from "react";
import { Button, Form, InputGroup, Offcanvas } from "react-bootstrap";
import "./CanvasResize.css";
const CanvasResize = ({ editor, Open, setOpen }) => {
  const canvasWidthInput = document.querySelector("#canvas__width");

  useEffect(() => {
    if (editor && canvasWidthInput) {
      const width = editor.canvas.width;
      canvasWidthInput.value = width;
    }
  }, [editor, canvasWidthInput]);

  return (
    <section className="Canvas__Resize">
      <Button
        variant="primary"
        className="canvas_button"
        onClick={() => setOpen(true)}
      >
        Background
      </Button>

      <Offcanvas show={Open} onHide={() => setOpen(false)}>
        <div className="canvas__background">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <InputGroup className="mb-3 ">
              <InputGroup.Text
                id="basic-addon1"
                className=" bg-dark text-light"
              >
                Width
              </InputGroup.Text>
              <Form.Control
                type="number"
                className=" bg-dark text-light"
                placeholder="Enter Width"
                id="canvas__width"
                aria-label="wdith"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text
                id="basic-addon1"
                className=" bg-dark text-light"
              >
                Height
              </InputGroup.Text>
              <Form.Control
                type="number"
                className=" bg-dark text-light w-25"
                id="canvas__height"
                placeholder="Enter Height"
                aria-label="height"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Offcanvas.Body>
        </div>
      </Offcanvas>
    </section>
  );
};

export default CanvasResize;
