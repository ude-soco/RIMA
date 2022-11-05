import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import Autosuggest from "react-autosuggest";
import { getItem } from "Services/utils/localStorage";
import { BASE_URL } from "../../../Services/constants";
import { logout } from "../../../Services/helper";
import axios from "axios";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  InputGroupAddon,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  NavbarToggler,
  UncontrolledCollapse,
  Container,
  Row,
  Col,
} from "reactstrap";
import { setItem } from "Services/utils/localStorage";

function getSuggestionValue(suggestion) {
  // debugger;
  return suggestion.first_name;
}

function renderSuggestion(suggestion) {
  // debugger;

  return (
    <Link to={`/app/profile/${suggestion.id}`}>
      <div
        style={{ padding: "10px 20px" }}
      >{`${suggestion.first_name} ${suggestion.last_name}`}</div>
    </Link>
  );
}

class Sidebar extends React.Component {
  state = {
    collapseOpen: false,
    dropdownOpen: false,
    query: "",
    results: [],
    activeSuggestion: 0,
    showSuggestions: false,
    popupVisible: false,
    suggestions: [],
    value: "",
    userView: false,
    collapsed:true
   
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.toggleNavbar=this.toggleNavbar.bind(this)
  }

  _onBlur = () => {
    this.setState({
      value: "",
    });
  };

  // componentDidMount() {
  //   this.manageUserView();
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.path == this.state.path) {
  //     this.manageUserView();
  //   }
  // }

  // manageUserView = () => {
  //   if (matchPath(window.location.pathname, { path: "/app/profile/:id" })) {
  //     console.log("ttttttttttt",this.props)
  //     this.setState({ userView: true, path: this.props.location.pathname,searchedUserID: getItem("Id") });
  //   } else {
  //     this.setState({ userView: false, path: this.props.location.pathname,searchedUserID: getItem("Id") });
  //   }
  // };

  //** START SUGGESTION**//
  toggleNavbar(){
    this.setState({
      collapsed:false
    })
    
  }
  getInfo = (v) => {
    const TOKEN = getItem("accessToken");
    axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${v}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then(({ data }) => {
      this.setState({
        suggestions: data,
        popupVisible: !this.state.popupVisible,
      });
    });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.getInfo(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };
  // setDropdownOpen(!dropdownOpen);
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // closes the collapse
  closeCollapse = () => {
    // this.manageUserView();
    this.setState({
      collapseOpen: false,
    });
  };
  goBackProfile = () => {
    setItem("userId", getItem("mId"));
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/app") {
      return (
        <NavItem key={key} style={{ display: prop.display }}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    }
    });
  };
  createRecommendationLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/recommendation") {
        return (
            <NavItem key={key} style={{ display: prop.display }}>
              <NavLink
                  to={prop.layout + prop.path.replace(":id", getItem("userId"))}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
              >
                <i className={prop.icon} />
                {prop.name}
              </NavLink>
            </NavItem>
        );
      }
    });
  };
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Search for users..",
      value,
      onChange: this.onChange,
      onBlur: this._onBlur,
    };

    const { routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link,
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank",
      };
    }
    const style = { width: "300px" };
    return (
     
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
        style={style}
      >
        <Container fluid >
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <span style={{ fontWeight: "bolder", color: "#1189ef" }}>
              RIMA
            </span>
          </NavbarBrand>

          {/* User */}
          <Nav className="align-items-center d-md-none">
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle"></span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/app/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem to="/" onClick={(e) => logout()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>RIMA</Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Form */}
            <Form className="mt-4 mb-3 d-md-none">
              <InputGroup className="input-group-rounded input-group-merge">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />

                <InputGroupAddon addonType="prepend"></InputGroupAddon>
              </InputGroup>
            </Form>
            {getItem("userId") === getItem("mId") && (
              <>
                <h6 className="navbar-heading text-muted">Data Management</h6>
                <hr className="my-2" />

                {/* Navigation */}
                <Nav navbar>{this.createLinks(routes)}</Nav>

                <hr className="my-3" />
              </>
            )}
            <h6 className="navbar-heading text-muted">Visualizations</h6>
            <hr className="my-2" />
            {getItem("userId") !== getItem("mId") && (
              <>
                <Nav navbar>
                  <NavItem>
                    <NavLink
                      to="/app/user-profile"
                      tag={NavLinkRRD}
                      onClick={this.goBackProfile}
                      activeClassName="active"
                    >
                      <i className="fa fa-chevron-circle-left text-info" />
                      Return To My Account
                    </NavLink>
                  </NavItem>
                </Nav>
                <Nav navbar>
                  <NavItem>
                    <NavLink
                      to={"/app/profile/" + getItem("userId")}
                      tag={NavLinkRRD}
                      activeClassName="active"
                    >
                      <i className="fa fa-user text-blue" />
                      Profile
                    </NavLink>
                  </NavItem>
                </Nav>
              </>
            )}

            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/cloud-chart/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-cloud text-info" />
                  Interest Overview
                </NavLink>
              </NavItem>
            </Nav>

            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/pie-chart/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-chart-pie text-orange" />
                  Recent Interests
                </NavLink>
              </NavItem>
            </Nav>

            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/bar-chart/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-chart-bar text-pink" />
                  Activities
                </NavLink>
              </NavItem>
            </Nav>

            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/concept-chart/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-brain text-blue" />
                  Potential Interests
                </NavLink>
              </NavItem>
            </Nav>

            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/stream-chart/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-wave-square text-green"></i>
                  Interest Trends
                </NavLink>
              </NavItem>
            </Nav>

            <hr className="my-2" />
            <h6 className="navbar-heading text-muted">My Recommendations</h6>
            <hr className="my-2" />
            <Nav navbar>
              {this.createRecommendationLinks(routes)}
              <NavItem>
                <NavLink
                  to={"/app/topicsrecommend/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-book-reader text-green"></i>
                  Publications
                </NavLink>
              </NavItem>
            </Nav>
            <hr className="my-2" />
            <h6 className="navbar-heading text-muted">Conference Insights</h6>
            <hr className="my-2" />
            {/* <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/topicform/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-atom text-blue"></i>
                  Topic Cloud
                </NavLink>
              </NavItem>
            </Nav> 
            <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/topicbar/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-chart-line text-pink"></i>
                  Topic Trends
                </NavLink>
              </NavItem>
            </Nav>
            */}
          
          <Nav navbar>

          <NavItem>
                <NavLink
                  to={"/app/topicbar/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-chart-line text-pink"></i>
                  Topic Trends
                </NavLink>
              </NavItem>


          <NavItem>
            <NavLink href={"/app/topicsresearch/" + getItem("userId")}
                  
                 
                >
                  <i className="fas fa-handshake text-blue"></i>
                  Compare Conference
                </NavLink>
            </NavItem>
            <NavItem>
            <NavLink href={"/app/topicsauthors/" + getItem("userId")}
                 
                >
                  <i className="fas fa-user-friends text-green"></i>
                  Compare Researcher
                </NavLink>
            </NavItem>
           
          </Nav>
       
      
            {/* <Nav navbar>
              <NavItem>
                <NavLink
                  to={"/app/topicscompare/" + getItem("userId")}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className="fas fa-align-center text-green"></i>
                  Comparisons
                </NavLink>
              </NavItem>
            </Nav> */}
           
          </Collapse>
        </Container>
      </Navbar>
      
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}],
};


Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
