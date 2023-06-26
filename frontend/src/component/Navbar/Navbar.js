import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AiFillSetting, AiOutlineMenu } from "react-icons/ai";
import "./style/navbar.css";
function TopHeader() {
  return (
    <Navbar
      style={{ background: "#F6F6F6" }}
      variant="dark"
      expand="lg"
      className="mb-4 p-2 "
    >
      <Container fluid="md">
        <Navbar.Brand>
          <NavLink to="/" className="d-flex align-items-center nav-link">
            <b>Dynamic</b>
            <span>Images</span>
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll d-flex">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: "120px" }}
            navbarScroll
          >
            <NavDropdown
              className="nav-link"
              title={<AiOutlineMenu fontSize={20} />}
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopHeader;
