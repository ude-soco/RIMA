//Updated by Islam Abdelghaffar
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  Grid,
  Box,
  InputLabel,
  Paper,
  Typography,
  CardContent,
} from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton.jsx";
import BarCharWithBadge from "Views/Application/ReuseableComponents/BarChartWithBadge";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";
import ReactWordcloud from "react-wordcloud";
import { CardHeader } from "reactstrap";
import EnhancedTable from "../../Application/ReuseableComponents/EnhancedTable.jsx";
class NewComparePapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopicsButton: false,
      activeKeywordsButton: false,
      compareBased: "",
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
      words: [
        { value: "data", label: "data" },
        { value: "system", label: "system" },
      ],
      years: [],
      commontpcs: [],
      confevents: [],
      confeventsTwo: [],
      eventsPaper: [],
      eventsPaperTwo: [],
      active2: false,
      // series: [
      //   {
      //     name: "Data",
      //     data: [44, 55],
      //   },
      //   {
      //     name: "Analysis",
      //     data: [53, 32],
      //   },
      //   {
      //     name: "Student",
      //     data: [33, 62],
      //   },
      // ],
      // options: {
      //   chart: {
      //     type: "bar",
      //     height: 350,
      //     stacked: true,
      //     stackType: "100%",
      //   },
      //   plotOptions: {
      //     bar: {
      //       horizontal: true,
      //     },
      //   },
      //   stroke: {
      //     width: 1,
      //     colors: ["#fff"],
      //   },
      //   xaxis: {
      //     categories: ["Paper 1", "Paper 2"],
      //   },
      //   tooltip: {
      //     y: {
      //       formatter: function (val) {
      //         return val;
      //       },
      //     },
      //   },
      //   fill: {
      //     opacity: 1,
      //   },
      //   legend: {
      //     position: "top",
      //     horizontalAlign: "left",
      //     offsetX: 40,
      //   },
      // },
      options: {
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
        transitionDuration: 1000,
      },
      style: {
        ContainerStyle: {
          borderRadius: "40px",
          padding: "1%",
          marginTop: "2%",
        },
        itemStyle: {
          width: "49%",
          borderRadius: "40px",
          backgroundColor: "#F0F8FF",
          border: "1px solid #000",
          padding: "1%",
        },
        CardHeaderStyle: {
          borderRadius: "40px",
          backgroundColor: "#F0F8FF",
          border: "1px solid #000",
        },
      },
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
    const callbacksParper = {
      getWordTooltip: (word) =>
        `Word: ${word.text} | Occurrences in this Paper's Title & Abstract: ${word.value}`,
    };
    const callbacksParpers = {
      getWordTooltip: (word) =>
        `Word: ${word.text} | Occurrences: ${word.value} in both papers`,
    };

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
        <ActiveLoader
          marginLeft={"40%"}
          height={90}
          width={90}
          visible={this.state.loader}
        />
        <Grid
          container
          component={Paper}
          md={12}
          style={{
            ...this.state.style.ContainerStyle,
          }}
        >
          <Grid
            item
            xs={12}
            component={Paper}
            md="auto"
            style={{
              ...this.state.style.itemStyle,
            }}
          >
            <CardHeader
              style={{
                ...this.state.style.CardHeaderStyle,
              }}
            >
              <Typography variant="h6" style={{ fontSize: "1rem" }}>
                First Paper title:
                {this.state.firstPaperTitle}
              </Typography>
            </CardHeader>
            <CardContent>
              <ReactWordcloud
                words={this.state.firstPaperData}
                options={this.state.options}
                callbacks={callbacksParper}
              />
            </CardContent>
          </Grid>
          <Grid
            item
            md="auto"
            xs={12}
            component={Paper}
            style={{
              ...this.state.style.itemStyle,
              marginLeft: "auto",
            }}
          >
            <CardHeader
              style={{
                ...this.state.style.CardHeaderStyle,
              }}
            >
              <Typography variant="h6" style={{ fontSize: "1rem" }}>
                Second Paper title:
                {this.state.secondPaperTitle}
              </Typography>
            </CardHeader>
            <CardContent>
              <ReactWordcloud
                words={this.state.secondPaperData}
                options={this.state.options}
                callbacks={callbacksParper}
              />
            </CardContent>
          </Grid>
          <Grid
            item
            component={Paper}
            xs={12}
            style={{
              ...this.state.style.itemStyle,
              marginTop: "1%",
            }}
          >
            <CardHeader
              style={{
                ...this.state.style.CardHeaderStyle,
              }}
            >
              <Typography variant="h5" align="center">
                Common {this.state.compareBased} between two selected papers
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container xs={12}>
                <Grid item md={6} xs={12}>
                  {this.state.common_keywords_topics ? (
                    <ReactWordcloud
                      words={this.state.common_keywords_topics}
                      options={this.state.options}
                      callbacks={callbacksParpers}
                    />
                  ) : (
                    <Typography align="center">
                      No common {this.state.compareBased} between two selected
                      papers
                    </Typography>
                  )}
                </Grid>
                <Grid item md={6}>
                  {this.state.common_keywords_topics_details &&
                    this.state.common_keywords_topics_details.length >= 1 && (
                      <EnhancedTable
                        rows={this.state.common_keywords_topics_details}
                      />
                    )}
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default NewComparePapers;
