import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Shapes = ({ shapeOpen, setOpenShape, editor, fabric }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastObject, setLastObject] = useState(null);
  const [selectedShape, setSelectedShape] = useState("");
  const [color, setColor] = useState("#ef0b0b");
  const [borderWidth, setBorderWidth] = useState(1);
  const [type, setType] = useState("");
  const handleShapeChange = (event) => {
    const shape = event.target.value;
    setSelectedShape(shape);

    if (lastObject) {
      editor.canvas.remove(lastObject);
    }
  };
  useEffect(() => {
    const createRectangle = () => {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: `${color}`,
        width: 100,
        height: 100,
        borderColor: "white",
      });

      setLastObject(rect);
      editor.canvas.add(rect);
      rect.set({ type: "rect" });
      editor.canvas.setActiveObject(rect);
      editor.canvas.renderAll();
    };

    const createCircle = () => {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        fill: `${color}`,
        radius: 50,
      });

      setLastObject(circle);
      editor.canvas.add(circle);
      circle.set({ type: "circle" });
      editor.canvas.setActiveObject(circle);

      editor.canvas.renderAll();
    };

    const createTriangle = () => {
      const triangle = new fabric.Triangle({
        left: 100,
        top: 100,
        fill: `${color}`,
        width: 100,
        height: 100,
      });

      setLastObject(triangle);
      editor.canvas.add(triangle);
      editor.canvas.setActiveObject(triangle);

      editor.canvas.renderAll();
    };
    switch (selectedShape) {
      case "rectangle":
        createRectangle();
        break;
      case "circle":
        createCircle();
        break;
      case "triangle":
        createTriangle();
        break;
      default:
        break;
    }
    const canvas = editor.canvas.getActiveObject();
    let strokeWidth = canvas.strokeWidth;

    setType(`${canvas.type}`);

    setBorderWidth(strokeWidth);
  }, [
    color,
    editor.canvas,
    fabric.Circle,
    fabric.Rect,
    fabric.Triangle,
    selectedShape,
  ]);

  const colorChange = (event) => {
    setColor(event.target.value);
    editor.canvas.getActiveObject().set("fill", color);
    editor.canvas.renderAll();
  };

  const handleVisible = (event) => {
    const isChecked = event.target.checked;
    setIsVisible(isChecked);
  };
  const handleBorder = (event) => {
    setBorderWidth(event.target.value);
    editor.canvas.getActiveObject().set("strokeWidth", +borderWidth);
    editor.canvas.getActiveObject().set("stroke", "black");
    editor.canvas.renderAll();
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {borderWidth}
    </Tooltip>
  );

  return (
    <div className="sd">
      <h2>Shapes</h2>
      {shapeOpen === true && (
        <section className="p-2">
          <div className="heading">
            <h4>Shape Type</h4>
            <Form.Select
              aria-label="Default select example"
              value={selectedShape || type}
              onChange={handleShapeChange}
            >
              <option value="" disabled>
                None
              </option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </Form.Select>
          </div>

          <div className="shape-color d-flex justify-content-between mt-4 ">
            <p>Shape Color</p>
            <input
              type="color"
              id="borderColor"
              value={color}
              onChange={colorChange}
            />
          </div>

          <div className="switch-border">
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Add Border"
              onChange={handleVisible}
            />

            {isVisible && (
              <div className="border-config">
                <div className="border-color">
                  <h5>Border Color</h5>
                  <input type="color" />
                </div>

                <div className="border-width">
                  <Form.Label htmlFor="inputPassword5">Border Width</Form.Label>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <Form.Range
                      min={1}
                      max={100}
                      value={borderWidth}
                      id="borderRangeValue"
                      step={1}
                      onChange={handleBorder}
                    />
                  </OverlayTrigger>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
export default Shapes;
