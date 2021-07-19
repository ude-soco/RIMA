// Start from choose conferences again!

//Done by Swarna
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "d3-transition";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

/* Chart code */
// Themes begin
// Themes end

import {Button, Row, Col, Label} from "reactstrap";

window.$value = "";

class VennChart extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectValueYear1 = this.selectValueYear1.bind(this);
    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      isLoaded: false,
      active1: true,
      active2: false,
      items_y1: [],
      items_y2: [],
      items_y12: [],
      arr_keys: [],
      arr_vals: [],
      loader: false,
      display: "none",
      display1: "none",
      selectValue2: "",
      selectVal: "",
      data: [],
      confEvents: [],
      conferences:[],
      selectValueConf1: "",
      selectValueConf2:"",
      items_confCompare: [],
      selectyear: "",

    
    };
  }

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };

  componentDidMount() {
    //console.log("the json is ******************")
    this.setState({
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(BASE_URL_CONFERENCE + "commontopics/lak/2011/2012")
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectVal: "2011",
          selectValue2: "2012",
          items_y1: json.commontopics,
          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });


      fetch(`${BASE_URL_CONFERENCE}confEvents/lak`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          confEvents: json.years,
        })
      });

    }

//BAB:BEGIN::10.06.2021 
 
  selectYear = (e) => {
    this.setState({
      selectyear: e.value,
    });
  }
    

  selectValueConf = (e, whichConf) => {
    if(whichConf == "first"){
    this.setState({
      selectValueConf1: e.value,
    });
  }else if(whichConf == "second")
  {
    this.setState({
    selectValueConf2: e.value,
     });
   }
  }
 //BAB:END::10.06.2021 

  selectValueYear1(e) {
    this.setState({
      selectVal: e.value,
    });
  }

  selectKey(e) {
    this.setState({
      active1: false,
      active2: true,
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(
      BASE_URL_CONFERENCE +
      "commonkeys/" + this.props.conferenceName + "/"+
      this.state.selectVal +
      "/" +
      this.state.selectValue2
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectValue: e.value,
          items_y1: json.commontopics,
          items_confCompare: json.commontopics,   //BAB
          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });
  }

  selectTopic(e) {
    this.setState({
      active1: true,
      active2: false,
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(
      BASE_URL_CONFERENCE +
      "commontopics/" + this.props.conferenceName + "/"+
      this.state.selectVal +
      "/" +
      this.state.selectValue2
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectValue: e.value,
          items_y1: json.commontopics,
          items_confCompare: json.commontopics,
          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });
  }

  selectValue(e) {
    this.setState({
      selectValue2: e.value,
    });
  }

  render() {
    var {
      isLoaded,
      desc,
      selectValue2,
      selectVal,
      items_y1,
      display1,
      display,
      loader,
      active1,
      active2,
      selectValueConf1,
      selectValueConf2,
      items_confCompare,
      selectyear,
    } = this.state;

    const data =  this.props.confEvents; // BAB 09.06.2021  years/data can be passed in props with the conference name.
    const conferences = this.props.conferences;   // BAB 09.06.2021  years/data can be passed in props with the conference name.
    //var{items,arr_keys,arr_vals}=this.state;
    if (isLoaded && this.props.page == 'topicreasearch') {   // BAB 09.06.2021  years/data can be passed in props with the conference name.
      return (
        <>
          <div/>
          {console.log(desc)}
          <br/>
          <React.Fragment>
            <h2>Common topics/keywords</h2>
            <br/>
            <p>
              This visualization provides common topics/keywords of two confernces for the
              selected year
            </p>
            <br/>
            <Label>Select two conferences to compare</Label>

            <Row>
              <Col>
                <Select
                  placeholder="first conference "
                  options={conferences}
                  value={conferences.find((obj) => obj.value === selectValueConf1)}
                  //onChange={this.selectvalueConf(this,"first")}
                  onchange = {(e) => this.selectvalueConf(e,"first")}
                />
              </Col>
              <Col>
                <Select
                  placeholder="second conference"
                  options={conferences}
                  value={conferences.find((obj) => obj.value === selectValueConf2)}
                  //onChange={this.selectValueConf(this,"second")}
                  onchange = {(e) => this.selectvalueConf(e,"second")}

                />
              </Col>
            </Row>
            <br/>
            <Label>Select a year</Label>
            <div style={{width: "200px"}}>
                <Select
                  placeholder="Select Year"
                  options={data}
                  value={data.find((obj) => obj.value === selectyear)}
                  onChange={this.selectYear}
                />
              </div>

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
              value="keyword"
              color="primary"
              active={active2}
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
                  width: "500px",
                  height: "40px",
                  color: "#8E8E8E",
                  border: "1px solid #BDBDBD",
                }}
              >
                <p>Info about common topics between two years of conference</p>
              </div>
            )}
            <br/>
            <br/>

            <Row>
              <div
                style={{
                  backgroundColor: "white",
                  display: display1,
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

              <div style={{display: display}}>
                <img
                  src={`data:image/png;base64,${items_y1}`}
                  style={{marginLeft: "50px"}}
                />
              </div>
            </Row>
          </React.Fragment>
        </>
      );
    }
    else if (isLoaded && this.props.page == 'topicbar'){

      return ( <>
        <div/>
        {console.log(desc)}
        <br/>
        <React.Fragment>
          <h2>Common topics/keywords</h2>
          <br/>
          <p>
            This visualization provides common topics/keywords for the
            selected year
          </p>
          <br/>
          <Label>Select two years to compare</Label>
          <Row>
            <Col>
              <Select
                placeholder="Year1"
                options={data}
                value={data.find((obj) => obj.value === selectVal)}
                onChange={this.selectValueYear1}
              />
            </Col>
            <Col>
              <Select
                placeholder="Year2"
                options={data}
                value={data.find((obj) => obj.value === selectValue2)}
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
            value="keyword"
            color="primary"
            active={active2}
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
                width: "500px",
                height: "40px",
                color: "#8E8E8E",
                border: "1px solid #BDBDBD",
              }}
            >
              <p>Info about common topics between two years of conference</p>
            </div>
          )}
          <br/>
          <br/>

          <Row>
            <div
              style={{
                backgroundColor: "white",
                display: display1,
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

            <div style={{display: display}}>
              <img
                src={`data:image/png;base64,${items_y1}`}
                style={{marginLeft: "50px"}}
              />
            </div>
          </Row>
        </React.Fragment>
      </>
      );
      
    } 
    
    else {
      return ( 
        <>
        {/*
          <h2>hi</h2>
          <br/>
          <p>
            This visualization provides common topics/keywords for the selected
            year
          </p>
          <br/>
          <Label>Select two years to compare</Label>
          <Row>
            <Col>
              <Select
                placeholder="Year1"
                options={data}
                value={data.find((obj) => obj.value === selectVal)}
                onChange={this.selectValueYear1}
              />
            </Col>
            <Col>
              <Select
                placeholder="Year2"
                options={data}
                value={data.find((obj) => obj.value === selectValue2)}
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
            value="keyword"
            color="primary"
            active={active2}
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
                width: "500px",
                height: "40px",
                color: "#8E8E8E",
                border: "1px solid #BDBDBD",
              }}
            >
              <p>Info about common topics between two years of conference</p>
            </div>
          )}

          <br/>
          <br></br>
          <div
            style={{
              backgroundColor: "white",
              display: display1,
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
          */ }
        </>
     );
          
         }
  }
}

export default VennChart;
