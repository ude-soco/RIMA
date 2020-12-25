//Done by Swarna
import React from "react";
import Chart from "chart.js";
import Select from 'react-select';
import LAKForm from "../components/LAKForms/LAKForm";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody, Container, Row, Col,Label } from "reactstrap";

// core components
import { chartOptions, parseOptions } from "variables/charts.js";
import { handleServerErrors } from "utils/errorHandler";
import Header from "components/Headers/Header.js";
import { getItem } from "utils/localStorage";
import swal from "@sweetalert/with-react";
import "../assets/scss/custom.css";
import LAKBar from "components/LAKForms/LAKBar";
import LAKBarPaperCount from "components/LAKForms/LAKBarPaperCount";
import LAKPie from "components/LAKForms/LAKPie";
import LAKStackedAreaChart from "components/LAKForms/LAKStackedAreaChart";
import VennChart from "components/LAKForms/VennChart";
import LAKStackedBarChart from "components/LAKForms/LAKStackedBarChart";


class TopicBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 4,
      chartExample1Data: "data1",
      tooltipOpen: false,
      imageTooltipOpen: false,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  
  
  
 
  render() {
    const conference=[{
      label:"LAK",
      value:"LAK"
    }];
    return (
      <>
       
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default1 shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        height:"1000",
                        width:"5000"
                      }}
                    >
                      <div>
                        <h2 className="text-white1 mb-0">Topic Trends</h2>
                        <p>
                          The following visualizations provide insights into trends of conference data
                      
                        </p>
                        <div style={{'marginLeft':'40px'}}>
                          <Label>Select conference</Label>
                          <br></br>
                          <div style={{width: '200px'}}>
                        <Select   placeholder="Select conference" options={conference} value={conference.find(obj => obj.value === "LAK")} 
                         />
                         </div>
                         </div>
                      </div>
                     
                    </div>
                    
                  </Row>
                  <Row>
                 
                  <div className="main">
            <div className="row mt-4" style={{'height':'700px' ,'width':'830px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKForm />
               </Col>
            </div>
            </div>
                  <div className="main">
            <div className="row mt-4" style={{'height':'600px' ,'width':'830px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKBar/>
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
          <div className="row mt-4" style={{'height':'700px' ,'width':'830px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKPie/>
               </Col>
            </div>
          </div>
          <br></br>
          <div className="main">
            <div className="row mt-4" style={{'height':'1000px' ,'width':'800px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKStackedBarChart/>
               </Col>
            </div>
           
          </div>
         <br></br>
          <div className="row mt-4" style={{'height':'750px' ,'width':'830px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKStackedAreaChart/>
               </Col>
            </div>
        
            <div className="main">
            <div className="row mt-4" style={{'height':'900px' ,'width':'800px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <VennChart/>
               </Col>
            </div>
            </div>
                 
         
               
            
          
                  </Row>
                  
                </CardHeader>

                <CardBody>
                  
                  
                  
                  
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default TopicBar;
