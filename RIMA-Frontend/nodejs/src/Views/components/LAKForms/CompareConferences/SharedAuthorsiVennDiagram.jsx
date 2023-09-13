// Implemented By Abdallah
import React, { Component } from "react";
import { Button, Label, FormGroup, Form, Row, Col } from "reactstrap";
import Select from "react-select";
import "d3-transition";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  Grid,
  Box,
  InputLabel,
  Fade,
  Typography,
  CardContent,
  Card,
} from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import InfoBox from "Views/Application/ReuseableComponents/InfoBox";
import InteractiveVennDiagram from "../../../Application/ReuseableComponents/InteractiveVennDiagram.jsx";
window.$value = "";

class SharedAuthorsiVennDiagram extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectSahredAuthors = this.selectSahredAuthors.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      selectedEvent: "",
      selectedEventTwo: "",
      selectedEventThird: "",
      confeventsThird: [],
      openThirdEvent: false,
      closeThirdEvent: true,
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
      Style: {
        itemStyle: {
          backgroundColor: "#F0F8FF",
          borderRadius: "40px",
          padding: "1%",
        },
        cardStyle: {
          width: "100%",
          borderRadius: "40px",
        },
        h1Style: {
          padding: "1rem,0,0,0",
          width: "100%",
          borderRadius: "40px",
        },
      },
      sets: [
        { sets: ["lak2011"], value: 10, name: "lak2011" },
        { sets: ["lak2015"], value: 20, name: "lak2015" },
        { sets: ["lak2021"], value: 20, name: "lak2021" },
        { sets: ["lak2011", "lak2015"], value: 5, name: "lak2011_lak2015" },
        { sets: ["lak2011", "lak2021"], value: 5, name: "lak2011_lak2021" },
        { sets: ["lak2015", "lak2021"], value: 10, name: "lak2015_lak2021" },
        {
          sets: ["lak2011", "lak2015", "lak2021"],
          value: 5,
          name: "lak2011_lak2015_lak2021",
        },
      ],
      authorsNames: [],
      showWarningEmptyEvents: false,
      showWarningSameEvents: false,
    };
  }

  changeBackgroundPaper(e) {
    e.target.style.background = "#B0D4FF";
  }
  changeBackgroundPaper2(e) {
    e.target.style.background = "#F5F5F2";
  }
  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
  };

  componentDidMount() {
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
    this.setState(
      {
        selectedConferences: e.value,
      },
      function () {
        this.selectConfEvent(this.state.selectedConferences);
      }
    );
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
  };

  conferenceshandleChangeTwo = (e) => {
    this.setState(
      {
        selectedConferencesTwo: e.value,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
  };

  conferenceshandleChangeThird = (e) => {
    this.setState(
      {
        thirdSelectedConf: e.value,
      },
      function () {
        this.selectConfEventThird(this.state.thirdSelectedConf);
      }
    );
  };
  selectConfEventThird = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confeventsThird: json.events,
        });
      });
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
  };
  setSelectedEventThird = (e) => {
    this.setState({
      selectedEventThird: e.value,
      isLoading: true,
    });
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
      authorsNames: [],
    });
    let firstEvent = this.state.selectedEvent;
    let secondEvent = this.state.selectedEventTwo;
    let thirdEvent = this.state.selectedEventThird;

    if (
      (firstEvent === "" && secondEvent == "") ||
      (firstEvent == "" && thirdEvent == "") ||
      (secondEvent == "" && thirdEvent == "")
    ) {
      this.setState({
        showWarningEmptyEvents: true,
        showWarningSameEvents: false,
      });
      return;
    }
    if (
      firstEvent === secondEvent ||
      firstEvent === thirdEvent ||
      secondEvent == thirdEvent
    ) {
      this.setState({
        showWarningEmptyEvents: false,
        showWarningSameEvents: true,
      });
      return;
    } else {
      this.setState({
        showWarningEmptyEvents: false,
        showWarningSameEvents: false,
      });
    }
    fetch(
      BASE_URL_CONFERENCE +
        "conferences/events/" +
        this.state.selectedEvent +
        "&" +
        this.state.selectedEventTwo +
        "&" +
        this.state.selectedEventThird +
        "/sharedAuthors/"
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
          sets: json.sets,
          authorsNames: json.names,
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
        <Typography
          style={{ fontWeight: "bold" }}
          variant="h5"
          component="h1"
          gutterBottom
        >
          Shared Authors between Conference Events
        </Typography>
        <p>Shared authors between two or three conference events</p>
        <Label>Select two conference events to compare</Label>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="First conference *"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConference
              )}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="First conference event *"
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
              placeholder="Second conference *"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item md={5} xs={12}>
            <Select
              placeholder="Second conference event *"
              options={this.state.confeventsTwo}
              value={this.state.confeventsTwo.find(
                (obj) => obj.value === this.state.selectedEventTwo
              )}
              onChange={this.setSelectedEventTwo}
            />
          </Grid>
        </Grid>
        <br />
        <Grid item xs={12}>
          {this.state.closeThirdEvent && (
            <Typography
              style={{ ...this.state.Style.h1Style }}
              checked={this.state.openThirdEvent}
              onMouseEnter={this.changeBackgroundPaper}
              onMouseLeave={this.changeBackgroundPaper2}
              onClick={() =>
                this.setState({
                  openThirdEvent: true,
                  closeThirdEvent: false,
                })
              }
            >
              {" "}
              + Add third event
            </Typography>
          )}
          {this.state.openThirdEvent && (
            <Fade
              unmountOnExist
              in={this.state.openThirdEvent}
              style={{ position: "relative" }}
            >
              <Grid container spacing={3}>
                <Grid item md={5} xs={12}>
                  <Select
                    placeholder="Third conference (optional)"
                    options={this.props.conferencesNames}
                    value={this.props.conferencesNames.find(
                      (obj) => obj.value === this.state.thirdSelectedConf
                    )}
                    onChange={this.conferenceshandleChangeThird}
                  />
                </Grid>
                <Grid item md={5} xs={12}>
                  <Select
                    placeholder="Third conference event  (optional)"
                    options={this.state.confeventsThird}
                    value={this.state.confeventsTwo.find(
                      (obj) => obj.value === this.state.selectedEventThird
                    )}
                    onChange={this.setSelectedEventThird}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    style={{ ...this.state.Style.h1Style }}
                    checked={this.state.closeThirdEvent}
                    onMouseEnter={this.changeBackgroundPaper}
                    onMouseLeave={this.changeBackgroundPaper2}
                    onClick={() =>
                      this.setState({
                        closeThirdEvent: true,
                        openThirdEvent: false,
                        selectedEventThird: "",
                      })
                    }
                  >
                    {" "}
                    - Shrink third event{" "}
                  </Typography>
                </Grid>
              </Grid>
            </Fade>
          )}
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
            style={{ height: "50%", padding: "1%" }}
          >
            <Grid item xs={12}>
              {/* <img
                src={`data:image/png;base64,${this.state.items_y1}`}
                style={{
                  width: "80%",
                }}
              /> */}
              {this.state.showWarningEmptyEvents && (
                <Typography color="error">
                  Please select at least two events.
                </Typography>
              )}
              {this.state.showWarningSameEvents && (
                <Typography color="error">
                  An events can't be selected twice.
                </Typography>
              )}
              <InteractiveVennDiagram
                sets={this.state.sets}
                listContent={this.state.authorsNames}
                label={"author"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default SharedAuthorsiVennDiagram;
