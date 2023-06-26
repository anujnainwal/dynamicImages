import React, { useEffect, useRef, useState } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { fontFamily, fontStyle } from "../../data";
import { BiText, BiShapeTriangle } from "react-icons/bi";
import { MdFeedback } from "react-icons/md";
import "./imageLayered.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { Modal, NavDropdown } from "react-bootstrap";
import { BsTextLeft, BsTextCenter, BsTextRight } from "react-icons/bs";
import Layer from "../objectLayer/Layer";
import MergeTagLayer from "../mergeTagLayer/MergeTagLayer";
import ImageUploader from "../imageUploader/ImageUploader";
import Shapes from "../shapes/Shapes";
import { AiFillSetting, AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import Loader from "../loader/Loader";

const ImageLayered = () => {
  let testRef = useRef(null);
  let { id } = useParams();
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openShape, setOpenShape] = React.useState(false);
  const [ImageOpen, setImageOpen] = React.useState(false);
  const [loaded, setLoaded] = useState(false);
  const { editor, onReady } = useFabricJSEditor();
  const [isLoading, setIsLoading] = useState(false);

  let [MergeOpen, setMergeOpen] = useState(false);
  const [Active, setActiveColor] = useState("center");
  const [lgShow, setLgShow] = useState(false);
  const [locked, setLocked] = useState(false);
  const [mergerBox, setOpenMergeBox] = useState(false);
  const [textArray, setTextArray] = useState([]);
  const [isBoldActive, setIsBoldActive] = useState("");
  const [isItalicActive, setItalicActive] = useState("");
  const [isUnderLine, setUnderline] = useState("");


  useEffect(() => {
    if (editor) {
      const canvas = editor.canvas;

      // set default canvas dimensions
      canvas.setDimensions({ width: 800, height: 600 });

      const activeObject = canvas.getActiveObject();
      

      if (!activeObject) {
        setOpen(false);
        setOpenShape(false);
        // setMergeOpen(false)
      } else if (
        activeObject.type === "rect" ||
        activeObject.type === "circle"
      ) {
        setOpen(false);
        setOpenShape(true);
        setMergeOpen(false);
      } else if (activeObject.type === "i-text") {
        setOpen(false);
        setOpenShape(false);
        setMergeOpen(true);
      } else if (
        activeObject.type === "textbox" ||
        activeObject.type === "Image"
      ) {
        setOpen(true);
        setOpenShape(false);
        setMergeOpen(false);

        // set custom delete control for Textbox and Image objects
        fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -20,
          offsetX: 20,
          cursorStyle: "pointer",
          mouseUpHandler: handleDelete,
          render: renderIcon,
          cornerSize: 24,
        });
        fabric.Image.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -20,
          offsetX: 20,
          cursorStyle: "pointer",
          mouseUpHandler: handleDelete,
          render: renderIcon,
          cornerSize: 24,
        });
        fabric.Circle.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -20,
          offsetX: 20,
          cursorStyle: "pointer",
          mouseUpHandler: handleDelete,
          render: renderIcon,
          cornerSize: 24,
        });
        fabric.Rect.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -20,
          offsetX: 20,
          cursorStyle: "pointer",
          mouseUpHandler: handleDelete,
          render: renderIcon,
          cornerSize: 24,
        });

        if (open) {
          document.getElementById("formBasicEmail").value = activeObject.text;
          document.getElementById("fontColorId").value = activeObject.fill;
          document.getElementById("font-family").value =
            activeObject.fontFamily;
          // console.log(activeObject.textAlign);
          document.getElementById("textAlign").value = activeObject.textAlign;
        }
      }

      // adjust canvas dimensions based on loaded image
      const imgObj = canvas.backgroundImage;
      if (imgObj) {
        const canvasWidth = imgObj.width;
        const canvasHeight = imgObj.height;
        const widthRatio = canvas.getWidth() / canvasWidth;
        const heightRatio = canvas.getHeight() / canvasHeight;
        const scale = Math.min(widthRatio, heightRatio);
        imgObj.scale(scale);
        canvas.setDimensions({
          width: canvasWidth * scale,
          height: canvasHeight * scale,
        });
        canvas.centerObject(imgObj);
      }

      canvas.setBackgroundColor("lightblue");
      canvas.renderAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, open, renderIcon]);

  useEffect(() => {
    let controller = new AbortController();

    if (!loaded) {
      axiosInstance
        .get(`/image/${id}`, { signal: controller.signal })
        .then((res) => {
          let { Imgdata } = res.data;
          editor.canvas.clear();
          editor.canvas.loadFromJSON(Imgdata, () => {
            setLoaded(true);
          });
        })
        .catch((err) => {});

      return () => {
        controller.abort();
      };
    }
  }, [id, editor, loaded]);

  const setFontColor = (color) => {
    editor.canvas.getActiveObject().set("");
    editor.canvas.getActiveObject().set("fill", color);
    editor.canvas.renderAll();
  };

  const setFontFamily = (fontFamily) => {
    console.log(editor.canvas);
    editor.canvas.getActiveObject().set("fontFamily", fontFamily);
    editor.canvas.renderAll();
  };

  const setFontSize = (fontSize) => {
    editor.canvas.getActiveObject().set("fontSize", fontSize);
    editor.canvas.renderAll();
  };

  const setTextInput = (text) => {
    editor.canvas.getActiveObject().set("text", text);
    editor.canvas.renderAll();
  };
  var deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  var img = document.createElement("img");
  img.src = deleteIcon;
  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
  const clickHandler = (e) => {
    setOpen(true);
    const text = new fabric.Textbox("Default Text", {
      left: 50,
      top: 50,
      fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fontFamily: "Arial",
      fontSize: 50,
      editable: true,
      textAlign: "center",
      width: 500,
      cornerStyle: "rect",
    });

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);

    editor.canvas.renderAll();
  };

  //handle delete object
  const handleDelete = () => {
    if (editor.canvas.getActiveObject()) {
      setLgShow(true);
    } else {
      console.log("Do nothing. delete");
      return;
    }
  };

  const setTextAlignMent = (val) => {
    console.log(val);
    editor.canvas.getActiveObject().set("textAlign", val);
    editor.canvas.renderAll();
    setActiveColor(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsLoading(true)
    const canvasHeight = editor.canvas.getHeight();
    const canvasWidth = editor.canvas.getWidth();

    const jsonData = editor.canvas.toJSON();

    axiosInstance
      .post(`/save`, {
        idImage: id,
        data: jsonData,
        canvasHeight: canvasHeight,
        canvasWidth: canvasWidth,
      })
      .then((res) => {
        setIsLoading(true);
        if (res.status === 200) {
          setIsLoading(false);
          navigate("/details/" + id, {
            state: { totalObjects: jsonData.objects },
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  //LockHandler
  const lockHandler = () => {
    let activeObject = editor.canvas.getActiveObject();
    if (activeObject.type === "activeSelection") {
      activeObject._objects.forEach(function (item) {
        item.selectable = false;
        item.evented = false;
        item.hoverCursor = "pointer";
      });
    } else {
      activeObject.selectable = false;
      activeObject.evented = false;
      activeObject.hoverCursor = "default";
      setLocked(true);
    }

    editor.canvas.discardActiveObject().renderAll();
  };

  //Unlock Handler
  const unlockHandler = () => {
    var items = editor.canvas.getObjects();

    if (!items) {
      return;
    }

    items.forEach(function (item) {
      if (item.selectable === false) {
        item.selectable = true;
        item.hoverCursor = "move";
        item.evented = true;
      }
      setLocked(false);
    });

    editor.canvas.discardActiveObject().renderAll();
  };

  //
  let MergeTagHandler = () => {
    setMergeOpen(true);
  };
  const handleFontStyle = (value) => {
    let obj = editor.canvas.getActiveObject();
    let type = obj.type;

    if (obj && type === "textbox") {
      switch (value) {
        case "bold":
          obj.set("fontWeight", obj.fontWeight === "bold" ? "normal" : "bold");
          // const isActive = obj.fontWeight
          setIsBoldActive(obj.fontWeight === "bold" ? "bold" : "");

          break;
        case "italic":
          obj.set("fontStyle", obj.fontStyle === "italic" ? "" : "italic");
          setItalicActive(obj.fontStyle === "italic" ? "italic" : "");
          break;
        case "underline":
          obj.set(
            "textDecoration",
            obj.textDecoration === "underline" ? "" : "underline"
          );
          setUnderline(obj.textDecoration === "underline" ? "underline" : "");
          break;
        default:
          break;
      }

      editor.canvas.renderAll();
    }
  };

  const clickShapeHandler = () => {
    setOpenShape(true);
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: `red`,
      radius: 50,
    });

    // setLastObject(circle);
    editor.canvas.add(circle);
    circle.set({ type: "circle" });
    editor.canvas.setActiveObject(circle);

    editor.canvas.renderAll();
  };

  if (isLoading === true) {
    return <Loader />;
  }

  return (
    <>
      <Nav className="nav-background custom_navbar">
        <div style={{ margin: "0 40px" }} className="left_navbar">
          <NavLink to="/" className="me-3 custom_link">
            <span>
              <AiOutlineHome fontSize={20} />
            </span>
            Home
          </NavLink>

          <span className="middle_line"></span>
          <NavLink to="/" className="ms-3 custom_link">
            <span>
              <MdFeedback fontSize={20} />
            </span>
            Feedback
          </NavLink>
        </div>
        <div className="d-xl-flex">
          <Button className="btn-preview">Preview</Button>
          <Button style={{ margin: "0 15px" }} onClick={handleSubmit}>
            Save
          </Button>

          <span className="right_line"></span>
          <NavDropdown
            className="nav-link"
            style={{ margin: "0 -25px" }}
            title={<AiOutlineMenu fontSize={20} color="white" />}
            id="navbarScrollingDropdown"
          >
            <NavLink to="/">
              <NavDropdown.Item href="/">Dashboard</NavDropdown.Item>
            </NavLink>
            <NavDropdown.Divider />{" "}
            <NavLink to="/images">
              <NavDropdown.Item href="/images">
                Personalize Image
              </NavDropdown.Item>
            </NavLink>
          </NavDropdown>

          <NavDropdown
            className="nav-link"
            style={{ margin: "0 -25px" }}
            title={<AiFillSetting fontSize={20} />}
            id="navbarScrollingDropdown"
          >
            <NavLink to="/">
              <NavDropdown.Item href="/">Dashboard</NavDropdown.Item>
            </NavLink>
            <NavDropdown.Divider />{" "}
            <NavLink to="/images">
              <NavDropdown.Item href="/images">
                Personalize Image
              </NavDropdown.Item>
            </NavLink>
          </NavDropdown>
        </div>
      </Nav>

      <section className="ImageLayered">
        {lgShow === true && (
          <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            className="d-flex justify-content-center align-items-center"
          >
            <Modal.Header>
              <Modal.Title id="example-modal-sizes-title-lg">
                You are about to delete this layer
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button
                onClick={() => setLgShow(false)}
                className="me-2 btn-danger"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  editor.canvas.remove(editor.canvas.getActiveObject());
                  setLgShow(false);
                }}
                className="btn-danger"
              >
                OK
              </Button>
            </Modal.Body>
          </Modal>
        )}
        <div className="leftpanel">
          {open === true ? (
            <section className="text__toolbar">
              <div className="default__heading">
                <h4>Text default Header</h4>
              </div>

              <form id="myFrom">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </Form.Group>
                <div className="m-4 text-end">
                  <Button
                    className={`ms-2 me-2 ${
                      Active === "left" ? "btnActive" : ""
                    }`}
                    id="textAlign"
                    onClick={(e) => setTextAlignMent("left")}
                  >
                    <BsTextLeft />
                  </Button>
                  <Button
                    className={`ms-2 me-2 ${
                      Active === "center" ? "btnActive" : ""
                    }`}
                    id="textAlign"
                    onClick={(e) => setTextAlignMent("center")}
                  >
                    <BsTextCenter />
                  </Button>
                  <Button
                    className={`ms-2 me-2 ${
                      Active === "right" ? "btnActive" : ""
                    }`}
                    id="textAlign"
                    onClick={(e) => setTextAlignMent("right")}
                  >
                    <BsTextRight />
                  </Button>
                </div>
                <Form.Select
                  name=""
                  className="mb-3"
                  id="font-family"
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  {fontFamily.map((data, id) => {
                    return (
                      <option key={id} value={data}>
                        {data}
                      </option>
                    );
                  })}
                </Form.Select>

                <div className="font__setting">
                  <div className="font-size">
                    <label htmlFor="font-Size">
                      Font Size:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <input
                      className="mb-3 p-1"
                      type="number"
                      name=""
                      id=""
                      min={0}
                      max={150}
                      step={1}
                      defaultValue="50"
                      onChange={(e) => setFontSize(e.target.value)}
                    />
                  </div>
                  <div className="font__color">
                    <label htmlFor="">
                      Font color:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <input
                      className="mb-3"
                      type="color"
                      id="fontColorId"
                      onChange={(e) => setFontColor(e.target.value)}
                    />
                  </div>
                  <div className=" d-flex justify-content-around mt-4">
                    {fontStyle.map((fontStyle, index) => {
                      let isActive = fontStyle.style === isBoldActive;

                      let isActiveItalic = fontStyle.style === isItalicActive;
                      let isUnderlineActive = fontStyle.style === isUnderLine;

                      return (
                        <Button
                          className={`${fontStyle.icon} ${
                            isActive || isActiveItalic || isUnderlineActive
                              ? "active"
                              : ""
                          }  `}
                          onClick={() => handleFontStyle(fontStyle.style)}
                          key={index}
                        >
                          {fontStyle.icon}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </form>
            </section>
          ) : MergeOpen === true ? (
            <MergeTagLayer
              editor={editor}
              setMergeOpen={setMergeOpen}
              openMerge={MergeOpen}
              open={mergerBox}
              textArray={textArray}
              onChange={(newValue) => {
                setTextArray(newValue);
              }}
              setOpen={setOpenMergeBox}
            />
          ) : openShape === true ? (
            <Shapes
              shapeOpen={openShape}
              setOpenShape={setOpenShape}
              editor={editor}
              fabric={fabric}
              handleDelete={handleDelete}
              renderIcon={renderIcon}
            />
          ) : (
            <>
              <div className="topHeader">
                <div className="heading" style={{ textAlign: "center" }}>
                  <h5>Click to Add Element</h5>
                </div>
                <div className="merge-box">
                  <span onClick={() => MergeTagHandler(true)}>Merge Tag</span>
                </div>
              </div>
              <span className="design_options">Design Options</span>
              <div className="centerHeader">
                <div className="box">
                  <button onClick={clickHandler}>
                    <BiText fontSize={18} />
                    Text
                  </button>
                  <ImageUploader editor={editor} />
                  <button onClick={clickShapeHandler}>
                    <BiShapeTriangle fontSize={18} />
                    Shapes
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="centeral__panel" id="centeral__panel">
          {mergerBox === true && (
            <h2 style={{ border: "1px solid red", zIndex: 1 }}>
              {console.log("dsad")}Helo
            </h2>
          )}
          {ImageOpen && (
            <ImageUploader
              setImageOpen={setImageOpen}
              ImageOpen={ImageOpen}
              testRef={testRef}
            />
          )}
          <FabricJSCanvas
            className={ImageOpen ? "modify_canvas" : "sample-canvas"}
            id="simple_canvas"
            onReady={onReady}
          ></FabricJSCanvas>
        </div>
        <div className="right__panel" id="right__panel">
          <Layer
            editor={editor}
            handleDelete={handleDelete}
            lock={lockHandler}
            unlock={unlockHandler}
            locked={locked}
          />
        </div>
      </section>
    </>
  );
};

export default ImageLayered;
