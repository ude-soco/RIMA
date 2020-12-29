import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Sigma,RelativeSize,RandomizeNodePositions } from "react-sigma";
import { Graph } from "react-d3-graph";

import SigmaLoader from "./Sigma/Loader";
import NodeShapes from "./Sigma/NodeShapes";
import {BASE_URL_INTEREST} from '../../constants';
import Select from "react-select";
import "./styles.css";
import ReactApexChart from "react-apexcharts";
import { Button,Label } from "reactstrap";

class LAKStackedBarChart extends Component {
  
  constructor(props) {
    super(props);
    
    this.selectInputRef = React.createRef();
    this.selectyearValue=this.selectyearValue.bind(this);
    this.selectTopic=this.selectTopic.bind(this);
    this.selectKey=this.selectKey.bind(this);
    this.compareTopic=this.compareTopic.bind(this);
    this.clearValues=this.clearValues.bind(this);
    
    
   
    this.state = {
      
      weights:[],
      years:[],
      topics:[],
      series:[],
      selectedValue:"",
      selectYear:"",
      key:"",
      url:"",
      active1:true,
      active2:false,
      active3:false,
      active4:false,
      isLoaded:false,
      graphData:[],
      isModalLoader:false,
      opacity:'0'

      
     
      }
   
    }
   
handleToogle = (status) => {
      this.setState({ imageTooltipOpen: status });
      console.log(this.state.imageTooltipOpen)
    }  
componentDidMount(){
  var text=['2011','2012']
  fetch(BASE_URL_INTEREST+"getalltopiclist/"+'?'+text.join('&'))
  .then(response =>  response.json())
  .then(json => {
      var series=[]  
      console.log(json.Topiclist[0])
      for(let i=0;i<json.Topiclist[0].length;i++){
          series=series.concat([{name:json.Topiclist[1][i],data:json.Topiclist[0][i]}])
          //selectInputRef1.current.chart.publicMethods.updateOptions({})
        } 
      this.setState({
        selectYear:Array(['2011','2012']),
        active3:true,
        active4:false,
        series: series,
        opacity:1,

        options:{
          chart: {
              
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%',
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
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
           

            xaxis:{
                categories:json.Topiclist[2]
            },
            yaxis: {
              title: {
                text: undefined
              },
              labels: {
                style: {
                  
                  fontWeight:700
                }}
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'left',
              offsetX: 40
            }
        },
        years:json.Topiclist[2],
        isLoaded:true,
        
      
        
      })            
  });



}
selectKey(e){
  this.setState({
    active1:false,
    active2:true,
    active3:false,
    active4:false,
    key:e.target.value,
   })
}
compareTopic(){
  var key=this.state.key;
  if(key=="key"){
    var text=this.state.selectedValue;
    fetch(BASE_URL_INTEREST+"getallkeylist/"+'?'+text.join('&'))
    .then(response =>  response.json())
    .then(json => {
        var series=[]  
        console.log(json.Topiclist[0])
        for(let i=0;i<json.Topiclist[0].length;i++){
            series=series.concat([{name:json.Topiclist[1][i],data:json.Topiclist[0][i]}])
            //selectInputRef1.current.chart.publicMethods.updateOptions({})
          } 
        this.setState({
          active1:false,
          active2:true,
          active3:true,
          active4:false,
          opacity:1,
          series: series,

          options:{
            chart: {
                
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%',
                toolbar: {
                  show: true
                },
                zoom: {
                  enabled: true
                }
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
             

              xaxis:{
                  categories:json.Topiclist[2]
              },
              yaxis: {
                title: {
                  text: undefined
                },
                labels: {
                  style: {
                    
                    fontWeight:700
                  }}
              },
              fill: {
                opacity: 1
              },
              legend: {
                position: 'bottom',
                horizontalAlign: 'left',
                offsetX: 40
              }
          },
          years:json.Topiclist[2],
          isLoaded:true,
          
        
          
        })            
    });

  }
  else{
    var text=this.state.selectedValue;
    fetch(BASE_URL_INTEREST+"getalltopiclist/"+'?'+text.join('&'))
    .then(response =>  response.json())
    .then(json => {
        var series=[]  
        console.log(json.Topiclist[0])
        for(let i=0;i<json.Topiclist[0].length;i++){
            series=series.concat([{name:json.Topiclist[1][i],data:json.Topiclist[0][i]}])
            //selectInputRef1.current.chart.publicMethods.updateOptions({})
          } 
        this.setState({
          active1:true,
          active2:false,
          active3:true,
          active4:false,
          opacity:1,
          series: series,

          options:{
            chart: {
                
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%',
                toolbar: {
                  show: true
                },
                zoom: {
                  enabled: true
                }
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
             

              xaxis:{
                  categories:json.Topiclist[2]
              },
              yaxis: {
                title: {
                  text: undefined
                },
                labels: {
                  style: {
                    
                    fontWeight:700
                  }}
              },
              fill: {
                opacity: 1
              },
              legend: {
                position: 'bottom',
                horizontalAlign: 'left',
                offsetX: 40
              }
          },
          years:json.Topiclist[2],
          isLoaded:true,
          
        
          
        })            
    });
  }

}

selectTopic(e){
   this.setState({
     active1:true,
     active2:false,
     active3:false,active4:false,
    key:e.target.value,
   })

}
clearValues(){
  this.selectInputRef.current.select.clearValue();
      this.setState({
        'opacity':'0',
        active4:true,
        active3:false
      })
}
selectyearValue(e){
    
    const value = Array.isArray(e) ? e.map(s => s.value) : [];
    this.setState({
        selectYear:value,
        selectedValue:value,
        
    });
    console.log("value is",this.state.selectedValue)

}
  render() {
    var {keywords,isLoaded,selectYear,options,series,active1,active2,key,opacity,active3,active4}=this.state;
    
    const yeardata = [
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
      ];
    
    if(isLoaded){
    return (
      <div className="App" style={{'height':'1000px','width':'700px'}}>
        <h3>Topic distribution across years</h3>
        <br></br>
        <p>This visualization displays the comparison of topics/keywords over multiple years</p>
        <br></br>
        <Button outline value="topic" color="primary" active={active1} onClick={this.selectTopic}>Topic</Button>
        <Button outline value="key" color="primary" active={active2} onClick={this.selectKey}>Keyword</Button>
        <i  className="fas fa-question-circle text-blue"
       
       onMouseOver={() => this.handleToogle(true)}
       onMouseOut={() => this.handleToogle(false)}
       ></i> 
       {
        this.state.imageTooltipOpen && (
                            
                            <div
                              className="imgTooltip"
                              style={{ 
                              marginTop: "0px",
                              position:'relative',
                              left:'205px',
                              width:'500px',
                              height:'40px',
                              color: "#8E8E8E",
                              border: "1px solid #BDBDBD",
                              
                            }}
                            >
                            <p>Each part in a bar represent a specific topic/keyword</p>


                            </div>
                          )}
              <br></br>
              <br></br>
        <Label>Select years</Label>
        <br></br>
      
      
        <div style={{width: '600px'}}>
        <Select ref={this.selectInputRef} isMulti isClearable
                placeholder="Select Option"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
              </div>
              <br></br>
            
            
              <Button outline active={active3} value="topic" color="primary" onClick={this.compareTopic}>Compare</Button>
        <Button outline active={active4} value="key" color="primary"  onClick={this.clearValues}>Reset</Button>
              <br></br>
             
              <br></br>
              <div style={{'opacity':opacity}}>
              <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
              </div>
     
      </div>
    );
    }
    else{
        return(<>
        <h3>Topic distribution across years</h3>
        <br></br>
        <p>This visualization displays the comparison of topics/keywords over multiple years</p>
        <br></br>
        <Button outline value="topic" color="primary" active={active1} onClick={this.selectTopic}>Topic</Button>
        <Button outline value="key" color="primary" active={active2} onClick={this.selectKey}>Keyword</Button>
        <i  className="fas fa-question-circle text-blue"
       
       onMouseOver={() => this.handleToogle(true)}
       onMouseOut={() => this.handleToogle(false)}
       ></i> 
       {
        this.state.imageTooltipOpen && (
                            
                            <div
                              className="imgTooltip"
                              style={{ 
                              marginTop: "0px",
                              position:'relative',
                              left:'205px',
                              width:'500px',
                              height:'40px',
                              color: "#8E8E8E",
                              border: "1px solid #BDBDBD",
                              
                            }}
                            >
                            <p>Each part in a bar represent a specific topic/keyword</p>


                            </div>
                          )}
              <br></br>
              <br></br>
        <Label>Select years</Label>
        <br></br>
        <div style={{width: '600px'}}>
        <Select ref={this.selectInputRef} isMulti isClearable
                placeholder="Select Option"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
              </div>
            
              <br></br>
              <Button outline active={active3} value="topic" color="primary"  onClick={this.compareTopic}>Compare</Button>
              <Button outline active={active4} value="key" color="primary"  onClick={this.clearValues}>Reset</Button>
              <br></br>
            
              <br></br>
       
        </>)
    }
  }
}

export default LAKStackedBarChart;