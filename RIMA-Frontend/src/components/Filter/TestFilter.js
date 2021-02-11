import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  DropdownMenu,
  Col,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse,
} from "reactstrap";
import styled from "styled-components";
import Map from "./Map";
const StyledDropdownMenu = styled(DropdownMenu)`
  width: 400px;
  left: -90px !important;
  margin-top: 15px;
`;


const StyledButton = styled(Button)`
  && {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: none;
    color: black;
    border: none;
    box-shadow: none;
  }
  :active,
  :focus,
  :hover {
    background: none !important;
  }
`;

const Content = ({ onChange }) => {
  return (
    <>
      <StyledButton color="primary" className="mb-0" id="toggler1">
        <span>
          <svg
            viewBox="0 0 24 24"
            style={{ width: "20px", height: "20px" }}
            className="ml-2 mr-2"
          >
            <g>
              <path
                style={{ fill: "#BDC3C7" }}
                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
              ></path>
            </g>
          </svg>
          Tweet content
        </span>
        <svg
          className="ml-2 mr-2"
          style={{ width: "20px", height: "20px" }}
          viewBox="0 0 24 24"
        >
          <g>
            <path
              style={{ fill: "#BDC3C7" }}
              d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
            ></path>
          </g>
        </svg>
      </StyledButton>
      <UncontrolledCollapse toggler="#toggler1">
        <Card>
          <CardBody>
            <FormGroup row className="mb-0">
              <Label for="exampleEmail" className="pr-0" sm={3}>
                Showing
              </Label>
              <Col sm={9}>
                <Input
                  style={{ height: "30px" }}
                  type="select"
                  name="type"
                  // id="tweets_type"
                  className="rounded-0 py-0 px-2"
                  onChange={onChange}
                >
                  <option value="ALL">All tweets</option>
                  <option value="RECENT">Recent tweets</option>
                  <option value="POPULAR">Popular tweets</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row className="mb-0">
              <Label for="exampleSelect" className="pr-0 py-0" sm={3}>
                Written in
              </Label>
              <Col sm={9}>
                <Input
                  style={{ height: "30px" }}
                  type="select"
                  name="language"
                  // id="tweets_language"
                  onChange={onChange}
                  className="rounded-0 py-0 px-2"
                >
                  <option value="NY">Any Language</option>
                  <option value="AF">Afrikaans</option>
                  <option value="SQ">Albanian</option>
                  <option value="AR">Arabic</option>
                  <option value="HY">Armenian</option>
                  <option value="EU">Basque</option>
                  <option value="BN">Bengali</option>
                  <option value="BG">Bulgarian</option>
                  <option value="CA">Catalan</option>
                  <option value="KM">Cambodian</option>
                  <option value="ZH">Chinese (Mandarin)</option>
                  <option value="HR">Croatian</option>
                  <option value="CS">Czech</option>
                  <option value="DA">Danish</option>
                  <option value="NL">Dutch</option>
                  <option value="EN">English</option>
                  <option value="ET">Estonian</option>
                  <option value="FJ">Fiji</option>
                  <option value="FI">Finnish</option>
                  <option value="FR">French</option>
                  <option value="KA">Georgian</option>
                  <option value="DE">German</option>
                  <option value="EL">Greek</option>
                  <option value="GU">Gujarati</option>
                  <option value="HE">Hebrew</option>
                  <option value="HI">Hindi</option>
                  <option value="HU">Hungarian</option>
                  <option value="IS">Icelandic</option>
                  <option value="ID">Indonesian</option>
                  <option value="GA">Irish</option>
                  <option value="IT">Italian</option>
                  <option value="JA">Japanese</option>
                  <option value="JW">Javanese</option>
                  <option value="KO">Korean</option>
                  <option value="LA">Latin</option>
                  <option value="LV">Latvian</option>
                  <option value="LT">Lithuanian</option>
                  <option value="MK">Macedonian</option>
                  <option value="MS">Malay</option>
                  <option value="ML">Malayalam</option>
                  <option value="MT">Maltese</option>
                  <option value="MI">Maori</option>
                  <option value="MR">Marathi</option>
                  <option value="MN">Mongolian</option>
                  <option value="NE">Nepali</option>
                  <option value="NO">Norwegian</option>
                  <option value="FA">Persian</option>
                  <option value="PL">Polish</option>
                  <option value="PT">Portuguese</option>
                  <option value="PA">Punjabi</option>
                  <option value="QU">Quechua</option>
                  <option value="RO">Romanian</option>
                  <option value="RU">Russian</option>
                  <option value="SM">Samoan</option>
                  <option value="SR">Serbian</option>
                  <option value="SK">Slovak</option>
                  <option value="SL">Slovenian</option>
                  <option value="ES">Spanish</option>
                  <option value="SW">Swahili</option>
                  <option value="SV">Swedish </option>
                  <option value="TA">Tamil</option>
                  <option value="TT">Tatar</option>
                  <option value="TE">Telugu</option>
                  <option value="TH">Thai</option>
                  <option value="BO">Tibetan</option>
                  <option value="TO">Tonga</option>
                  <option value="TR">Turkish</option>
                  <option value="UK">Ukrainian</option>
                  <option value="UR">Urdu</option>
                  <option value="UZ">Uzbek</option>
                  <option value="VI">Vietnamese</option>
                  <option value="CY">Welsh</option>
                  <option value="XH">Xhosa</option>
                </Input>
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
      </UncontrolledCollapse>
    </>
  );
};
const Location = ({ onChange, updateInputs, state, onRadiusChange }) => {
  // console.log('location sttate',state)
  return (

    <>
      <StyledButton color="primary" className="mb-0" id="toggler2">
        <span>
          <svg
            viewBox="0 0 24 24"
            style={{ width: "20px", height: "20px" }}
            className="ml-2 mr-2"
          >
            <g>
              <path
                style={{ fill: "#BDC3C7" }}
                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
              ></path>
            </g>
          </svg>
          Location
        </span>
        <svg
          className="ml-2 mr-2"
          style={{ width: "20px", height: "20px" }}
          viewBox="0 0 24 24"
        >
          <g>
            <path
              style={{ fill: "#BDC3C7" }}
              d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
            ></path>
          </g>
        </svg>
      </StyledButton>
      <UncontrolledCollapse toggler="#toggler2">
        <Card>
          <CardBody>
            <FormGroup row className="mb-0">
              <Col sm={12} className="py-2">
                <div className="form-group row">
                  <Map
                    updateInputs={updateInputs}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBF8GocK_UlMewvjkyrftsHsSEqABBduxo"
                    loadingElement={
                      <div style={{ height: `300px`, width: "100%" }} />
                    }
                    containerElement={
                      <div style={{ height: `300px`, width: "100%" }} />
                    }
                    mapElement={
                      <div style={{ height: `300px`, width: "100%" }} />
                    }
                    place={state.place}
                  />
                </div>
                <div className="form-group row p-0 m-0">
                  <label
                    className="col-1 col-form-label p-0 mx-1 my-auto"
                    htmlFor="lng"
                  >
                    <small>Lng</small>
                  </label>
                  <input
                    type="text"
                    className="col-2 p-0 mx-0 my-1"
                    // id="lng"
                    name="lng"
                    value={state.lng}
                    onChange={onChange}
                  />

                  <label
                    className="col-1 col-form-label p-0 mx-1 my-auto"
                    htmlFor="lat"
                  >
                    <small>Lat</small>
                  </label>
                  <input
                    type="text"
                    className="col-2 p-0 mx-0 my-1"
                    name="lat"
                    value={state.lat}
                    onChange={onChange}
                  />

                  <label
                    className="col-1 col-form-label p-0 mx-1 my-auto"
                    htmlFor="radius"
                  >
                    <small>R</small>
                  </label>
                  <input
                    type="number"
                    className="col-2 p-0 mx-0 my-1"
                    name="radius"
                    value={state.radius}
                    onChange={onRadiusChange}
                  />
                  <label
                    className="col-1 col-form-label p-0 mx-1 my-auto"
                    htmlFor="radius"
                  >
                    <small>KM</small>
                  </label>
                </div>
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
      </UncontrolledCollapse>
    </>

 );
};

const Engagment = ({ onChange, state }) => {
  // console.log("mellon");
  // console.log(state);
  // console.log(onChange);

  return (
    <>
      <StyledButton color="primary" className="mb-0" id="toggler3">
        <span>
          <svg
            viewBox="0 0 24 24"
            style={{ width: "20px", height: "20px" }}
            className="ml-2 mr-2"
          >
            <g>
              <path
                style={{ fill: "#BDC3C7" }}
                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
              ></path>
            </g>
          </svg>
          Engagment
        </span>
        <svg
          viewBox="0 0 24 24"
          style={{ width: "20px", height: "20px" }}
          className="ml-2 mr-2"
        >
          <g>
            <path
              style={{ fill: "#BDC3C7" }}
              d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
            ></path>
          </g>
        </svg>
      </StyledButton>
      <UncontrolledCollapse toggler="#toggler3">
        <div className="p-3 m-0">
          <div className="form-group row p-0 m-0 d-flex justify-content-around">
            <label
              className="col-3 col-form-label p-0 mx-2 my-auto"
              htmlFor="retweets"
            >
              <small>At Least</small>
            </label>
            <input
              type="text"
              name="retweets"
              onChange={onChange}
              className="col-2 p-0 mx-0 my-1"
              value={state.retweets}
              // id="retweets"
            />

            <div className="col-2  p-0 mx-0 my-auto">
              <svg
                className="ml-2 mr-2"
                style={{ width: "20px", height: "20px" }}
                viewBox="0 0 24 24"
              >
                <g>
                  <path
                    style={{ fill: "#BDC3C7" }}
                    d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="col-4 p-0 mx-0 my-auto">
              <small>Retweets</small>
            </div>
          </div>
          <div className="form-group row p-0 m-0 d-flex justify-content-around">
            <label
              className="col-3 col-form-label p-0 mx-2 my-auto"
              htmlFor="favorites"
            >
              <small>at least</small>
            </label>
            <input
              type="text"
              className="col-2 p-0 mx-0 my-1"
              name="favorites"
              onChange={onChange}
              value={state.favorites}

              // id="favorites"
            />

            <div className="col-2  p-0 mx-0 my-auto">
              <svg
                viewBox="0 0 24 24"
                style={{ width: "20px", height: "20px" }}
                className="ml-2 mr-2"
              >
                <g>
                  <path
                    style={{ fill: "#BDC3C7" }}
                    d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="col-4 p-0 mx-0 my-auto">
              <small>likes</small>
            </div>
          </div>
          <div className="form-group row p-0 m-0 d-flex justify-content-around">
            <label
              className="col-3 col-form-label p-0 mx-2 my-auto"
              htmlFor="replies"
            >
              <small>and at least</small>
            </label>

            <input
              type="text"
              className="col-2 p-0 mx-0 my-1"
              // id="replies"
              name="replies"
              value={state.replies}
              onChange={onChange}
            />

            <div className="col-2 p-0 mx-0 my-auto">
              <svg
                viewBox="0 0 24 24"
                style={{ width: "20px", height: "20px" }}
                className="ml-2 mr-2"
              >
                <g>
                  <path
                    style={{ fill: "#BDC3C7" }}
                    d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="col-4 p-0 mx-0 my-auto">
              <small>replies</small>
            </div>
          </div>
        </div>
        {/* </Col>
        </div> */}
      </UncontrolledCollapse>
    </>
  );
};


export default class TestFilter extends Component {
  constructor(props) {
    super(props);
    this.mode = this.props.mode;
    this.tagId = this.props.tagId;
    this.some = "kk"
    // console.log("props:", this.props);
  }

  onRadiusChange(e) {
    console.log(e.target.value);
    if (!this.mode){
      this.props.changeHandler("radius", e.target.value);
    } else {
      this.props.changeHandler(this.tagId, "radius", e.target.value);
    }
  }

  onContentChange(e){
    this.some = e ;

    // console.log(e);
    // console.log(e.target.name, ":", e.target.value);
    // console.log("Filter Mode:", this.props.mode)
    if (!this.mode){
      this.props.changeHandler(e.target.name, e.target.value);
    }
    else {
      console.log("TAG CONTENT CHANGE ID:", this.tagId);
      this.props.changeHandler(this.tagId, e.target.name, e.target.value);
    }
  }

  updateInputs = (x) => {
    this.some = x;
    // console.log("coord:", x.lat, x.lng);
    if (!this.mode){
      this.props.changeHandler("lat", x.lat);
      this.props.changeHandler("lng", x.lng);
    } else {
      this.props.changeHandler(this.tagId, "lat", x.lat);
      this.props.changeHandler(this.tagId, "lng", x.lng);
    }
    // this.props.changeHandler("radius", x.radius);
  };


  render() {
    return (
      <StyledDropdownMenu>
        {this.props.children}
{/*         <div>
          <Content state={this.props.state} onChange={this.onContentChange.bind(this)} />
        </div> */}
{/*         {this.props.state?
           <><div>
           <Location onRadiusChange={this.onRadiusChange.bind(this)} updateInputs={this.updateInputs} state={this.props.state} onChange={this.props.changeHandler} />
         </div>
         <div>
           <Engagment onChange={this.onContentChange.bind(this)} state={this.props.state} />
         </div>
         </>
        :<></>} */}

      </StyledDropdownMenu>
    );
  }
}
