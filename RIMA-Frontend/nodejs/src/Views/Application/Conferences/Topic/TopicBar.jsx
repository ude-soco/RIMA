//Done by Swarna
// Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 
import React, {useState,useEffect } from "react";
import {CircularProgress, Grid, makeStyles, Paper, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';

import Chart from "chart.js";
import Select from "react-select";
import LAKForm from "../../../components/LAKForms/LAKForm";
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
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import LAKBar from "../../../components/LAKForms/LAKBar";
import LAKPie from "../../../components/LAKForms/LAKPie";
import LAKStackedAreaChart from "../../../components/LAKForms/LAKStackedAreaChart";
import VennChart from "../../../components/LAKForms/VennChart";
import LAKStackedBarChart from "../../../components/LAKForms/LAKStackedBarChart";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";

// BAB:BEGIN 08/06/2021 :: cover other conferences.
import {BASE_URL_CONFERENCE} from "../../../../Services/constants";

// years and conferences' names should be fetched later from a customed endpoint

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

export default function TopicBar (props) {
  const [activeNav, setactiveNav] = useState(4);
  const [chartExample1Data, setchartExample1Data] = useState("data1");
  const [tooltipOpen, settooltipOpen] = useState(false);
  const [imageTooltipOpen, setimageTooltipOpen] = useState(false);
  const classes = useStyles();
  const [selectedOption, setselectedOption] = useState({ label: 'lak', value: 'lak' });
  const [available, setavailable] = useState([{ label: 'lak', value: 'lak' },{ label: 'edm', value: 'edm' },{ label: 'aied', value: 'aied' }]);

  const [conference, setconference] = useState([]);
  const [confEvents, setconfEvents] = useState([
    {
      value: "2011",
      label: "2011"
    },
    {
      value: "2012",
      label: "2012"
    },
    {
      value: "2013",
      label: "2013"
    },
    {
      value: "2014",
      label: "2014"
    },
    {
      value: "2015",
      label: "2015"
    },
    {
      value: "2016",
      label: "2016"
    },
    {
      value: "2017",
      label: "2017"
    },
    {
      value: "2018",
      label: "2018"
    },
    {
      value: "2019",
      label: "2019"
    },
    {
      value: "2020",
      label: "2020"
    }
  ],);
    

  const loading =
    <Grid container direction="column" justify="center" alignItems="center" className={classes.padding}>
      <Grid item>
        <CircularProgress/>
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>

  useEffect(() => {
    handleSearchConferences();
  }, [])

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  

  const navigateTop = () => {
    window.scrollTo(0, 0)
  }

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
  };

  
  const handleSearchConferences = () => {
    fetch(`${BASE_URL_CONFERENCE}searchConf/`)
    .then(response => response.json())
    .then(json => {
      setconference(json)
    });
  };


  // BAB:END 08/06/2021 :: cover other conferences.

 
   // const { selectedOption } = state;   // BAB 08/06/2021 :: cover other conferences.
    return (
      <>

      <Grid container component={Paper} className={classes.cardHeight}>     
              <Grid item xs>
                <Typography variant="h5" gutterBottom>
                  Conferences
                </Typography>
                <Typography className={classes.gutter}>
                  Search for conferences and show trends
                </Typography>

                <Autocomplete
                  loading={loading}
                  options={conference}
                  onInputChange={handleSearchConferences}
                  getOptionLabel={(option) => option.conference_full_name}
                  onChange={(event, values) => console.log("Searched Value !!"+ values)}
                  renderInput={(params) => <TextField {...params} label="Type an conference name" variant="outlined"/>}
                  className={classes.gutter}
                />
                <Button color="primary" onClick= "" width = "50px">
                    Show Trends
                </Button> 
              </Grid>
            </Grid>


        {/* Page content */}
        <Grid container component={Paper} className={classes.cardHeight}>

          <Card className="bg-gradient-default1 shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div
                  className="col"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "1000",
                    width: "5000",
                  }}
                >
                  <div>
                    <h2 className="text-white1 mb-0">Topic Trends</h2>
                    <p>
                      The following visualizations provide insights into
                      trends of conference data
                    </p>
                    <div style={{marginLeft: "40px"}}>
                      <Label>Select conference</Label>
                      <br></br>
                      <div style={{width: "200px"}}>
                        <Select
                        // BAB:BEGIN 08/06/2021 :: cover other conferences.
                          placeholder="Select conference"
                          options={available}
                          value={selectedOption}
                          onChange={handleChange}
                        // BAB:END 08/06/2021 :: cover other conferences.
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "700px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    {/*  BAB 08.06.2021 */ }
                    <Col>
                      <LAKForm conferenceName = {selectedOption.value} confEvents = {confEvents} />        {/*  BAB 08.06.2021 */ } 
                     </Col>
                  </div>
                </div>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "600px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                                        

                    <Col>
                      <LAKBar conferenceName = {selectedOption.value} confEvents = {confEvents} />          {/*  BAB 08.06.2021 */ }
                    </Col>
                  </div>
                </div>
                {/* <div className="main">
          <div className="row mt-4" style={{'height':'550px' ,'width':'400px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKBarPaperCount/>
               </Col>
            </div>
          </div> */}
                <br></br>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "700px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <LAKPie conferenceName = {selectedOption.value}  confEvents = {confEvents}/>       {/*  BAB 08.06.2021 */ } 
                    </Col>
                  </div>
                </div>
                <br></br>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "1000px",
                      width: "800px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <LAKStackedBarChart  conferenceName = {selectedOption.value} confEvents = {confEvents}/>    {/*  BAB 08.06.2021 */ }
                    </Col>
                  </div>
                </div>
                <br></br>
                <div
                  className="row mt-4"
                  style={{
                    height: "750px",
                    width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <LAKStackedAreaChart  conferenceName = {selectedOption.value} />   {/*  BAB 08.06.2021 */ } 
                  </Col>
                </div>

                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "900px",
                      width: "800px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <VennChart  conferenceName = {selectedOption.value} confEvents = {confEvents} page = 'topicbar' conferences = {conference}/>     {/*  BAB 08.06.2021 */ } 
                    </Col>
                  </div>
                </div>
              </Row>
              {/*<Row>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  */}
              {/*  <Col><div><br></br><Button color="primary" onClick=*/}
              {/*  {this.navigateTop}><i title="Navigate to top of the page"*/}
              {/*  className="fas fa-arrow-up text-white"*/}
              {/*  */}
              {/*></i></Button></div></Col>*/}
              {/*</Row>*/}
            </CardHeader>

            <ScrollTopWrapper/>
          </Card>
        </Grid>
      </>
    );
  }


