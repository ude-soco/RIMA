// Implemented By Abdallah
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";



class NewSharedAuthorEvolution extends Component {
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
          name : 'number of shared authors',
          data : [216, 278, 391, 447, 629, 698, 684, 460, 606, 644]
        },{
          name :'Total number of authors',
          data :[2, 3, 16, 11, 41, 61, 43, 15, 36, 16]
        },
        // {
        //   name :'lak',
        //   data :[0, 0, 0, 0, 0, 0, 113, 226, 180, 165, 236, 377, 418, 221, 218, 287, 250]
        // }
      ],

        options: {
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"],
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

    console.log(value);


    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    }, function(){
      this.compareSharedTotalAuthors();
    });

    console.log(this.state.selectedConferences);
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
          console.log("I am here AFTER ")
          for (let index = 0; index < 2; index++ ){
            console.log(index);
            for (let i = 0; i < json.weights.length; i++) {
                weights[i] = json.weights[i][index]
            }
            console.log("I am here 3 ")
            if (index == 0){
                series = series.concat([
                {name: 'Total number of Authors', data: weights,}]);
                } else {
                series = series.concat([
                {name: 'number of Shared Authors', data: weights,}]);
             }   
            console.log("weights", weights);
            weights = [];
            
        }
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
            <h2>Shared authors evolution</h2>
              <p>

             The evolution of the number of shared authors between conferences.            </p>
            <div style={{width: "100%"}}>
            <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select conferences to compare"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}

            />

            </div>


              {this.state.words.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common words found</div>

              ) : (<div/>)}
              <br/>
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
              height={350}
            />
          </div>
        </div>
      );
    } 
}

export default NewSharedAuthorEvolution;
