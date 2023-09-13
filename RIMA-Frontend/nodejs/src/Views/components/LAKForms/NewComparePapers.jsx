//Updated by Islam Abdelghaffar not used anymore needto be reviewed 
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid, Box, InputLabel, Typography } from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton.jsx";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";

import EnhancedTable from "../../Application/ReuseableComponents/EnhancedTable.jsx";
import TotalSharedTopicsKeywordsCloud from "../../Application/ReuseableComponents/TotalSharedTopicsKeywordsCloud.jsx";
class NewComparePapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopicsButton: false,
      activeKeywordsButton: false,
      compareBased: "keywords",
      firstPaperData: [
        { text: "understanding", value: 1 },
        { text: "powerful use-cases", value: 1 },
        { text: "performance", value: 1 },
        { text: "stakeholder", value: 2 },
        { text: "several examples", value: 1 },
        { text: "share lessons", value: 1 },
        { text: "analysis", value: 2 },
        { text: "relevant sub-populations", value: 1 },
        { text: "data", value: 3 },
        { text: "internal analytics system", value: 1 },
        { text: "learning", value: 3 },
        { text: "interesting questions", value: 2 },
        { text: "fine-grained educational data", value: 1 },
        { text: "data analysis task", value: 1 },
        { text: "analytics platform web-based learning systems", value: 0 },
      ],
      secondPaperData: [
        { text: "data", value: 1 },
        { text: "disciplinary contexts", value: 1 },
        { text: "new approaches", value: 1 },
        { text: "experience", value: 4 },
        { text: "learner", value: 1 },
        { text: "analytics", value: 4 },
        { text: "analytics government", value: 0 },
        { text: "educational experience", value: 1 },
        { text: "learning", value: 13 },
        { text: "quality teaching", value: 1 },
        { text: "university teachers design quality", value: 1 },
        { text: "learning designs", value: 3 },
        { text: "intended learning context", value: 1 },
        { text: "scalable teaching approaches", value: 1 },
        { text: "learning analytics", value: 4 },
      ],
      common_keywords_topics: [
        { text: "learning", value: 16 },
        { text: "data", value: 4 },
      ],
      common_keywords_topics_details: [
        { text: "learning", firstPapercount: 3, secondPaperCount: 13 },
        { text: "data", firstPapercount: 3, secondPaperCount: 1 },
      ],
      firstPaperTitle: "Evolving a learning analytics platform",
      secondPaperTitle: "Learning designs and learning analytics",
      loader: false,
      years: [],
      commontpcs: [],
      confevents: [],
      confeventsTwo: [],
      eventsPaper: [],
      eventsPaperTwo: [],
      active2: false,
    };
  }

  conferenceshandleChange = (e) => {
    this.setState(
      {
        selectedConferences: e.value,
        isLoading: true,
      },
      function () {
        this.selectConfEvent();
      }
    );
    console.log("here chooseeen");

    console.log("choosen conf ", this.state.selectedConferences);
  };

  selectConfEvent = () => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + this.state.selectedConferences)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confevents: json.events,
        });
      });
  };

  handlePapersOfEvent = (e) => {
    this.setState(
      {
        selectedEvent: e.value,
        isLoading: true,
      },
      function () {
        this.selectEventsPapers();
      }
    );
    console.log("here chooseeen 2");

    console.log("choosen event 2", this.state.selectedEvent);
    console.log("choosen conf of that 2", this.state.selectedConferences);
  };

  selectEventsPapers = () => {
    fetch(BASE_URL_CONFERENCE + "EventPapers/" + this.state.selectedEvent)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          eventsPaper: json.papers,
          eventsPaperAbstract: json.paperWithAbstract,
        });
      });
  };

  setPaperTitle = (e) => {
    this.setState({
      selectedEventpaper: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 3");
    console.log("choosen papaer 3", this.state.selectedEventpaper);
  };

  conferenceshandleChangeTwo = (e) => {
    this.setState(
      {
        selectedConferencesTwo: e.value,
        isLoading: true,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
    console.log("here chooseeen i");

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

  handlePapersOfEventTwo = (e) => {
    this.setState(
      {
        selectedEventTwo: e.value,
        isLoading: true,
      },
      function () {
        this.selectEventsPapersTwo(this.state.selectedEventTwo);
      }
    );
    console.log("here chooseeen 2i");

    console.log("choosen event 2i", this.state.selectedEventTwo);
  };

  selectEventsPapersTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "EventPapers/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          eventsPaperTwo: json.papers,
          eventsPaperAbstractTwo: json.paperWithAbstract,
        });
      });
  };

  setPaperTitleTwo = (e) => {
    this.setState({
      selectedEventpaperTwo: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 3i");
    console.log("choosen papaer 3i", this.state.selectedEventpaperTwo);
  };

  comparePapers = (val) => {
    const compareBased = val.split("/")[1];
    const toActiveTopicsButton = compareBased == "topics" ? true : false;

    this.setState({
      loader: true,
      activeTopicsButton: toActiveTopicsButton,
      activeKeywordsButton: !toActiveTopicsButton,
      firstPaperTitle: this.state.selectedEventpaper,
      secondPaperTitle: this.state.selectedEventpaperTwo,
      compareBased: val.split("/")[1],
      firstPaperData: [],
      secondPaperData: [],
      common_keywords_topics: [],
      common_keywords_topics_details: [],
    });
    fetch(
      BASE_URL_CONFERENCE +
        val +
        encodeURIComponent(this.state.selectedEventpaper) +
        "/" +
        this.state.selectedEvent +
        "/" +
        encodeURIComponent(this.state.selectedEventpaperTwo) +
        "/" +
        this.state.selectedEventTwo
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          firstPaperData: json.data[0]["firstPaper"],
          secondPaperData: json.data[0]["secondPaper"],
          common_keywords_topics: json.data[0]["common_keywords_topics"],
          common_keywords_topics_details: json.data[0]["intersectionDetails"],
        });
        console.log(
          "intersectionDetails ",
          json.data[0]["intersectionDetails"]
        );

        this.setState({
          active: false,
          loader: false,
        });
      });
  };

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
          Comparative Popularity of Topics/Keywords in publications
        </Typography>
        <p>Most popular, and shared topics/keywords between publications.</p>
        <InputLabel style={{ color: "black" }}>
          Select first event publications
        </InputLabel>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="First conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConference
              )}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="First conference event "
              options={this.state.confevents}
              value={this.state.confevents.find(
                (obj) => obj.value === this.state.selectedEvent
              )}
              onChange={this.handlePapersOfEvent}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="Select a paper"
              options={this.state.eventsPaperAbstract}
              value={this.state.eventsPaper.find(
                (obj) => obj.value === this.state.selectedEventpaper
              )}
              onChange={this.setPaperTitle}
            />
          </Grid>
        </Grid>
        <br />
        <InputLabel style={{ color: "black" }}>
          Select second event publications
        </InputLabel>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="Second conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="Second conference event"
              options={this.state.confeventsTwo}
              value={this.state.confeventsTwo.find(
                (obj) => obj.value === this.state.selectedEventTwo
              )}
              onChange={this.handlePapersOfEventTwo}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Select
              placeholder="Select a paper"
              options={this.state.eventsPaperAbstractTwo}
              value={this.state.eventsPaperTwo.find(
                (obj) => obj.value === this.state.selectedEventpaperTwo
              )}
              onChange={this.setPaperTitleTwo}
            />
          </Grid>
        </Grid>

        <br />
        <Grid container md={8} spacing={2}>
          <Grid item md="auto">
            <RIMAButton
              activeButton={this.state.activeTopicsButton}
              onClick={() => this.comparePapers("comparePapers/topics/")}
              name={"Compare topics"}
            />
          </Grid>
          <Grid item md="auto">
            <RIMAButton
              activeButton={this.state.activeKeywordsButton}
              onClick={() => this.comparePapers("comparePapers/keywords/")}
              name={"Compare keywords"}
            />
          </Grid>
        </Grid>

        {this.state.loader ? (
          <ActiveLoader
            marginLeft={"40%"}
            height={90}
            width={90}
            visible={this.state.loader}
          />
        ) : (
          <TotalSharedTopicsKeywordsCloud
            callbackCloud={"Occurrences in Title & Abstract"}
            callbackCommonCloud={"Occurrences in both papers"}
            firstCloudTitle={"First Paper title:" + this.state.firstPaperTitle}
            secondCloudTitle={
              "Second Paper title: " + this.state.secondPaperTitle
            }
            firstCloudData={this.state.firstPaperData}
            secondCloudData={this.state.secondPaperData}
            commonCloudData={this.state.common_keywords_topics}
            comparisonBased={this.state.compareBased}
            comparisonBetween={" papers"}
            common_keywords_topics_details={
              this.state.common_keywords_topics_details
            }
          />
        )}
      </Box>
    );
  }
}

export default NewComparePapers;
