// Implemented By Abdallah
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Box, Grid, Button, InputLabel, MenuItem } from '@mui/material';
import { json } from "d3";



class NewCompareAuthorsPapersCol extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'aied', label: 'aied'},{value: 'edm', label: 'edm'}],
      selectedConferences:["lak","aied","edm"],
      words:[
        {value: "data",       label: "data"},
        {value: "learning",     label: "learning"},
        {value: "model",     label: "model"},
        {value: "models",       label: "models"},
        {value: "online",       label: "online"},
        {value: "paper",      label: "paper"},
        {value: "student",       label: "student"},
        {value: "students",        label: "students"},
        { value: "system", label: "system" },
      ],
        selectedOption:"",
        weights : [],
        series: [
          {
            name : 'aied',
            data : [ 120, 339, 100, 291, 110, 203, 325, 282, 298, 80]
          },{
            name :'edm',
            data :[ 91, 159, 181, 252, 305, 212, 130, 168, 268, 100]
          },{
            name :'lak',
            data :[ 226, 180, 165, 236, 377, 418, 221, 218, 287, 250]
          }],
          options: {
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              categories: ["1993", "2005", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"],
            },
             },
          barChartOptions: {
            chart: {
              id:'bar'
            },
            stacked: false,
            xaxis: {
              categories:['lak','edm','aied']
            },
      },
      BarChartSeries:  [
        {
          name:'',
          data : [ 120, 339, 100]
        }
      ],
        loader:false
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
    
        console.log("Abdo")
        console.log(value);
        console.log("Abdo")
    
    
        this.setState({
          selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
          selectedConferences: value,
        });
    
        console.log("BAB")
        console.log(this.state.selectedConferences);
        console.log("BAB")
      }
    
    
    
      selectSharedTopics = (e) => {
        this.setState({
          active1: true,
          active2: false,
          loader:true,
          key: "Authors",
        }, function() {
          this.clickEvent()
        });
      }
    
    
      selectSharedKeywords = (e) => {
        this.setState({
          active1: false,
          active2: true,
          loader:true,
          key: "Publications",
        }, function() {
          this.clickEvent()
        });
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
      get_Authors_Publications_Data(authors_publications) {
      fetch( BASE_URL_CONFERENCE +
        "TotalAuthorsPublicationsEvolution/"+authors_publications+"/" + "?" + this.state.selectedConferences.join("&"))
        .then((response) => response.json())
        .then((json) => {
          if (json && json[0].conferences && json[0][authors_publications]) {
            this.setState({
              barChartOptions: {
              ...this.state.barChartOptions,
              xaxis: {
                ...this.state.barChartOptions.xaxis,
                categories: json[0].conferences
              }
            },
            BarChartSeries: [{
              ...this.state.BarChartSeries[0],
              data: json[0][authors_publications]
            }]
          })
        }
        })
      }
      clickEvent =() => {
        if (this.state.key == "Authors"){
          var {series} = this.state;
          var {weights} =  this.state;
          fetch(
            BASE_URL_CONFERENCE +
            "AuthorsPapersEvolutio/Authors/" + "?" + this.state.selectedConferences.join("&")  )
            .then((response) => response.json())
            .then((json) => {
              series = [];
              weights = [];
              for (let index = 0; index < this.state.selectedConferences.length; index++ ){
                for (let i = 0; i < json.weights.length; i++) {
                    weights[i] = json.weights[i][index]
                }
                    series = series.concat([
                    {name: this.state.selectedConferences[index], data: weights,}]);
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
            this.get_Authors_Publications_Data(this.state.key)
        } else {
          var {series} = this.state;
          var {weights} =  this.state;    
          fetch(
            BASE_URL_CONFERENCE +
            "AuthorsPapersEvolutio/Publications/" +
            "?" +
            this.state.selectedConferences.join("&")  
          )
            .then((response) => response.json())
            .then((json) => {
            console.log(json);
            console.log("TEST 1]k");
              series = [];
              weights = [];
              console.log("TEST 1]kkk");
              for (let index = 0; index < this.state.selectedConferences.length; index++ ){
                for (let i = 0; i < json.weights.length; i++) {
                    weights[i] = json.weights[i][index]
                }
                    series = series.concat([
                    {name: this.state.selectedConferences[index], data: weights,}]);
    
                console.log("weights", weights);
                weights = [];
                
            }
              this.setState({
                selectConference: this.state.selectedConferences,
                active1: false,
                active2: true,
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
            this.get_Authors_Publications_Data(this.state.key)

        }
      }

  render() {
      return (
        <Box component='form' role='form' method='POST'>
          <Box>
            <br />
            <h2>Number of authors and publications evolution</h2>
            <p>
              The evolution of the number of authors and publications between conferences
            </p>
            <InputLabel>Select conferences</InputLabel>
            <Grid container spacing={3}>
              <Grid item style={{width:'60%', }}>
              <Select
                  ref={this.selectInputRef}
                  name="selectOptions"
                  isClearable
                  isMulti
                  placeholder="Select Option"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                  onChange={this.conferenceshandleChange}
                  defaultValue={this.state.mulitSelectDefaultValues}
                  
                  />
              </Grid>
              <Grid item>
                <Button
                  variant={this.state.active1 ? "contained" : 'outlined'}
                  color="primary"
                  active={this.state.active1}
                  value='Authors'
                  onClick={this.selectSharedTopics}
                sx={{textTransform:'none'}}>
                  Authors
                  </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={this.state.active2 ? "contained" : 'outlined'}
                  color='primary'
                  active={this.state.active2}
                  value='Publications'
                  onClick={this.selectSharedKeywords}
                  sx={{textTransform:'none'}}>
                  Publications
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              alignContent: 'center',
              position: 'absolute',
              marginLeft:"40%"
            }}>
            <Loader
              type='Bars'
              visible={this.state.loader}
              color='#00BFFF'
              height={100}
              width={100}
            />
          </Box>
          <Grid container sx={{width:'100%'}} style={{opacity: this.state.opacity}}>
                <Grid item sx={{width:"70%"}}>
                  <ReactApexChart
                      options={this.state.options}
                      series={this.state.series}
                      type="area"
                    height={350}
                    />
                </Grid>
                <Grid  item sx={{width:'30%'}}>
                 <ReactApexChart
                    options={this.state.barChartOptions}
                    series={this.state.BarChartSeries}
                    type="bar"
                    height={350}
                    />
                </Grid>
            </Grid>
            
        </Box>
      );
    } 
}

export default NewCompareAuthorsPapersCol;
