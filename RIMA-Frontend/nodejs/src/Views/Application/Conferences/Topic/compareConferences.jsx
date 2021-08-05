import React, {useState,useEffect } from "react";
import {CircularProgress, Grid, makeStyles, Paper, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import CompareStackedAreaChart from "../../../components/LAKForms/compareStackedAreaChart";
import CompareStackedBarChart from "../../../components/LAKForms/compareStackedBarChart";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import {chartOptions, parseOptions} from "Services/variables/charts.js";

import Chart from "chart.js";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../../Services/constants";

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


export default function CompareConferences (props) {
    const [selectedOption, setselectedOption] = useState({ label: 'lak', value: 'lak' });
    const [available, setavailable] = useState([{ label: 'ecctd', value: 'ecctd' },{ label: 'acisp', value: 'acisp' },{ label: 'aaecc', value: 'aaecc' },{ label: 'eann', value: 'eann' },{ label: 'lak', value: 'lak' },{ label: 'edm', value: 'edm' },{ label: 'aied', value: 'aied' },{ label: 'camsap', value: 'camsap' }]);
    const classes = useStyles();

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


    return (
        <>
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
          <h2 className="text-white1 mb-0">Comparison of Conference(s)</h2>
          <p>
          
            The following visualizations compare the topics of conference over multiple years
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
            height: "1000px",
            width: "800px",
            backgroundColor: "#F0F8FF",
            marginLeft: "50px",
            borderRadius: "2px",
          }}
        >
          <Col>
            <CompareStackedBarChart  conferenceName = {selectedOption.value} confEvents = {confEvents}/>    {/*  BAB 08.06.2021 */ }
          </Col>
        </div>
      </div>
      <br></br>
      <div
        className="row mt-4"
        style={{
          height: "800px",
          width: "830px",
          backgroundColor: "#F0F8FF",
          marginLeft: "50px",
          borderRadius: "2px",
        }}
      >
        <Col>
          <CompareStackedAreaChart  conferenceName = {selectedOption.value} />   {/*  BAB 08.06.2021 */ } 
        </Col>
      </div>

     
    </Row>
  </CardHeader>

  <ScrollTopWrapper/>
</Card>
</Grid>
  
        </>
);
}