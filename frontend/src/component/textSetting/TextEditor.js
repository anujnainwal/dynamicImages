import React from "react";
import { Button, Form } from "react-bootstrap";
import { fontFamily } from "../../data";
const TextEditor = () => {
  const handleTextEditor = (text) => {
    console.log(text);
  };
  return (
    <React.Fragment>
      <section className="text-section">
        <div className="heading">
          <h4>Text Default Heading</h4>
        </div>
        {/* text-alignment setting  */}
        <div className="text__aligment_setting">
          {["left", "center", "right"].map((title, index) => {
            return (
              <Button
                key={index}
                className="text_alignment"
                title={title}
                onClick={(e) => handleTextEditor(e.target.textContent)}
              >
                {title}
              </Button>
            );
          })}
        </div>
        {/* font-family AiFillSetting */}
        <div className="font-setting">
          <Form.Select>
            {fontFamily.map((font, index) => {
              return <option key={index}>{font}</option>;
            })}
          </Form.Select>
          {/* font size and font color */}
          <div className="fontsize font-color">
            <Form.Label>Font Size</Form.Label>
            <Form.Control type="number" id="font-size" placeholder="0" />
            <Form.Label>Font Color</Form.Label>
            <Form.Control type="color" id="font-color" placeholder="" />
          </div>
          {/* font-style */}
          <div className="font-style">
            {["normal", "bold", "italic", "underline"].map(
              (fontStyle, index) => {
                return (
                  <Button key={index} title={fontStyle}>
                    {fontStyle}
                  </Button>
                );
              }
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default TextEditor;
