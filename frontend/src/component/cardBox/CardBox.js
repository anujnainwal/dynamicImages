import React from "react";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NavLink } from "react-router-dom";
import { BsFillFileImageFill } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";

const CardBox = (props) => {
  console.log(props);
  return (
    <React.Fragment>
      <Row>
        <Col md={3} lg={3}>
          <NavLink to="/upload" className="navLinks">
            <Card className="imagesLib m-2">
              <Card.Body style={{ textAlign: "center", padding: 30 }}>
                <BsFillFileImageFill />
                <Card.Title>
                  <br />
                  Personlized Image
                </Card.Title>
              </Card.Body>
            </Card>
          </NavLink>{" "}
          <NavLink to="/countdown" className="navLinks">
            <Card className="imagesLib m-2">
              <Card.Body style={{ textAlign: "center", padding: 30 }}>
                <BiTimer fontSize={40} color="blue" />
                <Card.Title>
                  <br />
                  Countdown Timmer
                </Card.Title>
              </Card.Body>
            </Card>
          </NavLink>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CardBox;
