// Implemented By Abdallah
import React, {Component,useState,useEffect} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form, Row, Col, Badge} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class NewComparePapers  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words:[
        {value: "data", label: "data"},
        {value: "system", label: "system"},],  
        years:[],
        commontpcs: [],
        confevents:[],
        confeventsTwo:[],
        eventsPaper:[],
        eventsPaperTwo:[],
        active2 : false,
        series: [{
            name: 'Data',
            data: [44, 55]
          }, 
          {
            name: 'Analysis',
            data: [53, 32]
          }, 
          {
            name: 'Student',
            data: [33, 62]
          }],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%'
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            xaxis: {
              categories: ["Paper 1", "Paper 2"],
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val 
                }
              }
            },
            fill: {
              opacity: 1
            
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetX: 40
            }
          },
        
        
        };
      }

      conferenceshandleChange = (e) =>{
        this.setState({
          selectedConferences: e.value,
          isLoading: true,
        }, function() {
          this.selectConfEvent();
        });
        console.log("here chooseeen")

        console.log("choosen conf ", this.state.selectedConferences)


      }
    
      selectConfEvent = () => {
        fetch(BASE_URL_CONFERENCE + "confEvents/" + this.state.selectedConferences)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          confevents: json.events

        });
        });
      }
    
      handlePapersOfEvent = (e) => {
        this.setState({
          selectedEvent: e.value,
          isLoading: true,
        }, function() {
          this.selectEventsPapers();
        });
        console.log("here chooseeen 2")

        console.log("choosen event 2", this.state.selectedEvent)
        console.log("choosen conf of that 2", this.state.selectedConferences)
      }

      selectEventsPapers = () => {
        fetch(BASE_URL_CONFERENCE + "EventPapers/" + this.state.selectedEvent)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          eventsPaper: json.papers,
          eventsPaperAbstract: json.paperWithAbstract

        });

        });
      }

      setPaperTitle  = (e) => {
        this.setState({
          selectedEventpaper: e.value,
          isLoading: true,
        });
        console.log("here chooseeen 3")
        console.log("choosen papaer 3", this.state.selectedEventpaper)
      }

      conferenceshandleChangeTwo = (e) =>{
        this.setState({
          selectedConferencesTwo: e.value,
          isLoading: true,
        }, function() {
          this.selectConfEventTwo(this.state.selectedConferencesTwo);
        });
        console.log("here chooseeen i")

        console.log("choosen conf i ", this.state.selectedConferencesTwo)


      }
    
      selectConfEventTwo = (val) => {
        fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          confeventsTwo  : json.events

        });
        });
      }
    
      handlePapersOfEventTwo = (e) => {
        this.setState({
          selectedEventTwo: e.value,
          isLoading: true,
        }, function() {
          this.selectEventsPapersTwo(this.state.selectedEventTwo);
        });
        console.log("here chooseeen 2i")

        console.log("choosen event 2i", this.state.selectedEventTwo)
      }

      selectEventsPapersTwo = (val) => {
        fetch(BASE_URL_CONFERENCE + "EventPapers/" + val)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          eventsPaperTwo: json.papers,
          eventsPaperAbstractTwo: json.paperWithAbstract

        });

        });
      }

      setPaperTitleTwo  = (e) => {
        this.setState({
          selectedEventpaperTwo: e.value,
          isLoading: true,
        });
        console.log("here chooseeen 3i")
        console.log("choosen papaer 3i", this.state.selectedEventpaperTwo)
      }

      comparePapers = (val) => {
        fetch(BASE_URL_CONFERENCE + val + this.state.selectedEventpaper + "/" +this.state.selectedEvent +"/" + this.state.selectedEventpaperTwo + "/" + this.state.selectedEventTwo)
        .then((response) => response.json())
        .then((json) => {
          var series = []; 
          console.log("TESSSSSST URL", json.paperInterests[0]);
          for (let i = 0; i < json.paperInterests[0].length; i++) {
            console.log(i)
            series = series.concat([
              {name: json.paperInterests[0][i], data: json.paperInterests[1][i]},      
            ]);
            console.log("series steps ", series)
          }
          console.log("here is built series", series)
          this.setState({
            series: series,
            options: {...this.state.colors,
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
              ]},
              display: "block",
              commontpcs: json.Topiclist,
              active2: true
            }); 
        });  }

    

    
        

  render() {
      return (
        <div id="chart" className="box">
           <Form role="form" method="POST">
            <FormGroup>
            <h2>Most popular keywords in publications</h2>
              <p>
             Most popular, and shared keywords between publications.
              </p>
          <Label>Select first event publications</Label>
          <Row>
            <Col>
            <Select
                  placeholder="First conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                  onChange ={this.conferenceshandleChange}
                />
            </Col>
            <Col>
            <Select
                  placeholder="First conference event "
                  options={this.state.confevents}
                  value={this.state.confevents.find((obj) => obj.value === this.state.selectedEvent)}
                  onChange ={this.handlePapersOfEvent}
                />
            </Col>
            <Col>
              <Select
                placeholder="Select a paper"
                options={this.state.eventsPaperAbstract}
                value={this.state.eventsPaper.find((obj) => obj.value === this.state.selectedEventpaper)}
                onChange={this.setPaperTitle}
                  />
            </Col>
          </Row>
          <Label>Select second event publications</Label>
          <Row>
          <Col>
          <Select
                  placeholder="Second conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConferenceTwo)}
                  onChange ={this.conferenceshandleChangeTwo}
                 />
            </Col>
            <Col>
            <Select
                  placeholder="Second conference event"
                  options={this.state.confeventsTwo}
                  value={this.state.confeventsTwo.find((obj) => obj.value === this.state.selectedEventTwo)}
                  onChange ={this.handlePapersOfEventTwo}
                />
            </Col>
            <Col>
              <Select
                placeholder="Select a paper"
                options={this.state.eventsPaperAbstractTwo}
                value={this.state.eventsPaperTwo.find((obj) => obj.value === this.state.selectedEventpaperTwo)}
                onChange={this.setPaperTitleTwo}
                  />
            </Col>
          </Row>

<br/>
             
              <Button
                outline
                active={this.state.active2}
                color="primary"
                onClick={() => this.comparePapers("comparePapers/")}
              >
                Compare
              </Button>
              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
              </div>
            </FormGroup>
          </Form> 
          <div style={{opacity: this.state.opacity}}>
          <Row>
          <div style={{width: "80%"}}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={300}
            />
</div>
            <Col>
          <h5>Common keywords</h5>
              {this.state.commontpcs.length == 0 ? (
                <div>No common keywords found</div>
              ) : (
                this.state.commontpcs.map((number) => (
                  <Badge
                    target="_blank"
                    color="info"
                    style={{ marginLeft: "1%" }}
                  >
                    {number}
                  </Badge>
                ))
              )}
              </Col>


        </Row>
          </div>
        </div>
      );
    } 
  }


export default NewComparePapers ;
