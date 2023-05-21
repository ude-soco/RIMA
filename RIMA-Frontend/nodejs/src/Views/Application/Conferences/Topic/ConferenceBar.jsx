//Done by Swarna
// Updated by Basem Abughallya 
import React, { useState, useEffect } from "react";
import { CircularProgress, Grid, makeStyles, Paper, Tab, Tabs, TextField,Fade, Typography } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';

import Chart from "chart.js";
import Select from "react-select";
import WordCloud from "../../../components/LAKForms/WordCloud";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  Button
} from "reactstrap";
import { chartOptions, parseOptions } from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import TopicBar from "../../../components/LAKForms/TopicBar";
import LAKPie from "../../../components/LAKForms/LAKPie";
import LAKStackedAreaChart from "../../../components/LAKForms/LAKStackedAreaChart";
import VennChart from "../../../components/LAKForms/VennChart";
import LAKStackedBarChart from "../../../components/LAKForms/LAKStackedBarChart";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

import RestAPI from "../../../../Services/api";
import NewTopWordsInYears from "../../../components/LAKForms/NewTopWordsInYears";
import NewEvolutionTopTopics from "../../../components/LAKForms/NewEvolutionTopTopics";


// BAB:END 08/06/2021 :: cover other conferences.

const useStyles = makeStyles(theme => ({
  padding: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
  gutterLarge: {
    marginBottom: theme.spacing(11)
  },
  tabPanel: {
    marginBottom: theme.spacing(7),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  header: {
    marginBottom: theme.spacing(8)
  },
  headerAlt: {
    margin: theme.spacing(3, 0, 4, 0)
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    marginBottom: 24
  },
  cardHeightAlt: {
    height: "100%",
    padding: theme.spacing(4, 4, 0, 4),
    // borderRadius: theme.spacing(4, 4, 0, 0),
    borderRadius: theme.spacing(2),
    marginBottom: 24
  },
}));

export default function ConferenceBar(props) {
  const [activeNav, setactiveNav] = useState(4);
  const [chartExample1Data, setchartExample1Data] = useState("data1");
  const [tooltipOpen, settooltipOpen] = useState(false);
  const [imageTooltipOpen, setimageTooltipOpen] = useState(false);
  const classes = useStyles();
  const [selectedOption, setselectedOption] = useState({ label: 'lak', value: 'lak' });
  const [available, setavailable] = useState([{ label: 'ecctd', value: 'ecctd' }, { label: 'acisp', value: 'acisp' }, { label: 'aaecc', value: 'aaecc' }, { label: 'eann', value: 'eann' }, { label: 'lak', value: 'lak' }, { label: 'edm', value: 'edm' }, { label: 'aied', value: 'aied' }, { label: 'camsap', value: 'camsap' }]);

  const [conference, setconference] = useState([]);
  const [confEvents, setconfEvents] = useState([
    {
      value: "lak2011",
      label: "lak2011"
    },
    {
      value: "lak2012",
      label: "lak2012"
    },
    {
      value: "lak2013",
      label: "lak2013"
    },
    {
      value: "lak2014",
      label: "lak2014"
    },
    {
      value: "lak2015",
      label: "lak2015"
    },
    {
      value: "lak2016",
      label: "lak2016"
    },
    {
      value: "lak2017",
      label: "lak2017"
    },
    {
      value: "lak2018",
      label: "lak2018"
    },
    {
      value: "lak2019",
      label: "lak2019"
    },
    {
      value: "lak2020",
      label: "lak2020"
    },
    {
      value: "lak2021",
      label: "lak2021"
    }
  ],);

  const [conferenceOtherData, setConferenceOtherData] = useState({});
  const [BarChartseries, setBarChartseries] = useState([]);
  const [BarConfEventsList, setBarConfEventsList] = useState([]);

  const [BarOptions, setBarOptions] = useState({
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ["lak2011", "lak2012", "lak2013", "lak2014", "lak2015", "lak2016", "lak2017", "lak2018", "lak2019", "lak2020", "lak2021"],
    },
    yaxis: {
      min: 10,
      max: 600,
    },
    fill: {
      opacity: 1
    },

  },
  );
  const [openDrawerYears, setOpenDrawerYears] = useState(true);
  const [availableConferences, setavailableConferences] = useState([]);
  const [openDrawerh2, setOpenDrawerh2] = useState(true);
  const [openDrawerh, setOpenDrawerh] = useState(false);
    //** GET ALL CONFERENCES **//
    const getConferencesName = () => {
      RestAPI.getConferencesNames()
        .then((response) => {
          setavailableConferences(response.data);
        })
  };
  function handleClickh(e) {
    setOpenDrawerh(!openDrawerh);
    setOpenDrawerh2(!openDrawerh2);

  }
  function handleClickh2(e) {
    setOpenDrawerh2(!openDrawerh2);

  }
  const loading =
    <Grid container direction="column" justify="center" alignItems="center" className={classes.padding}>
      <Grid item>
        <CircularProgress />
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>

  useEffect(() => {
    handleChange(selectedOption);
    getConferencesNames();
    getConferencesName();
  }, [])

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }


  const navigateTop = () => {
    window.scrollTo(0, 0)
  }



  //** GET ALL CONFERENCES **//
  const getConferencesNames = () => {
    RestAPI.getConferencesNames()
      .then((response) => {
        setavailable(response.data);
      })
  };


  // BAB:BEGIN 08/06/2021 :: cover other conferences.
  const handleChange = (selectedOption) => {
    //this.forceUpdate();
    setselectedOption(selectedOption);
    console.log("updated");
    console.log(`Option selected:`, selectedOption);
    fetch(`${BASE_URL_CONFERENCE}confEvents/${selectedOption.value}`)
      .then(response => response.json())
      .then(json => {
        setconfEvents(json.events)
      });


    fetch(`${BASE_URL_CONFERENCE}conferenceData/${selectedOption.value}`)
      .then(response => response.json())
      .then(json => {
        setConferenceOtherData(json.other_data)
        setBarChartseries(json.series)
        setBarConfEventsList(json.conference_events)
        setBarOptions({
          ...BarOptions,
          xaxis: {
            ...BarOptions.xaxis,
            categories: json.conference_events
          }
        })
      });
  };


  const handleSearchConferences = () => {
    fetch(`${BASE_URL_CONFERENCE}` + "searchConf/")
      .then(response => response.json())
      .then(json => {
        setconference(json)
      });
  };
  function changeBackgroundYears(e) {
    e.target.style.background = '#B0D4FF';
  }
    function changeBackgroundYears2(e) {
      e.target.style.background = "#F5F5F2";
      // if(openDrawerYears === false){
      //   e.target.style.background = '#B0D4FF';
      // }
      // else {
      //   e.target.style.background = '#F5F5F2';
      // }
    }
    function handleClickYears(e) {
      setOpenDrawerYears(!openDrawerYears);
    }
    function changeBackgroundh(e) {
      e.target.style.background = '#B0D4FF';
    }
    function changeBackgroundh2(e) {
      e.target.style.background = "white";
      // if(openDrawerh === true){
      //   e.target.style.background = '#B0D4FF';
      // }
      // else {
      //   e.target.style.background = 'white';
      // }
  }
    function changeBackgroundhh2(e) {
      e.target.style.background = "white";
      // if(openDrawerh2 === true){
      //   e.target.style.background = '#B0D4FF';
      // }
      // else {
      //   e.target.style.background = 'white';
      // }
  }
  return (
    <>

      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs>
          <Typography variant="h5" gutterBottom>
            Topic Trends
          </Typography>
          <Typography className={classes.gutter}>
            Select a conference and let the following visualizations provide insights into
            trends of conference data
          </Typography>

          <Select
            placeholder="Select conference"
            options={available}
            value={selectedOption}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

 
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs>
          <Typography variant="body2" gutterBottom>
            Conference Complete Name
          </Typography>
          <Typography variant="h5" className={classes.gutter}>
            {conferenceOtherData.conference_full_name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            dblp Conference Url
          </Typography>
          <Typography variant="h5" className={classes.gutter}>
            {conferenceOtherData.conference_url}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Number of Events
          </Typography>
          <Typography variant="h5" className={classes.gutter}>
            {conferenceOtherData.no_of_events}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Number of all Papers
          </Typography>
          <Typography variant="h5" className={classes.gutter}>
            {conferenceOtherData.no_of_all_papers}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Number of all Authors
          </Typography>
          <Typography variant="h5" className={classes.gutter}>
            {conferenceOtherData.no_of_all_authors}
          </Typography>

          <Link to={{
            pathname: "/app/view-author",
            state: {
              current_conference: selectedOption.value
            }
          }}>
            <Button color="primary" width="50px">
              {selectedOption.value}'s Authors Dashboard
            </Button>
          </Link>
        </Grid>

        <Grid item xs>
          <Typography variant="h5" gutterBottom>
            General Overview
          </Typography>
          <Typography className={classes.gutter}>
            Events General Overview of the {selectedOption.value} Conference
          </Typography>
          <div id="chart">
            <ReactApexChart
              options={BarOptions}
              series={BarChartseries} type="bar" height={350}
            />
          </div>

        </Grid>
      </Grid>

      {/* Page content */}
      <Grid container component={Paper} className={classes.cardHeight}>
        <Card className="bg-gradient-default1 shadow">
          <CardHeader className="bg-transparent">
            <Row >
              <div className="main" style={{ width: '95%' }} >
                <div
                  className="row mt-4"
                  style={{
                    height: "800px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <WordCloud conferenceName={selectedOption.value} confEvents={confEvents} confEvent={confEvents[0].value} />        {/*  BAB 08.06.2021 */}
                  </Col>

                </div>
              </div>
              <div className="main" style={{ width: '95%' }}>
                <div
                  className="row mt-4"
                  style={{
                    height: "800px",
                    // width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <TopicBar conferenceName={selectedOption.value} confEvents={confEvents} confEvent={confEvents[0].value} />          {/*  BAB 08.06.2021 */}
                  </Col>
                </div>
              </div>
              <br></br>
              <div className="main" style={{ width: '95%' }}>
                <div
                  className="row mt-4"
                  style={{
                    height: "800px",
                    // width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <LAKPie conferenceName={selectedOption.value} confEvents={confEvents} />       {/*  BAB 08.06.2021 */}
                  </Col>
                </div>
              </div>
              <br></br>
              <div className="main" style={{ width: '95%' }}>
                <div
                  className="row mt-4"
                  style={{
                    height: "800px",
                    // width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <LAKStackedBarChart conferenceName={selectedOption.value} confEvents={confEvents} />    {/*  BAB 08.06.2021 */}
                  </Col>
                </div>
              </div>
              <br></br>
              <div
                className="row mt-4"
                style={{
                  height: "800px",
                  width: "92%",
                  backgroundColor: "#F0F8FF",
                  marginLeft: "50px",
                  borderRadius: "2px",
                }}
              >
                <Col>
                  <LAKStackedAreaChart conferenceName={selectedOption.value} />   {/*  BAB 08.06.2021 */}
                </Col>
              </div>

              <div
                className="row mt-4"
                style={{
                  height: "800px",
                  width: "92%",
                  backgroundColor: "#F0F8FF",
                  marginLeft: "50px",
                  borderRadius: "2px",
                }}
              >
                <Col>
                  <VennChart conferenceName={selectedOption.value} confEvents={confEvents} page='topicbar' conferences={conference} />      {/* BAB 08.06.2021 */}
                </Col>
              </div>

            </Row>
          </CardHeader>

        </Card>
      </Grid>        
        <Grid className="bg-gradient-default1 shadow" >        
            <Card className="bg-gradient-default1 shadow" lg={openDrawerYears ? 4 : ""} style={{display: openDrawerYears ? "block" : "none", hight: "20%", width: "100%"}} >
            <Fade unmountOnExit in={openDrawerYears}> 
                <CardHeader className="bg-transparent">
                <Row>
                <div
                  className="row mt-4"
                  style={{
                    display: "flex",
                    height: "55%",
                    width: "48%",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "1%",
                    marginRight: "1%",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <NewTopWordsInYears conferencesNames = {availableConferences}/>    
                  </Col>
                </div>
                <div
                  className="row mt-4"
                  style={{
                    display: "flex",
                    height: "55%",
                    width: "48%",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "1%",
                    marginRight: "1%",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <NewEvolutionTopTopics conferencesNames = {availableConferences}/>    
                  </Col>
                </div>
                </Row>
              </CardHeader>
              </Fade>
             </Card>
      </Grid>
      <ScrollTopWrapper />
    </>
  );
}


