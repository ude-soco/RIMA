// Updated By Islam Abdelghaffar
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid, Box, InputLabel, Badge } from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import BarCharWithBadge from "Views/Application/ReuseableComponents/BarChartWithBadge";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";
import TotalSharedTopicsKeywordsCloud from "../../Application/ReuseableComponents/TotalSharedTopicsKeywordsCloud";
class NewAuthorBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: "lak2011",
      selectedEventTwo: "lak2012",
      firstCloudTitle: "A. Pardo",
      secondCloudTitle: "Ari Bader-Natal",
      firstCloudData: [
        { text: "Learning management system", value: 0.9159303695384065 },
        { text: "Web server", value: 0.8060038661449498 },
        { text: "Data analysis", value: 0.8678094266345387 },
      ],
      secondCloudData: [
        { text: "Learning analytics", value: 0.9080793903206803 },
        { text: "Data analysis", value: 0.9678094266345387 },
      ],
      commonCloudData: [{ text: "Data analysis", value: 1.835618853 }],
      common_keywords_topics_details: [
        {
          text: "Data analysis",
          firstPapercount: 0.8678094266345387,
          secondPaperCount: 0.9678094266345387,
        },
      ],
      comparisonBased: "Keywords",
      comparisonBetween: " Authors",
      loader: false,
      words: [
        { value: "data", label: "data" },
        { value: "system", label: "system" },
      ],
      years: [],
      commontpcs: [],
      display: "block",
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          stackType: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        xaxis: {
          categories: ["First Author", "Second Author"],
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "K";
            },
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
    };
  }

  conferenceshandleChange = (e) => {
    this.setState(
      {
        selectedConferences: e,
        isLoading: true,
      },
      function () {
        this.selectConfEvent();
      }
    );
  };

  selectConfEvent = () => {
    fetch(
      BASE_URL_CONFERENCE + "confEvents/" + this.state.selectedConferences.value
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confevents: json.events,
        });
      });
  };

  handleAuthorsOfEvent = (e) => {
    this.setState(
      {
        selectedEvent: e,
        isLoading: true,
      },
      function () {
        this.selectEventsAuthors();
      }
    );
  };

  selectEventsAuthors = () => {
    fetch(
      BASE_URL_CONFERENCE + "eventAuthors/" + this.state.selectedEvent.value
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          eventAuthors: json.EventAuthors.sort((a, b) =>
            a.label > b.label ? 1 : -1
          ),
        });
      });
  };

  setAuthorName = (e) => {
    this.setState({
      selectedEventAuthor: e,
      isLoading: true,
    });
  };

  conferenceshandleChangeTwo = (e) => {
    this.setState(
      {
        selectedConferencesTwo: e,
        isLoading: true,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
  };

  selectConfEventTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val.value)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confeventsTwo: json.events,
        });
      });
  };

  handleAuthorsOfEventTwo = (e) => {
    this.setState(
      {
        selectedEventTwo: e,
        isLoading: true,
      },
      function () {
        this.selectEventsAuthorsTwo(this.state.selectedEventTwo);
      }
    );
  };

  selectEventsAuthorsTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "eventAuthors/" + val.value)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          eventAuthorsTwo: json.EventAuthors.sort((a, b) =>
            a.label > b.label ? 1 : -1
          ),
        });
      });
  };

  setAuthorNameTwo = (e) => {
    this.setState({
      selectedEventAuthorTwo: e,
      isLoading: true,
    });
  };

  AuthorKeywordInterests = (val) => {
    this.setState({
      loader: true,
      firstCloudTitle: this.state.selectedEventAuthor.value,
      secondCloudTitle: this.state.selectedEventAuthorTwo.value,
      comparisonBased: "keywords",
    });
    fetch(
      BASE_URL_CONFERENCE +
        val +
        this.state.selectedEvent.value +
        "/" +
        this.state.selectedEventTwo.value +
        "/" +
        "keyword" +
        "/" +
        this.state.selectedEventAuthor.value +
        "/" +
        this.state.selectedEventAuthorTwo.value
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json: ", json);
        this.setState({
          firstCloudData: json.first_author_data,
          secondCloudData: json.second_author_data,
          commonCloudData: json.common_data[0].intersection,
          common_keywords_topics_details:
            json.common_data[0].intersectionDetails,
          active3: false,
          active4: true,
          options: {
            ...this.state.colors,
            colors: [
              "#FF6B6B",
              "#FFD93D",
              "#6BCB77",
              "#4D96FF",
              "#733C3C",
              "#8479E1",
              "#B4ECE3",
              "#FFF8D5",
              "#151D3B",
              "#D82148",
              "#6EBF8B",
              "#FFD700",
              "#DADBBD",
              "#064635",
              "#D2B48C",
              "#FF87CA",
              "#FC997C",
              "#DADDFC",
              "#396EB0",
              "#2E4C6D",
            ],
          },
          display: "block",
          loader: false,
        });
      });
  };
  AuthorTopicInterests = (val) => {
    this.setState({
      loader: true,
      firstCloudTitle: this.state.selectedEventAuthor.value,
      secondCloudTitle: this.state.selectedEventAuthorTwo.value,
      comparisonBased: "topics",
    });
    fetch(
      BASE_URL_CONFERENCE +
        val +
        this.state.selectedEvent.value +
        "/" +
        this.state.selectedEventTwo.value +
        "/" +
        "topic" +
        "/" +
        this.state.selectedEventAuthor.value +
        "/" +
        this.state.selectedEventAuthorTwo.value
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json: ", json);

        this.setState({
          firstCloudData: json.first_author_data,
          secondCloudData: json.second_author_data,
          commonCloudData: json.common_data[0].intersection,
          common_keywords_topics_details:
            json.common_data[0].intersectionDetails,
          active3: true,
          active4: false,
          options: {
            ...this.state.colors,
            colors: [
              "#FF6B6B",
              "#FFD93D",
              "#6BCB77",
              "#4D96FF",
              "#733C3C",
              "#8479E1",
              "#B4ECE3",
              "#FFF8D5",
              "#151D3B",
              "#D82148",
              "#6EBF8B",
              "#FFD700",
              "#DADBBD",
              "#064635",
              "#D2B48C",
              "#FF87CA",
              "#FC997C",
              "#DADDFC",
              "#396EB0",
              "#2E4C6D",
            ],
          },
          display: "block",
          loader: false,
        });
      });
  };

  render() {
    return (
      <Box component="form" role="form" method="form" style={{ width: "100%" }}>
        <br></br>
        <h2>Most popular topics and keywords between authors</h2>
        <p>
          Most popular topics and keywords, and shared topics and keywords
          between authors.
        </p>
        <InputLabel>Select first event author</InputLabel>
        <Grid container spacing={2}>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select a conference"
              options={this.props.conferencesNames}
              value={this.state.selectedConferences}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select an Event"
              options={this.state.confevents}
              value={this.state.selectedEvent}
              onChange={this.handleAuthorsOfEvent}
            />
          </Grid>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select an Author"
              options={this.state.eventAuthors}
              value={this.state.SelectedAuthor}
              onChange={this.setAuthorName}
            />
          </Grid>
        </Grid>
        <br />
        <InputLabel>Select second event author</InputLabel>
        <Grid container spacing={2}>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select a conference"
              options={this.props.conferencesNames}
              value={this.state.selectedConferencesTwo}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select an Event"
              options={this.state.confeventsTwo}
              value={this.state.selectedEventTwo}
              onChange={this.handleAuthorsOfEventTwo}
            />
          </Grid>
          <Grid item md={4} xs={4}>
            <Select
              placeholder="Select an Author"
              options={this.state.eventAuthorsTwo}
              value={this.state.SelectedAuthorTwo}
              onChange={this.setAuthorNameTwo}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item>
            <RIMAButton
              activeButton={this.state.active3}
              onClick={() => this.AuthorTopicInterests("AuthorInterestsNew/")}
              name={"Topics"}
            />
          </Grid>
          <Grid item>
            <RIMAButton
              activeButton={this.state.active4}
              onClick={() => this.AuthorKeywordInterests("AuthorInterestsNew/")}
              name={"Keywords"}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container style={{ opacity: this.state.opacity }} md={12}>
          {this.state.loader ? (
            <ActiveLoader
              marginLeft={"40%"}
              height={90}
              width={90}
              visible={true}
            />
          ) : (
            <TotalSharedTopicsKeywordsCloud
              callbackCloud={"Weight"}
              callbackCommonCloud={"Aggregate weight"}
              firstCloudTitle={"First Author:   " + this.state.firstCloudTitle}
              secondCloudTitle={"Second Author: " + this.state.secondCloudTitle}
              firstCloudData={this.state.firstCloudData}
              secondCloudData={this.state.secondCloudData}
              commonCloudData={this.state.commonCloudData}
              comparisonBased={this.state.comparisonBased}
              comparisonBetween={this.state.comparisonBetween}
              common_keywords_topics_details={
                this.state.common_keywords_topics_details
              }
              firstEvent={this.state.selectedEvent}
              secondEvent={this.state.selectedEventTwo}
            />
          )}
        </Grid>
      </Box>
    );
  }
}

export default NewAuthorBar;
