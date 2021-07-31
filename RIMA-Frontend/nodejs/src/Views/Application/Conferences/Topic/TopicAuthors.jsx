//Done by Swarna
import React ,{useState,useEffect } from "react";
import Chart from "chart.js";
import {Card, CardHeader, CardBody, Container, Row, Col, Label} from "reactstrap";
import Select from 'react-select';
// core components
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import LAKAuthorsbar from "../../../components/LAKForms/LAKAuthorsbar";
import AuthorNetwork from "../../../components/LAKForms/AuthorNetwork";
import {BASE_URL_CONFERENCE} from "../../../../Services/constants";


export default function TopicAuthors (props) { 
  
    const [selectedOption, setselectedOption] = useState({ label: 'lak', value: 'lak' });
    const [available, setavailable] = useState([{ label: 'ecctd', value: 'ecctd' },{ label: 'acisp', value: 'acisp' },{ label: 'aaecc', value: 'aaecc' },{ label: 'eann', value: 'eann' },{ label: 'lak', value: 'lak' },{ label: 'edm', value: 'edm' },{ label: 'aied', value: 'aied' },{ label: 'camsap', value: 'camsap' }]);
    
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

        {/* Page content */}
        <Container  fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" >
              <Card className="bg-gradient-default1 shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        height: "1000",
                        width: "5000"
                      }}
                    >
                      <div>
                        <h2 className="text-white1 mb-0">Comparison of Researchers</h2>
                        <p>
                          The following visualizations provide information related to the researchers of conference
                        </p>
                        <div style={{'marginLeft': '40px'}}>
                          <Label>Select conference</Label>
                          <br/>
                          <div style={{width: '200px'}}>
                            <Select
                              placeholder="Select conference"
                              options={available}
                              value={selectedOption}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <br/>
                      <Row>
                        <Col>
                          <AuthorNetwork conferenceName = {selectedOption.value} confEvents = {confEvents}/>
                        </Col>
                      </Row>
                      <br/>
                      <div className="row mt-4" style={{
                        'height': '900px', 'width': '800px',
                        'backgroundColor': '#F0F8FF', 'marginLeft': '50px',
                        'borderRadius': '2px'
                      }}>
                        <Row>
                          <Col>
                            <LAKAuthorsbar conferenceName = {selectedOption.value} confEvents = {confEvents}/>
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


