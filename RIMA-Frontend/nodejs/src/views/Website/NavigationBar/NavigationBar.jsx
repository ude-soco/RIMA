import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faLaptop} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

export default function NavigationBar() {
  const history = useHistory();

  const customStyle = {
    brand: {
      color: '#fff',
      marginBottom: 0
    },
    icon: {
      marginRight: 8
    },
    bgColor:{
      backgroundColor: "#172B4D"
    }
  }
  return (
    <>
      <Navbar variant="dark" expand="lg" sticky="top" shadow style={customStyle.bgColor}>
        <Navbar.Brand className="mr-auto" onClick={() => history.push("/")} style={{cursor: "pointer"}}>
          <h1 style={customStyle.brand}>RIMA</h1>
          <h6 className="text-uppercase" style={customStyle.brand}>
            A transparent Recommendation and Interest Modeling Application
          </h6>
        </Navbar.Brand>
        <Nav>
          <Nav.Link onClick={() => history.push("/auth/demo")}>
            <FontAwesomeIcon icon={faLaptop} style={customStyle.icon}/>
            Demo
          </Nav.Link>
          <Nav.Link onClick={() => history.push("/auth/login")}>
            <FontAwesomeIcon icon={faSignInAlt} style={customStyle.icon}/>
            Sign-in
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}
