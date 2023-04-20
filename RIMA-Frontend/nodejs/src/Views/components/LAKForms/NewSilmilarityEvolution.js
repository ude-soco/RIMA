// Implemented By Abdallah
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form, Row, Col} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class NewSilmilarityEvolution extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'edm', label: 'edm'}],
      selectedConferences:["lak","aied","edm"],
      words:[
        {value: "data", label: "data"},
        {value: "learning", label: "learning"},
        {value: "model", label: "model"},
        {value: "models", label: "models"},
        {value: "online", label: "online"},
        {value: "paper", label: "paper"},
        {value: "student", label: "student"},
        {value: "students", label: "students"},
        {value: "system", label: "system"},],
      selectedOption:"",
      weights : [],
      series: [
        {
          name : 'Similarity index',
          data : [8, 10, 14, 15, 19, 21, 16, 10, 20, 11]
        },
        
      ],

        options: {
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: ["2011","2012","2013","2014","2015","2016","2017","2018","2019","2020"],
          },
          yaxis: [
            {title: {
              text: "Similarity Index",
              style: {
                color: '#008FFB',
              }
            },}
          ],
        },

      loader: false,
      display: "none",
      opacity: "0.9",
      selectValue: {value: 'learning', label: 'learning'},
      selectConference: "",
      key: "",
      active1: false,
      active2: true,
      active3: true,
      active4: false,
      imageTooltipOpen: false,
    };
  }

  wordhandleChange = (e) =>{
    console.log(e.value)
    this.setState({
      selectValue: e
    })
    console.log(this.state.selectValue)
  }
  conferenceshandleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];

    console.log("BAB v")
    console.log(value);
    console.log("BAB v")
    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    }, function(){
      this.compareSharedTotalAuthors();
    });

    console.log("BAB")
    console.log(this.state.selectedConferences);
    console.log("BAB")
  }  
  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };
  onClear = () => {
    this.setState({
      active1: false,
      active2: false,
      active3: false,
      active4: true,
      selectedConferences:[],
      years : [],
      selectValue : "",
      opacity: "0",
    });

    this.selectInputRef.current.select.clearValue();

  }
    compareSharedTotalAuthors =() => {
    var {series} = this.state;
    var {weights} =  this.state;
    fetch(
        BASE_URL_CONFERENCE +
        "getTotalSharedAuthorsEvolution/"  +
        "?" +
        this.state.selectedConferences.join("&")  
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          console.log("I am here 2 ")
          series = [];
          weights = [];
          var totalNumberOfAuthors = [];
          var numberOfSharedAuthors = [];
          var similaritOfAuthorsIndex = [];
          var firstYears = [];
          console.log("I am here AFTER ")
          if(this.state.selectedConferences.length == 1){
            for (let index = 0; index < json.years.length; index++){
              similaritOfAuthorsIndex[index] = 100;
            }
            var series = series.concat([
            {name: 'Similarity Index', data: similaritOfAuthorsIndex }]);
            this.setState({
              selectConference: this.state.selectedConferences,
              active1: true,
              active2: false,
              active3: true,
              active4: false,
              series: series,
              datalabels: {
                enabled: true,
              },
  
              options: {
                ... this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.years,
                }
               },
              
              loader: false,
              opacity: "0.9",
            });
            
          }  else {
          for (let index = 0; index < 2; index++ ){
            console.log(index);
            for (let i = 0; i < json.weights.length; i++) {
                weights[i] = json.weights[i][index]
            }
            console.log("I am here 3 ")
            if (index == 0){
                totalNumberOfAuthors = weights;
                console.log("I am here AFTER totalNumberOfAuthors ", totalNumberOfAuthors)
                } else {
                numberOfSharedAuthors = weights;
                console.log("I am here AFTER numberOfSharedAuthors ", numberOfSharedAuthors)
             }
    
            console.log("similaritOfAuthorsIndex similaritOfAuthorsIndex ", similaritOfAuthorsIndex);
            weights = [];
            firstYears = json.years;
            console.log("firstYears firstYears ", firstYears)
            
        }
        for (let i = 0; i < json.weights.length; i++) {
            similaritOfAuthorsIndex[i] = Math.round(numberOfSharedAuthors[i] / totalNumberOfAuthors [i] * 100);
        } 
        firstYears = json.years;
        console.log("firstYears firstYears ", firstYears)

          this.setState({
            selectConference: this.state.selectedConferences,
            similaritOfAuthorsIndex : similaritOfAuthorsIndex,
            firstYears : firstYears,
            active1: true,
            active2: false,
            active3: true,
            active4: false,
            series: series,
            datalabels: {
              enabled: true,
            },

            options: {
              ... this.state.options,
              xaxis: {
                ...this.state.options.xaxis,
                categories: json.years,
              }
             },
            
            loader: false,
            opacity: "0.9",
          }
          , function(){
            this.getSimilarityIndexOfWords(this.state.similaritOfAuthorsIndex);
          }
          );
        }
        });
        
    }
    getSimilarityIndexOfWords  =(val) => {
        fetch(
            BASE_URL_CONFERENCE +
            "getSharedWordsNumber/"  +
            "?" +
            this.state.selectedConferences.join("&")  
          )
            .then((response) => response.json())
            .then((json) => {
              console.log(json);
              console.log("I am here 2 ")
              var series = [];
              var finalSimilarityIndex = [];
              var weights = [];
              var topicsNumber = [];
              var kewyordsNumber = [];
              var similarityOfWordsIndex = [];
              var secondYears = [];
              var sharedYears = [];
              console.log("I am here AFTER ")
              for (let index = 0; index < 2; index++ ){
                console.log(index);
                console.log(json);
                for (let i = 0; i < json.weights.length; i++) {
                    weights[i] = json.weights[i][index]
                }
                console.log("I am here 3 ")
                if (index == 0){
                    topicsNumber = weights;
                    console.log("I am here AFTER topicsNumber ", topicsNumber)
                    } else {
                    kewyordsNumber = weights;
                    console.log("I am here AFTER kewyordsNumber ", kewyordsNumber)
                 }
                for (let i = 0; i < json.weights.length; i++) {
                    similarityOfWordsIndex[i] = topicsNumber[i] + kewyordsNumber [i];
                }
                secondYears = json.years;
                     
                console.log("weights", weights);
                weights = [];
                
            }
            for (let i = 0; i < json.weights.length; i++) {
                finalSimilarityIndex[i] = similarityOfWordsIndex[i] +  val[i];
            }
            var series = series.concat([
                {name: 'Similarity Index', data: finalSimilarityIndex }]);


            console.log("finalSimilarityIndex finalSimilarityIndex ", finalSimilarityIndex)
            console.log("firstYears firstYears ", this.state.firstYears)
              this.setState({
                selectConference: this.state.selectedConferences,
                active1: true,
                active2: false,
                active3: true,
                active4: false,
                series: series,
                datalabels: {
                  enabled: true,
                },

                options: {
                  ... this.state.options,
                  xaxis: {
                    ...this.state.options.xaxis,
                    categories: json.years,
                  }
                 },
                
                loader: false,
                opacity: "0.9",
              });
            });
        }

  render() {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
            <h2>Similarity between conferences </h2>
            <Row style={{marginLeft: "1%"}}>
              <p>
              Similarity comparison between conferences.
              </p>
              <Col>

              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
              />
              {this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    marginTop: "0px",
                    position: "absolute",
                    marginLeft: "30%",
                    left: "10px",
                    width: "400px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    {" "}
                    This similarity index is made from the calculation of the percentage of the shared author to the number of total authors plus the number of shared topics/keywords between selected conferences over their shared years.                  </p>
                </div>
              )}
                 </Col>
              </Row> 
            <Label>Select conferences</Label>
            <Row>
            <div style={{width: "40%", marginLeft: "2%", marginRight: "2%",}}>
            <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select conferences"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}
            />
            </div>


          </Row>
          <br/>

              {this.state.words.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common words found</div>

              ) : (<div/>)}

              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <div style={{backgroundColor: "white", display: this.state.display}}>
                  <Loader
                    type="Bars"
                    visible={this.state.loader}
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            </FormGroup>
          </Form>
          <div style={{opacity: this.state.opacity}}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="area"
              height={250}
            />
          </div>
        </div>
      );
    } 
}

export default NewSilmilarityEvolution;
