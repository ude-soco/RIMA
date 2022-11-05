import React, { Component} from "react";
import Select from 'react-select';
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
/* Chart code */
// Themes begin
// Themes end
import {
    Label,
    FormGroup,
    Form
  } from "reactstrap";
import ReactApexChart from "react-apexcharts";

class TopicBarPaperCount extends Component {
  constructor(props){
    super(props);
    
    this.selectValueYear=this.selectValueYear.bind(this)
    this.selectValue=this.selectValue.bind(this)
    this.selectKeys=this.selectKeys.bind(this)
    this.state = {
        selectVal:"",
        selectTopic:"",
        selectkey:"",
        doctitle:[],
        numdocs:"",
        topicOptions:[],
        items:[],
        weights:[],
        isLoaded:false,
        isEmpty:false,
        statelabel:"",
        bardata:[],
        series: [],
        options: {
          
        },
    };
        
    }
  
  
  componentDidMount(){
    //console.log("the json is ******************")    
  }
  selectKeys(e){
    this.setState({
      selectkey:e.value
    });
  }
  
  selectValue(e1){
    var {selectTopic,bardata,doctitle}=this.state;
    selectTopic=e1.value;
    console.log("the topic is:",selectTopic)
    console.log("the value is:",this.state.selectVal)
    fetch("http://127.0.0.1:8000/api/conferences/topicdetails/"+e1.value+"/"+this.state.selectVal)
    .then(response =>  response.json())
    .then(json => {
        
        this.setState({
          
          items:json.docs[0],  
          numdocs:json.docs[1],
          bardata:json.docs[2],  
          doctitle:json.docs[3],
          series: [{ name: "Docs", data: bardata }],
          options:{
            dataLabels: {
              enabled: true
            },
            grid: {
              xaxis: {
                show:false,
                lines: {
                  show: false
                },
                axisTicks:{
                  show:false
              },
              axisBorder:{
                  show:false
              }
              }
            },
            yaxis: {
              reversed: false,
              axisTicks: {
                show: false
              }
            },
            title:{
              text:"Top 10 Documents with document Frequency"
          },
          chart: {
            type: 'bar',
            height: 350,
            events: {
              dataPointSelection: function(event, chartContext, config) {
                var title=config.w.config.xaxis.categories[config.dataPointIndex]
                var url;
                fetch("http://127.0.0.1:8000/api/conferences/fetchpaper/"+title)
                .then(response =>  response.json())
                .then(json => {
                  url=json.url;
                  console.log(url)
                  window.open(url)
                })
              }
              }
            }
          ,
          
            plotOptions: {
                bar: {
                  horizontal: true,
                }
              },
              xaxis:{
                categories: doctitle
              },
             
            
            
          },
          isLoaded:true,
          
          
        })  ;          
           
    })
 

  }
 
  selectValueYear (e) {

    var {selectVal}=this.state;
    selectVal=e.value;
    console.log("the selected value:",selectVal)
    if(this.state.selectkey=='topic'){
    fetch("http://127.0.0.1:8000/api/conferences/populatetopics/"+e.value)
    .then(response =>  response.json())
    .then(json => {
        
        this.setState({
          isLoaded:true,
          selectVal:e.value,
          
          topicOptions:json.topicsdict,         
           
    });
  })
  selectVal=e.value;
}
else{
  fetch("http://127.0.0.1:8000/api/conferences/populatekeys/"+e.value)
    .then(response =>  response.json())
    .then(json => {
        
        this.setState({
          isLoaded:true,
          selectVal:e.value,
          
          topicOptions:json.topicsdict,         
           
    });
  })
  selectVal=e.value;
}
  }
  
  
 
      render() {
        
    
      
     
        var {selectVal,items,weights,isLoaded,options,series,topicOptions,selectTopic,selectkey,numdocs,statelabel,bardata,doctitle}=this.state;
       
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
       
        
        const topics=[
            {
              value:"topic",
              label:"topic"
            },
            {
              value:"keyword",
              label:"keyword"
            }
          ];
        
        
        //var{items,arr_keys,arr_vals}=this.state;
        


        
        
        
    if(isLoaded){   
        
          return (
            <>
   
            <Form role="form" method="POST" >
                        
                        
                        <FormGroup>
                        <h2>Top 10 Documents</h2>
                        <Select
                placeholder="Select option"
                options={topics}
                value={topics.find((obj) => obj.value === selectkey)}
                onChange={this.selectKeys}
              />
                        <Label>Select an Year of LAK Conference</Label>
                        <Select  placeholder="Select Option" options={yeardata}  value={yeardata.find(obj => obj.value === selectVal)} 
                         onChange={this.selectValueYear}
                         />
                        
                        <Label>Select a Topic from the Displayed list</Label>
                        <Select  id="tpc_dropdown" placeholder="Select Option" options={topicOptions} value={topicOptions.find(obj => obj.value === selectTopic)}
                        onChange={this.selectValue}
                         
                         />
                        
                        <br></br>
                        <Label>Total No.of documents containing {selectTopic} are: {numdocs}</Label>
                        <br></br>


                        
                       

     
                        
                        

                        
                        </FormGroup>
              </Form>
          
      <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={250} />
             
              
              
             
              
              
              
              
 
              
              
              
         
                
              
            </>
          );
          
      
          }   
        else{
            return(
               <>
                <Form role="form" method="POST" >
                        
                        
                        <FormGroup>
                        <h2>Top 10 Documents</h2>
                        <Select
                placeholder="Select option"
                options={topics}
                value={topics.find((obj) => obj.value === selectkey)}
                onChange={this.selectKeys}
              />
                        <Label>Select an Year of LAK Conference</Label>
                        <Select  placeholder="Select Option" options={yeardata}  value={yeardata.find(obj => obj.value === selectVal)} 
                         onChange={this.selectValueYear}
                         />
                        
                        <Label>Select a Topic from the Displayed list</Label>
                        <Select  id="tpc_dropdown" placeholder="Select Option" options={topicOptions} value={topicOptions.find(obj => obj.value === selectTopic)}
                        onChange={this.selectValue}
                         
                         />
                        
                        <br></br>
                        <Label>Total No.of documents containing {selectTopic} are: {numdocs}</Label>
                        <br></br>
                      </FormGroup>
              </Form>
          
               </> 
            )
        }
       
      }
}

export default TopicBarPaperCount;