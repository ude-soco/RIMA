// Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 
import React, { Component } from "react";
import Select from 'react-select';
import Highlighter from "react-highlight-words";
import "d3-transition";
import { select } from "d3-selection";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import ReactWordcloud from "react-wordcloud";
/* Chart code */
// Themes begin
// Themes end

import {
  Button,
  ModalHeader,
  Table,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
  Col
} from "reactstrap";

window.$value = ''
window.$year = ''
const options = {

  colors: ["#90EE90", "#0BDA51", "#17B169", "#03C03C", "#00693E"],
  enableTooltip: true,
  deterministic: true,
  fontFamily: "Arial",
  fontSizes: [15, 45],
  fontStyle: "oblique",
  fontWeight: "normal",
  padding: 3,
  rotations: 1,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};


class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectCountValue = this.selectCountValue.bind(this);
    this.getYearValue = this.getYearValue.bind(this);
    this.selectKeyword = this.selectKeyword.bind(this);
    this.displayAbstract = this.displayAbstract.bind(this);

    this.state = {

      isLoaded: true,
      modal: false,
      count: "",
      items: [],
      arr_keys: [],
      arr_vals: [],
      length: 0,
      year: "",
      body: "",
      url: "",
      highlightText: "",
      modalTitle: [],
      modalBody: [],
      selectValue: "",
      active1: true,
      active2: false,
      isActive: false,
      imageTooltipOpen: false,

    }
  }


  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen)
  };

  componentDidUpdate(prevProps) {
    if (this.props.confEvent !== prevProps.confEvent) {
      this.componentDidMount()
    }
  }

  componentDidMount() {
    fetch(`${BASE_URL_CONFERENCE}` + "wordcloud/topic/10/" + this.props.confEvent)
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json.words,
          length: json.words.length,
          active1: true,
          active2: false,
          selectValue: this.props.confEvent,
          count: "10"
        })
      });
  };

  selectCountValue(e) {
    this.setState({
      count: e.value
    })
  }

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  }

  getYearValue(e) {
    console.log(e.value)
    this.setState({
      selectValue: e.value
    })
    console.log(this.state.selectValue)
  }

  // BAB 08.06.2021 
  selectValue(e) {
    fetch(`${BASE_URL_CONFERENCE}` + "wordcloud/topic/" + this.state.count + "/" + this.state.selectValue)
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json.words,
          length: json.words.length,
          active1: true,
          active2: false
        })
      });
    console.log("BAB");
    console.log(this.props.conferenceName);
    console.log("BAB");
  }
  // BAB 08.06.2021 

  selectKeyword(e) {
    console.log("count", this.state.count)
    fetch(`${BASE_URL_CONFERENCE}` + "wordcloud/keyword/" + this.state.count + "/" + this.state.selectValue)
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json.words,
          length: json.words.length,
          active1: false,
          active2: true
        })
      });

  }
  // BAB 08.06.2021 

  displayAbstract(param) {
    fetch(`${BASE_URL_CONFERENCE}` + "getabstractdetails/" + this.props.conferenceName + "/" + param + "/" + this.state.selectValue)
      .then(response => response.json())
      .then(json => {
        this.setState({
          modal: true,
          scroll: true,
          highlightText: param,
          modalTitle: json,
          modalBody: json,
          url: 'https://www.semanticscholar.org/search?year%5B0%5D=' + json[0].year + '&year%5B1%5D=' + json[0].year + '&venue%5B0%5D=' + json[0].venue + '&q=' + param + '&sort=relevance'
          // modalHeader:json.abstractview[2],
        })
      })
  }


  render() {
    const displayAbstract = this.displayAbstract;

    function getCallback(callback) {
      return function (word, event) {
        const isActive = callback !== "onWordMouseOut";
        const element = event.target;
        const text = select(element);
        //console.log(word.text)
        text
          .on("click", () => {
            console.log(word.text)
            displayAbstract(word.text)
            //window.open(`https://www.semanticscholar.org/search?year%5B0%5D=${window.$value}&year%5B1%5D=${window.$value}&venue%5B0%5D=LAK&q=${word.text}&sort=relevance`, "_blank");
          })
      }
    }

    var { isLoaded, items, count, highlightText, modalTitle, selectValue, modalBody, active1, active2, url } = this.state;
    window.$value = selectValue

    console.log(window.$value)
    const callbacks = {
      getWordTooltip: (word) =>
        `click to view details`,
      onWordClick: getCallback("onWordClick"),
    };


    const data = this.props.confEvents; // BAB years/data can be passed in props with the conference name. 


    const numbers = [
      {
        value: "5",
        label: "5"
      },
      {
        value: "10",
        label: "10"
      }
    ];


    //var{items,arr_keys,arr_vals}=this.state;


    if (isLoaded) {
      return (
        <>
          <br />
          <div>
            <h2>Topic/Keyword cloud</h2>
            <br></br>
            <p>keywords for
              the selected Event
            </p>
            <Label>Select an Event</Label>
            <div style={{ width: '200px' }}>
              <Select
                placeholder="Select Option"
                options={data}
                value={data.find(obj => obj.value === selectValue)}
                onChange={this.getYearValue}

              />
            </div>
            <br />
            <Label>Select the number of topics/keywords</Label>
            <div style={{ width: '200px' }}>
              <Select
                placeholder="Select number"
                options={numbers} value={numbers.find(obj => obj.value === count)}
                onChange={this.selectCountValue}
              />
            </div>
            <br />
            <br />
            <Button color="primary" outline active={active1} onClick={this.selectValue}>Topic</Button>{' '}
            <Button color="primary" outline active={active2} onClick={this.selectKeyword}>Keyword</Button>
            <i className="fas fa-question-circle text-blue"
              onMouseOver={() => this.handleToogle(true)}
              onMouseOut={() => this.handleToogle(false)}
            />
            {
              this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    marginTop: "0px",
                    position: 'relative',
                    left: '205px',
                    width: '335px',
                    height: '40px',
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p> Click on topic/keyword to view more details</p>
                </div>
              )}
          </div>

          <div style={{ width: '800px' }}>
            <ReactWordcloud
              id="tpc_cloud"
              callbacks={callbacks}
              options={options}
              words={items}
            />
            <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" scrollable={false}>
              <ModalHeader toggle={this.toggle}><h2>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[highlightText]}
                  autoEscape={true}
                  textToHighlight={"List of Publications related to the topic/keyword '" + highlightText + "'"}
                /></h2></ModalHeader>
              <ModalBody>
                <br />
                <br />
                <Table hover size="20">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Abstract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("the title is:", modalTitle)}
                    {modalTitle.map((text, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td style={{ 'whiteSpace': 'unset' }}><p><Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[highlightText]}
                          autoEscape={true}
                          textToHighlight={text.title}
                        /></p></td>
                        <td style={{ 'whiteSpace': 'unset' }}><Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[highlightText]}
                          autoEscape={true}
                          textToHighlight={text.abstarct}
                        /></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </ModalBody>
              <ModalFooter>
                <Row>
                  <Col>
                    <Button color="info"> <a style={{ 'color': 'white' }} href={url} target="_blank">Search in Semantic
                      Scholar</a></Button>
                  </Col>
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col />
                  <Col>
                    <Button color="secondary" onClick={this.toggle}>Close</Button>
                  </Col>
                </Row>
              </ModalFooter>
            </Modal>
          </div>
          <React.Fragment>
          </React.Fragment>
        </>
      );
    } else {
      return (
        <>
        </>
      )
    }
  }
}

export default WordCloud;
