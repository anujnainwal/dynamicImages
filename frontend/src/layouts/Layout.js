import React from "react";
import TopHeader from "../component/Navbar/Navbar";
import { Button, Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Layout = ({ children, title, type }) => {
  return (
    <React.Fragment>
      <TopHeader />
      <Container fluid="md">
        {
          title ? <Row className="mb-5">
          <Col>
            <div className="headerText">
              <h3>{title}</h3>
            </div>
          </Col>
          {type === "home" && (
            <Col className="text-end">
              <NavLink to="/images" className="navLinks">
                <Button variant="primary">Create Image</Button>
              </NavLink>
            </Col>
          )}

          <br />
          <hr style={{ marginTop: 12 }} />
        </Row>:null
        }
      </Container>
      {children}
    </React.Fragment>
  );
};

export default Layout;
