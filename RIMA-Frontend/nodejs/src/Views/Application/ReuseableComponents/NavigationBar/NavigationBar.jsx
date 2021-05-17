import React, {useState} from "react";
import {Button, Form, FormControl, ListGroup, Nav, Navbar, NavDropdown, OverlayTrigger} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {getItem} from "../../../../Services/utils/localStorage";
import axios from "axios";
import {BASE_URL} from "../../../../Services/constants";
import {logout} from "../../../../Services/helper";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SideBar from "./SideBar";

export default function NavigationBar() {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const history = useHistory();


  const toggleOpen = () => {
    setOpen(!open);
  };


  const getInfo = (v) => {
    const TOKEN = getItem("accessToken");
    axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${v}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then(({data}) => {
      setSuggestions(data);
    });
  };


  const onBlur = () => {
    setValue("");
  };


  const onChange = (event) => {
    let {value} = event.target;
    if (value.replace(/\s+/g, '').length > 1) {
      setValue(value);
      getInfo(value);
    } else {
      setValue(value)
      setSuggestions([]);
    }
  };


  const getSuggestionValue = (suggestion) => {
    return suggestion.first_name;
  }


  const customStyle = {
    brand: {
      color: '#fff',
      marginBottom: 0
    },
    bgColor: {
      backgroundColor: "#172B4D",
      zIndex: 9
    },
    listGroup: {
      zIndex: 10,
      width: 250
    }
  }

  return (
    <>
      <Navbar variant="dark" expand="lg" sticky="top" style={customStyle.bgColor}>

        <Button variant="link" style={customStyle.bgColor} onClick={toggleOpen}>
          <FontAwesomeIcon icon={faBars} size="lg" color="white"/>
        </Button>

        <Navbar.Brand className="mr-auto" onClick={() => history.push("/")} style={{cursor: "pointer"}}>
          <h1 style={customStyle.brand}>RIMA</h1>
          <h6 className="text-uppercase" style={customStyle.brand}>
            A transparent Recommendation and Interest Modeling Application
          </h6>
        </Navbar.Brand>

        <OverlayTrigger
          placement="bottom"
          delay={{show: 250, hide: 400}}
          show={setSuggestions.length}
          overlay={
            <ListGroup style={customStyle.listGroup}>
              {suggestions.map((suggestion, index) => {
                localStorage.setItem("userId", suggestion.id);
                return (
                  <ListGroup.Item
                    style={{cursor: "pointer"}}
                    key={index}
                    onClick={() => history.push(`/app/profile/${suggestion.id}`)}>
                    {`${suggestion.first_name} ${suggestion.last_name}`}
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          }>
          <Form inline>
            <FormControl type="text" placeholder="Search for users..." className="mr-sm-2"
                         onChange={(e) => onChange(e)}/>
          </Form>
        </OverlayTrigger>

        <Nav>
          <NavDropdown title="Settings" id="basic-nav-dropdown" alignRight>
            <NavDropdown.Item onClick={() => history.push("/app/user-profile")}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item onClick={logout}>
              Log-out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <SideBar
        open={open}
        toggleOpen={toggleOpen}
      />
    </>
  );
}
