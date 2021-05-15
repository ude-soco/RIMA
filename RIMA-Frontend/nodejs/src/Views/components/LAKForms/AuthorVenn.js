//Done by Swarna
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "d3-transition";
import {BASE_URL_INTEREST} from "../../../Services/constants";
import {Label} from "reactstrap";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
/* Chart code */
// Themes begin
// Themes end

import {Button, Row, Col} from "reactstrap";

window.$value = "";

class AuthorVenn extends Component {
  constructor(props) {
    super(props);

    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectAuthor = this.selectAuthor.bind(this);
    this.selectValue = this.selectValue.bind(this);

    this.state = {
      isLoaded: false,
      items_y1: [],
      items_y2: [],
      items_y12: [],
      items_authors: [],
      year: "",
      arr_keys: [],
      arr_vals: [],
      author: "",
      active1: false,
      active2: false,
      loader: false,
      selectValue2: "",
      display: "none",
      selectVal: "",
      data: [],
      display1: "none",
      textholder:
        "Researchers loading...Please wait till researchers dropdown is loaded.",
      txtdisplay: "block",
    };
  }

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };

  componentWillMount() {
    fetch(BASE_URL_INTEREST + "fetchallauthorsdict/")
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        this.setState({
          items_authors: json.authors.sort((a, b) =>
            a.label > b.label ? 1 : -1
          ),
          textholder: "Researchers dropdown loaded",
          txtdisplay: "block",
        });
      });
  }

  handleInput(e) {
    this.setState({
      selectVal: e.target.value,
    });
    console.log("val is:", e.target.value);
  }

  selectValue(e) {
    this.setState({
      year: e.value,
    });
  }

  selectAuthor(e) {
    this.setState({
      author: e.value,
      txtdisplay: "none",
    });
  }

  selectTopic(e) {
    this.setState({
      display: "block",
      display1: "none",
      loader: true,
    });
    var selectVal = this.state.selectVal;
    fetch(
      BASE_URL_INTEREST +
      "authorconfcomparison/" +
      e.target.value +
      "/" +
      this.state.author +
      "/" +
      this.state.year
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          active2: false,
          active1: true,

          items_y1: json.compare,

          isLoaded: true,
          loader: false,
          display1: "block",
        });
      });
  }

  selectKey(e) {
    this.setState({
      display: "block",
      display1: "none",
      loader: true,
    });

    fetch(
      BASE_URL_INTEREST +
      "authorconfcomparison/" +
      e.target.value +
      "/" +
      this.state.author +
      "/" +
      this.state.year
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          active1: false,
          active2: true,
          items_y1: json.compare,
          isLoaded: true,
          loader: false,
          display1: "block",
        });
      });
  }

  render() {
    var {
      isLoaded,
      active1,
      active2,
      loader,
      year,
      items_y1,
      items_authors,
      textholder,
      txtdisplay,
      author,
      display,
      display1,
    } = this.state;

    const data = [
      {
        value: "all years",
        label: "all years",
      },
      {
        value: "2011",
        label: "2011",
      },
      {
        value: "2012",
        label: "2012",
      },
      {
        value: "2013",
        label: "2013",
      },
      {
        value: "2014",
        label: "2014",
      },
      {
        value: "2015",
        label: "2015",
      },
      {
        value: "2016",
        label: "2016",
      },
      {
        value: "2017",
        label: "2017",
      },
      {
        value: "2018",
        label: "2018",
      },
      {
        value: "2019",
        label: "2019",
      },
      {
        value: "2020",
        label: "2020",
      },
    ];
    //var{items,arr_keys,arr_vals}=this.state;
    if (isLoaded) {
      return (
        <>
          <div>
            <h2>Common Topics/Keywords - Researcher and Conference</h2>
            <br/>
            <p>
              This visualization displays the common topics/keywords of selected
              researcher and selected year of conference
            </p>
            <br/>
            <div>
              <Row>
                <Col>
                  <Label>Select Researcher</Label>
                  <Select
                    placeholder="Researcher"
                    options={items_authors}
                    value={items_authors.find((obj) => obj.value === author)}
                    onChange={this.selectAuthor}
                  />
                  <div style={{display: txtdisplay, color: "green"}}>
                    <Label>{textholder}</Label>
                  </div>
                  {/* <Input type="text" name="authorid" id="authorid" placeholder="Enter authorid" onMouseLeave={this.handleInput}/> */}
                </Col>

                <Col>
                  <Label>Select a Year</Label>
                  <Select
                    placeholder="Year"
                    options={data}
                    value={data.find((obj) => obj.value === year)}
                    onChange={this.selectValue}
                  />
                </Col>
              </Row>
              <br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectTopic}
              >
                Topic
              </Button>
              <Button
                outline
                value="key"
                active={active2}
                color="primary"
                onClick={this.selectKey}
              >
                Keyword
              </Button>
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
              />
              {this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    marginTop: "0px",
                    position: "relative",
                    left: "205px",
                    width: "550px",
                    height: "40px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    Info about common topics/keywords between author and
                    conference
                  </p>
                </div>
              )}

              <br/>
              <br/>

              <div
                style={{
                  display: display,
                  backgroundColor: "white",
                  marginBottom: "20px",
                  width: "100px",
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <Loader
                  type="Bars"
                  visible={loader}
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              </div>

              <img
                src={`data:image/png;base64,${items_y1}`}
                style={{marginLeft: "50px", display: display1}}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <h2>Common Topics/Keywords - Researcher and Conference</h2>
            <br/>
            <p>
              This visualization displays the common topics/keywords of selected
              researcher and selected year of conference
            </p>
            <br/>
            <div>
              <Row>
                <Col>
                  <Label>Select Researcher</Label>
                  {/* <Input type="text" name="authorid" id="authorid" placeholder="Enter authorid" onMouseLeave={this.handleInput} /> */}
                  <Select
                    placeholder="Researcher"
                    options={items_authors}
                    value={items_authors.find((obj) => obj.value === author)}
                    onChange={this.selectAuthor}
                  />
                  <div style={{display: txtdisplay, color: "green"}}>
                    <Label>{textholder}</Label>
                  </div>
                </Col>

                <Col>
                  <Label>Select a Year</Label>
                  <Select
                    placeholder="Year"
                    options={data}
                    value={data.find((obj) => obj.value === year)}
                    onChange={this.selectValue}
                  />
                </Col>
              </Row>

              <br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectTopic}
              >
                Topic
              </Button>
              <Button
                outline
                value="key"
                active={active2}
                color="primary"
                onClick={this.selectKey}
              >
                Keyword
              </Button>
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
              />
              {this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    marginTop: "0px",
                    position: "relative",
                    left: "205px",
                    width: "550px",
                    height: "40px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    Info about common topics/keywords between author and
                    conference
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                display: display,
                backgroundColor: "white",
                marginBottom: "20px",
                width: "100px",
                marginLeft: "300px",
                marginTop: "100px",
                position: "absolute",
              }}
            >
              <Loader
                type="Bars"
                visible={loader}
                color="#00BFFF"
                height={100}
                width={100}
              />
            </div>
          </div>
        </>
      );
    }
  }
}

export default AuthorVenn;
