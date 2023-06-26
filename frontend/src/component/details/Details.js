import React, { useEffect, useState } from "react";
import "./details.css";
import {
  Container,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip,
  Card,
 
} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FiClipboard, FiEdit3,FiRotateCcw } from "react-icons/fi";
import { InputControl } from "./InputControl";
import Loader from "../loader/Loader";

const Details = () => {
  let navigate = useNavigate();
  const location = useLocation();
  let { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [show, toggleShow] = useState(false);
  const total = location.state ? location.state.totalObjects : [];
  console.log(location)

  const [inputText, setInputText] = useState(total);
  const [finalUrl, setFinalUrl] = useState("");
  const [data, setData] = useState([]);


  useEffect(() => {
    setLoading(true);
    const multipleTag = () => {
      // const url = `http://localhost:5000/api/v1/preview/${id}?`;
      const url = `http://13.234.238.121:5000/api/v1/preview/${id}?`;
      try {
        if (inputText === undefined || inputText === null) {
          console.log("No input field");
          return;
        } else {
          var stringQ = [];
          inputText.forEach((tag) => {
            stringQ.push(tag.text);
          });
          var finalURL = "";
          inputText.forEach((tag, index) => {
            finalURL +=
              "&" + tag.text + "=" + `${data[index] ? data[index] : tag.text}`;
          });
          var wowo = url + finalURL;
          console.log(wowo)
          setFinalUrl(wowo);
          return finalURL;
        }
      } catch (error) {
        console.log(error);
      }
    };
    multipleTag();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [data, id, inputText]);

  let inputHandler = (e, index) => {
    const { value } = e.target;

    setData((prevData) => {
      const newData = [...prevData];

      newData[index] = value;
      return newData;
    });
  };

  let handleCopyText = (e) => {
    const imgTag = document.querySelector("#imgCopy").textContent;
    console.log(imgTag)

    navigator.clipboard
      .writeText(imgTag)
      .then(() => {
        toggleShow(true);
        setTimeout(() => {
          toggleShow(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard", err);
        alert("Failed to copy to clipboard.");
      });
  };

  let editHandler = () => {
    navigate(`/image/${id}`);
  };

  let randomName = () =>{

  }

  return (
    <React.Fragment>
      <Container fluid="md">
        <Row>
          <DropdownButton
            id="dropdown-basic-button"
            title={
              <>
                <FiEdit3 className="ms-2 me-2" /> Edit
              </>
            }
            variant="success"
          >
            <Dropdown.Item onClick={editHandler}>Edit</Dropdown.Item>
          </DropdownButton>
        </Row>

        <hr />
        <Row className="mt-4 mb-5">
          <Tabs
            defaultActiveKey="home"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab
              eventKey="home"
              title="Image Tag"
              style={{ background: "#fff" }}
            >
              <Row className="bg-primary text-light mt-5 p-2">
                <Col>Heading</Col>
                <Col className="text-end">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        {show ? "Copied" : "Click to copy"}
                      </Tooltip>
                    }
                  >
                    <span
                      className="d-inline-block"
                      style={{ cursor: "pointer",border:'1px solid red' }}
                      onClick={handleCopyText}
                      
                    >
                      <FiClipboard />
                    </span>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row className="box shadow p-5 ">
                <span className="text-center" id="imgCopy">
                  {/* {`<img  src="http://localhost:5000/api/v1/preview/${id}" />`} */}
                   {`<img  src=${finalUrl ? finalUrl: null} />`}
                  {/* {`<img  src="http://44.206.234.148:5000/api/v1/preview/${id}?test="233" />`} */}
                </span>
              </Row>
            </Tab>
            <Tab eventKey="profile" title="Live Preview" className="bg-light">
              <Row className="mt-5">
                <Col md={2}>
                  <Card className="product-card">
                    <Card.Body>
                      <Card.Title className="product-title mb-4">
                        Image Variable
                      </Card.Title>
                      {inputText
                        ? inputText.map((object, index) => (
                            <div key={index}>
                              {object.type === "textbox" ? (
                                <>
                              <div className="d-flex justify-content-between">
                              <span>{object.text}</span>
                              <span ><FiRotateCcw cursor="pointer" onClick={randomName} fontSize={20} /></span>
                              </div>
                                  <InputControl
                                    
                                    object={object}
                                    inputHandler={inputHandler}
                                    index={index}
                                  />
                                  <hr className="bottom-shadow" />
                                </>
                              ) : null}
                            </div>
                          ))
                        : null}
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="text-center">
                  {loading ? (
                    <Loader />
                  ) : (
                    <img
                      className="w-50"
                      src={
                        finalUrl
                          ? finalUrl
                          : 
                          // `http://localhost:5000/api/v1/preview/${id}`
                          `http://13.234.238.121:5000/api/v1/preview/${id}`
                      }
                      alt=""
                      loading="lazy"
                    />
                  )}
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Details;
