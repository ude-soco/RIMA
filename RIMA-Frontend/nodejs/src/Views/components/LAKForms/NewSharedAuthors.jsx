// Implemented By Abdallah
import React, { Component } from "react";
import { Button, Label, FormGroup, Form, Row, Col } from "reactstrap";
import Select from "react-select";
import "d3-transition";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid, Box, InputLabel } from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import InfoBox from "Views/Application/ReuseableComponents/InfoBox";
window.$value = "";

class NewSharedAuthors extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectSahredAuthors = this.selectSahredAuthors.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      isLoaded: false,
      active1: false,
      confevents: [],
      confeventsTwo: [],
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
      conferences: [],
      items_confCompare: [],
    };
  }

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
  };

  componentDidMount() {
    //console.log("the json is ******************")
    this.setState({
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(BASE_URL_CONFERENCE + "commonAuthors/edm2009/aied2009")
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
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confEvents: json.years,
        });
      });
  }

  conferenceshandleChange = (e) => {
    console.log("here chooseeen 1");
    this.setState(
      {
        selectedConferences: e.value,
      },
      function () {
        this.selectConfEvent(this.state.selectedConferences);
      }
    );
    console.log("here chooseeen");

    console.log("choosen conf ", this.state.selectedConferences);
  };

  selectConfEvent = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confevents: json.events,
        });
      });
  };

  setSelectedEvent = (e) => {
    this.setState({
      selectedEvent: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 2");

    console.log("choosen event 2", this.state.selectedEvent);
    console.log("choosen conf of that 2", this.state.selectedConferences);
  };

  conferenceshandleChangeTwo = (e) => {
    console.log("second seleeeeect on change");
    this.setState(
      {
        selectedConferencesTwo: e.value,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
    console.log("here chooseeen i");
    console.log("here chooseeen i", e);

    console.log("choosen conf i ", this.state.selectedConferencesTwo);
  };

  selectConfEventTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confeventsTwo: json.events,
        });
      });
  };

  setSelectedEventTwo = (e) => {
    this.setState({
      selectedEventTwo: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 2i");

    console.log("choosen event 2i", this.state.selectedEventTwo);
  };

  selectKey(e) {
    this.setState({
      active1: false,
      active2: true,
      display1: "block",
      loader: true,
      display: "none",
      items_y1: "AAA",
    });
  }

  selectSahredAuthors(e) {
    this.setState({
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(
      BASE_URL_CONFERENCE +
        "commonAuthors/" +
        this.state.selectedEvent +
        "/" +
        this.state.selectedEventTwo
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          active1: true,
          selectValue: e,
          items_y1: json.commontopics,
          items_confCompare: json.commontopics,
          display: "block",
          isLoaded: true,
          display1: "none",
        });
      });
  }

  selectValue(e) {
    this.setState({
      selectValue2: e,
    });
  }

  render() {
    return (
      <Box component="form" role="form" method="form" style={{ width: "100%" }}>
        <br></br>
        <h2>Shared authors</h2>
        <p>Shared authors between two conference events</p>
        <Label>Select two conference events to compare</Label>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="First conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConference
              )}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="First conference event "
              options={this.state.confevents}
              value={this.state.confevents.find(
                (obj) => obj.value === this.state.selectedEvent
              )}
              onChange={this.setSelectedEvent}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="Second conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="Second conference event"
              options={this.state.confeventsTwo}
              value={this.state.confeventsTwo.find(
                (obj) => obj.value === this.state.selectedEventTwo
              )}
              onChange={this.setSelectedEventTwo}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item>
            <RIMAButton
              activeButton={this.state.active1}
              onClick={this.selectSahredAuthors}
              name={"Compare"}
            />
          </Grid>
          <Grid item>
            <i
              className="fas fa-question-circle text-blue"
              onMouseOver={() => this.handleToogle(true)}
              onMouseOut={() => this.handleToogle(false)}
            />
            {this.state.imageTooltipOpen && (
              <InfoBox
                Info={`
            Info about common authors between two events of conference
            `}
              />
            )}
          </Grid>
          <br />
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ height: "50vh" }}
          >
            <Grid
              item
              style={{
                display: this.state.display,
              }}
            >
              <img
                src={`data:image/png;base64,${this.state.items_y1}`}
                style={{
                  width: "80%",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default NewSharedAuthors;
