import React, {useState,useEffect } from "react";
import {Grid, makeStyles, Paper} from "@material-ui/core";
import CompareStackedAreaChart from "../../../components/LAKForms/compareStackedAreaChart";
import CompareStackedBarChart from "../../../components/LAKForms/compareStackedBarChart";
import CompareTimeLineChart from "../../../components/LAKForms/CompareTimeLineChart";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";

import RestAPI from "../../../../Services/api";

import {
    Card,
    CardHeader,
    Row,
    Col,
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
    const [availableConferences, setavailableConferences] = useState([]);
    const classes = useStyles();


    useEffect(() => {
      getConferencesNames();
      
    }, [])

    //** GET ALL CONFERENCES **//
    const getConferencesNames = () => {
      RestAPI.getConferencesNames()
        .then((response) => {
          setavailableConferences(response.data);
        })
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
                    
                      The following visualizations compare the trends of different conferences using multiple criterion over the years
                    </p>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "900px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <CompareStackedBarChart  conferencesNames = {availableConferences}/>    
                    </Col>
                  </div>
                </div>
                <br></br>
                <div
                  className="row mt-4"
                  style={{
                    height: "900px",
                    width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <CompareStackedAreaChart conferencesNames = {availableConferences}/>   
                  </Col>
                </div>

                <div
                  className="row mt-4"
                  style={{
                    height: "900px",
                    width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <CompareTimeLineChart conferencesNames = {availableConferences}/>    
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