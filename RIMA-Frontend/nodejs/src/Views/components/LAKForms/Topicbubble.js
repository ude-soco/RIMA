//Done by Swarna
import React, {Component} from "react";
import {Graph} from "react-d3-graph";
import {
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from "reactstrap";
import Select from "react-select";
import "./styles.css";
import Highlighter from "react-highlight-words";

class Topicbubble extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.selectValue = this.selectValue.bind(this);
    this.selectyearValue = this.selectyearValue.bind(this);
    this.onClickNode = this.onClickNode.bind(this);

    this.state = {
      filterNeighbours: "",
      selectVal: "",
      selectYear: "",
      url: "",
      modalTitle: [],
      modalBody: [],
      modalHeader: [],
      isLoaded: false,
      graphData: [],
      isModalLoader: false,
      modal: false,
      popoverOpen: false,
      scroll: false,
      highlightText: "",
      myConfig: {
        nodeHighlightBehavior: true,
        linkHighlightBehavior: false,
        focusAnimationDuration: 0.1,
        highlightOpacity: 0.2,
        d3: {
          gravity: -650,
          linkLength: 150,
        },

        node: {
          color: "#000080",
          highlightStrokeColor: "yellow",
          highlightStrokeWidth: 3,
          symbolType: "circle",
          fontSize: 12,
          fontWeight: "bold",
          fontColor: "white",
          highlightFontSize: 20,
          highlightFontWeight: "bold",
          labelPosition: "center",
        },
        link: {
          color: "#F1F1F1",
        },

        height: 900,
        width: 700,
      },
    };
  }

  onClickNode(nodeId) {
    // window.alert(`Clicked node ${nodeId}`);

    fetch(
      "http://127.0.0.1:8000/api/conferences/getabstractdetails/" +
      nodeId +
      "/" +
      this.state.selectYear
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          modal: true,
          scroll: true,
          highlightText: nodeId,
          modalTitle: json.abstractview[0],
          modalBody: json.abstractview[1],
          // modalHeader:json.abstractview[2],
        });
      });

    //window.open( url)
  }

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  componentDidMount() {
  }

  selectyearValue(e) {
    this.setState({
      selectYear: e.value,
    });
  }

  selectValue(e) {
    if (e.value === "topic") {
      fetch(
        "http://127.0.0.1:8000/api/conferences/getoverviewtopicdetails/" +
        e.value +
        "/" +
        this.state.selectYear
      )
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            graphData: json.topicoverview,
            isLoaded: true,
          });
        });
    }
    if (e.value === "keyword") {
      fetch(
        "http://127.0.0.1:8000/api/conferences/getoverviewkeydetails/" +
        e.value +
        "/" +
        this.state.selectYear
      )
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            graphData: json.keyoverview,
            isLoaded: true,
          });
        });
    }
  }

  render() {
    var {
      graphData,
      selectVal,
      isLoaded,
      modalBody,
      modalTitle,
      myConfig,
      selectYear,
      highlightText,
    } = this.state;

    const yeardata = [
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
    const keywords = [
      {
        value: "keyword",
        label: "keyword",
      },
      {
        value: "topic",
        label: "topic",
      },
    ];

    console.log(keywords);
    if (isLoaded) {
      return (
        <div className="App" style={{height: "1000px", width: "700px"}}>
          <h2>Topic bubble</h2>
          <br/>
          <Label>Select a particular year of LAK Conference</Label>

          <Select
            placeholder="Select Option"
            options={yeardata}
            value={yeardata.find((obj) => obj.value === selectYear)}
            onChange={this.selectyearValue}
          />
          <br/>
          <Label>Select a Keyword</Label>
          <br/>
          <Select
            placeholder="Select Option"
            options={keywords}
            value={keywords.find((obj) => obj.value === selectVal)}
            onChange={this.selectValue}
          />
          <br/>
          <br/>

          <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={graphData}
            config={myConfig}
            onClickNode={this.onClickNode}
            onMouseOverNode={this.onMouseOverNode}
          />
          {console.log("title", modalBody)}
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            size="lg"
            scrollable={false}
          >
            <ModalHeader toggle={this.toggle}>
              <h2>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[highlightText]}
                  autoEscape={true}
                  textToHighlight={"List of Papers for " + highlightText}
                />
              </h2>
            </ModalHeader>
            <ModalBody>
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
                {modalTitle.map((text, index) => {
                  const image = modalBody[index];
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td style={{whiteSpace: "unset"}}>
                        <p>
                          <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[highlightText]}
                            autoEscape={true}
                            textToHighlight={text}
                          />
                        </p>
                      </td>
                      <td style={{whiteSpace: "unset"}}>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[highlightText]}
                          autoEscape={true}
                          textToHighlight={image}
                        />
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    } else {
      return (
        <>
          <div>
            <h2>Topic bubble</h2>

            <br/>
            <Label>Select a particular year of LAK Conference</Label>
            <br/>
            <Select
              placeholder="Select Option"
              options={yeardata}
              value={yeardata.find((obj) => obj.value === selectYear)}
              onChange={this.selectyearValue}
            />
            <br/>
            <Label>Select a Keyword</Label>
            <br/>
            <Select
              placeholder="Select Option"
              options={keywords}
              value={keywords.find((obj) => obj.value === selectVal)}
              onChange={this.selectValue}
            />
          </div>
        </>
      );
    }
  }
}

export default Topicbubble;
