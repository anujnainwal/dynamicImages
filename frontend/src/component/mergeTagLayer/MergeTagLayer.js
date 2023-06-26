import React, { useEffect, useState } from "react";
import "./style/mergeLayer.css";
import { Button, Form, Modal } from "react-bootstrap";
import { fabric } from "fabric";

let storedArray = JSON.parse(localStorage.getItem('kText'))

const MergeTagLayer = ({ editor, setMergeOpen, onChange }) => {
  const [show, setShow] = useState(false);

  const [formValues, setFormValues] = useState({
    mergeTagName: "",
    fallbackText: "",
    designValue: "",
    tagType: "string",
    textCasting: "",
    minCharacter: "",
    maxCharacter: "",
  });
  const [formErrors, setFormErrors] = useState({
    mergeTagNameError: "",
    errorTagName: false,
  });
  const [textArray, setTextArray] = useState(storedArray ? storedArray : []);
  const [editingIndex, setEditingIndex] = useState(null); // Newly added state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value.trim() });
  };

  const createNewTextbox = (text) => {
    const textbox = new fabric.IText(text, {
      left: 50,
      top: 50,
      fill: `#fff`,
      fontFamily: "Arial",
      fontSize: 50,
      editable: false,
      textAlign: "center",
      width: 500,
      cornerStyle: "rect",
    });
    return textbox;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formValues.mergeTagName === "") {
      setFormErrors({
        mergeTagNameError: "This field is required.",
        errorTagName: true,
      });
    } else {
      setFormErrors({
        mergeTagNameError: "",
        errorTagName: false,
      });

      if (editingIndex !== null) {
        // Editing an existing merge tag
        const updatedTextArray = textArray.map((text, index) => {
          if (index === editingIndex) {
            return formValues.mergeTagName;
          }
          return text;
        });
        let activeObject = editor.canvas.getActiveObject();
        const updateObject= activeObject.set("text", updatedTextArray.toString());
        console.log('=====>',updateObject);
        // const updateText = createNewTextbox(formValues.mergeTagName);
        console.log("editing::::", activeObject);
        // setTextArray(updatedTextArray);
        setEditingIndex(null); // Reset editing index
        setShow(false);
      } else {
        // Creating a new merge tag
        const newTextbox = createNewTextbox(formValues.mergeTagName);
        editor.canvas.add(newTextbox);
        editor.canvas.setActiveObject(newTextbox);
        editor.canvas.renderAll();

        setTextArray( prevData => [...prevData,newTextbox]);
        console.log(textArray)
        localStorage.setItem('kText',JSON.stringify(textArray))
        setShow(false);
      }
      // localStorage.setItem('kText',JSON.stringify(textArray))
      setShow(false);
      setFormValues({
        mergeTagName: "",
        fallbackText: "",
        designValue: "",
        tagType: "string",
        textCasting: "",
        minCharacter: "",
        maxCharacter: "",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 32 || e.code === "Space") {
      e.preventDefault();
    }
  };

  const handleDelete = (id) => {
    let canvas = editor.canvas;
    let activeObject = canvas.getActiveObject();
    canvas.remove(activeObject);
    const updatedTextArray = textArray.filter((_, index) => index !== id);
    setTextArray(updatedTextArray);
  };
  useEffect(() => {
    if (editor) {
      let activeObject = editor.canvas.getActiveObject();
      console.log(activeObject)
  

     
    }
  }, [editor]);

  const renameMergeTag = (newText, id) => {
    setShow(true);
    setEditingIndex(id); // Set the editing index
    setFormValues({
      mergeTagName: newText,
      fallbackText: "",
      designValue: "",
      tagType: "string",
      textCasting: "",
      minCharacter: "",
      maxCharacter: "",
    });
  };

  return (
    <>
      <section className="mergeLayer">
        <div className="heading">
          <h4>Choose A Merge Tag</h4>
        </div>

        <div className="text-para font-monospace p-2">
          <span>
            {textArray.length > 0
              ? "Editing and Deleting a Merge Tag does not affect current and past images. Change the future image layers."
              : "Merge Tags are passed in the URL from your ESP and inserted dynamically into the image."}
          </span>

          {textArray.length > 0 ? (
            <ul className="editLabel">
              {textArray.map((data, index) => (
                <li key={index}>
                  {data.text}
                  <div>
                    <button
                      className="m-2"
                      onClick={() => renameMergeTag(data.text, index)}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <h2>false</h2>
          )}
        </div>

        <Modal show={show} onHide={() => setShow(false)} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingIndex !== null
                ? "Edit Merge Tag"
                : "Basic Merge Tag Defaults"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <>
                <Form.Group className="mb-3" controlId="mergeTagName">
                  <Form.Label>Merge Tag</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Merge Tag name."
                    name="mergeTagName"
                    value={formValues.mergeTagName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    isInvalid={formErrors.errorTagName}
                  />
                  {formErrors.errorTagName && (
                    <Form.Control.Feedback type="invalid">
                      {formErrors.mergeTagNameError}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    This is a friendly name to use in the URL of your image.
                    i.e. http://example.com?name=
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="fallbackText">
                  <Form.Label>Fallback Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Use when Merge Tag is NOT present or valid. Can be changed later"
                    name="fallbackText"
                    value={formValues.fallbackText}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="designValue">
                  <Form.Label>Design Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Strictly for design purposes. Can be changed later"
                    name="designValue"
                    value={formValues.designValue}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>

              <Button variant="primary" type="submit" className="text-end">
                {editingIndex !== null ? "Update" : "Submit"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Button onClick={() => setShow(true)}>
          {editingIndex !== null ? "Edit Merge Tag" : "Add or Edit Merge Tags"}
        </Button>
      </section>
    </>
  );
};

export default MergeTagLayer;
