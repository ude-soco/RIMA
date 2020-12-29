//Done by Swarna
import React from "react";
import Chart from "chart.js";
import LAKForm from "../components/LAKForms/LAKForm";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody, Container, Row, Col,Label } from "reactstrap";
import Select from 'react-select';
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
import LAKAuthorsbar from "components/LAKForms/LAKAuthorsbar";
import AuthorNetwork from "components/LAKForms/AuthorNetwork";


class TopicAuthors extends React.Component {
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
                        <h2 className="text-white1 mb-0">Comparison of Researchers</h2>
                        <p>
                          The following visualizations provide information related to the researchers of conference
                         
                          
                          
                          
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
                 
                  <div>
               <br></br>
              
                <Row>
                  
            <Col>
           
           
            <AuthorNetwork/>
           
            
           </Col></Row>
           <br></br>
          <div className="row mt-4" style={{'height':'900px' ,'width':'800px',
      'backgroundColor':'#F0F8FF','marginLeft':'50px',
      'borderRadius':'2px'}}>
           <Row>
                  
            <Col>
            <LAKAuthorsbar/>
           </Col></Row>
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

export default TopicAuthors;
