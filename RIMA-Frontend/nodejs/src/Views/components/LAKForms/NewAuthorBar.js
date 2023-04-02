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

class NewAuthorBar  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words:[
        {value: "data", label: "data"},
        {value: "system", label: "system"},],  
        years:[],
        commontpcs: [],
        display : "block",
        series: [{
            name: 'data',
            data: [44, 55]
          }, {
            name: 'analysis',
            data: [53, 32]
          }, {
            name: 'student',
            data: [53, 32]
          }, {
            name: 'online',
            data: [53, 32]
          }, {
            name: 'learning',
            data: [68, 19]
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
              categories: ["First Author", "Second Author"],
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + "K"
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
          selectedConferences: e,
          isLoading: true,
        }, function() {
          this.selectConfEvent();
        });
        console.log("here chooseeen")
        console.log("here chooseeen", e)

        console.log("choosen conf ", this.state.selectedConferences)


      }
    
      selectConfEvent = () => {
        fetch(BASE_URL_CONFERENCE + "confEvents/" + this.state.selectedConferences.value)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          confevents: json.events

        });
        });
      }
    
      handleAuthorsOfEvent = (e) => {
        this.setState({
          selectedEvent: e,
          isLoading: true,
        }, function() {
          this.selectEventsAuthors();
        });
        console.log("here chooseeen 2")
        console.log("here chooseeen 2", e)

        console.log("choosen event 2", this.state.selectedEvent)
        console.log("choosen conf of that 2", this.state.selectedConferences)
      }

      selectEventsAuthors = () => {
        fetch(BASE_URL_CONFERENCE + "eventAuthors/" + this.state.selectedEvent.value)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          eventAuthors: json.EventAuthors.sort((a, b) => (a.label > b.label ? 1 : -1)),
        });

        });
      }

      setAuthorName  = (e) => {
        this.setState({
          selectedEventAuthor: e,
          isLoading: true,
        });
        console.log("here chooseeen 3")
        console.log("here chooseeen 3", e)
        console.log("choosen papaer 3", this.state.selectedEventAuthor)
      }

      conferenceshandleChangeTwo = (e) =>{
        this.setState({
          selectedConferencesTwo: e,
          isLoading: true,
        }, function() {
          this.selectConfEventTwo(this.state.selectedConferencesTwo);
        });
        console.log("here chooseeen i")
        console.log("here chooseeen i", e)

        console.log("choosen conf i ", this.state.selectedConferencesTwo)


      }
    
      selectConfEventTwo = (val) => {
        fetch(BASE_URL_CONFERENCE + "confEvents/" + val.value)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
          confeventsTwo  : json.events

        });
        });
      }
    
      handleAuthorsOfEventTwo = (e) => {
        this.setState({
          selectedEventTwo: e,
          isLoading: true,
        }, function() {
          this.selectEventsAuthorsTwo(this.state.selectedEventTwo);
        });
        console.log("here chooseeen 2i")
        console.log("here chooseeen 2i", e)

        console.log("choosen event 2i", this.state.selectedEventTwo)
      }

      selectEventsAuthorsTwo = (val) => {
        fetch(BASE_URL_CONFERENCE + "eventAuthors/" + val.value)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            eventAuthorsTwo: json.EventAuthors.sort((a, b) => (a.label > b.label ? 1 : -1))

        });

        });
      }

      setAuthorNameTwo  = (e) => {
        this.setState({
          selectedEventAuthorTwo: e,
          isLoading: true,
        });
        console.log("here chooseeen 3i")
        console.log("here chooseeen 3i", e)
        console.log("choosen papaer 3i", this.state.selectedEventpaperTwo)
      }

      AuthorKeywordInterests = (val) => {
        fetch(BASE_URL_CONFERENCE + val + this.state.selectedEvent.value +"/" 
        + this.state.selectedEventTwo.value + "/" + "keyword" + "/" 
        + this.state.selectedEventAuthor.value + "/" + this.state.selectedEventAuthorTwo.value )
        .then((response) => response.json())
        .then((json) => {
            var series = [];
            console.log("auth", json.authorInterests[0]);
            for (let i = 0; i < json.authorInterests[0].length; i++) {
              series = series.concat([
                { name: json.authorInterests[0][i], data: json.authorInterests[1][i] },
              ]);
              //selectInputRef1.current.chart.publicMethods.updateOptions({})
            }
            this.setState({
              series: series,
              active3:false,
              active4:true,
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
                commontpcs: json.authorInterests[3],
                options: {...this.state.options,
                  xaxis: {...this.state.options.xaxis,
                  categories: json.authorInterests[2],
                }}
              }); 
        });  }
        AuthorTopicInterests = (val) => {
            fetch(BASE_URL_CONFERENCE + val + this.state.selectedEvent.value +"/" 
            + this.state.selectedEventTwo.value + "/" + "topic" + "/" 
            + this.state.selectedEventAuthor.value + "/" + this.state.selectedEventAuthorTwo.value )
            .then((response) => response.json())
            .then((json) => {
                var series = [];
                console.log("auth", json.authorInterests[0]);
                for (let i = 0; i < json.authorInterests[0].length; i++) {
                  series = series.concat([
                    { name: json.authorInterests[0][i], data: json.authorInterests[1][i] },
                  ]);
                  //selectInputRef1.current.chart.publicMethods.updateOptions({})
                }
                this.setState({
                  series: series,
                  active3:true,
                  active4:false,
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
                    commontpcs: json.authorInterests[3],
                    options: {...this.state.options,
                      xaxis: {...this.state.options.xaxis,
                      categories: json.authorInterests[2],
                    }}
                  }); 
            });  }

        

  render() {
      return (
        <div id="chart" className="box">
           <Form role="form" method="POST">
            <FormGroup>
            <h2>Most popular topics and keywords between authors</h2>
              <p>
              Most popular topics and keywords, and shared topics and keywords between authors.
             </p>
          <Label>Select first event author</Label>

          <Row>
            <Col>
              <Select
                placeholder="Select a conference"
                options={this.props.conferencesNames}
                value={this.state.selectedConferences}
                onChange={this.conferenceshandleChange}
                  />
            </Col>
            <Col>
              <Select
                placeholder="Select an Event"
                options={this.state.confevents}
                value={this.state.selectedEvent}
                onChange={this.handleAuthorsOfEvent}
                  />
            </Col>
            <Col>
              <Select
                placeholder="Select an Author"
                options={this.state.eventAuthors}
                value={this.state.SelectedAuthor}
                onChange={this.setAuthorName}
                  />
            </Col>
          </Row>
          <Label>Select second event author</Label>
          <Row>
          <Col>
              <Select
                placeholder="Select a conference"
                options={this.props.conferencesNames}
                value={this.state.selectedConferencesTwo}
                onChange={this.conferenceshandleChangeTwo}
                  />
            </Col>
            <Col>
              <Select
                placeholder="Select an Event"
                options={this.state.confeventsTwo}
                value={this.state.selectedEventTwo}
                onChange={this.handleAuthorsOfEventTwo}
                  />
            </Col>
            <Col>
              <Select
                placeholder="Select an Author"
                options={this.state.eventAuthorsTwo}
                value={this.state.SelectedAuthorTwo}
                onChange={this.setAuthorNameTwo}
                  />
            </Col>
          </Row>
            <br/>
          <Button
                outline
                active={this.state.active3}
                color="primary"
                onClick={() => this.AuthorTopicInterests("AuthorInterestsNew/")}
              >
                Topics
              </Button>
              <Button
                outline
                active={this.state.active4}
                color="primary"
                onClick={() => this.AuthorKeywordInterests("AuthorInterestsNew/")}
              >
                Keywords
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
          <h5>Common topics/keywords</h5>
              {this.state.commontpcs.length == 0 ? (
                <div>No common topics/keywords found</div>
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


export default NewAuthorBar;
