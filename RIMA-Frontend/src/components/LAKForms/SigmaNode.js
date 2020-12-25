import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Sigma,RelativeSize,RandomizeNodePositions } from "react-sigma";
import { Graph } from "react-d3-graph";
import {Label,Modal,ModalHeader,ModalBody,Button,ModalFooter,Badge,Row,Col,Form,FormGroup} from 'reactstrap';
import swal from "@sweetalert/with-react";

import SigmaLoader from "./Sigma/Loader";
import NodeShapes from "./Sigma/NodeShapes";

import userIcon from "./icons/user.png";
import tabletIcon from "./icons/tablet.png";
import ipadIcon from "./icons/ipad.png";
import Select from "react-select";
import "./styles.css";

class SigmaNode extends Component {
  
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.selectValue=this.selectValue.bind(this);
    this.selectyearValue=this.selectyearValue.bind(this);
    this.selectTopic=this.selectTopic.bind(this);
    this.selectKeyword=this.selectKeyword.bind(this);
    this.onClickNode=this.onClickNode.bind(this);
    this.toggle=this.toggle.bind(this);
    this.state = {
      filterNeighbours: "",
      keywords:[],
      selectVal:"",
      selectYear:"",
      url:"",
      imageTooltipOpen: false,
      count:"",
      key:"",
      papers:[],
      isLoaded:false,
      graphData:[],
      authors:[],
      titles:[],
      isModalLoader:false,
      noder:"",
      nodeval:"",
      active1:true,
      active2:false,
      
      myConfig : {
        nodeHighlightBehavior: true,
        linkHighlightBehavior:true,
        focusAnimationDuration:0.1,
        highlightOpacity:0.2,
        maxZoom:8,
        
        d3:{
            
            gravity:-60,
            linkLength:100
      
        },
        node: {
          color: "green",
          highlightStrokeColor: "green",
          svg:"https://image.flaticon.com/icons/png/512/16/16480.png",
          fontSize:10,
          fontWeight:'bold',
          fontColor:'#006400',
          highlightFontSize:14,
          highlightFontWeight:'bold'

        },
        link: {
          color:"#D4AF37",
          highlightColor: "green",
          type:'CURVE_SMOOTH',
          strokeWidth:2,

        },
        height:900,
        width:800
      },
    };

   

}
 onClickNode(nodeId) {
   // window.alert(`Clicked node ${nodeId}`);
    
    fetch("http://127.0.0.1:8000/api/interests/getallauthorslist/"+nodeId+"/"+this.state.nodeval
    +"/"+this.state.selectYear)
.then(response =>  response.json())
.then(json => {  

    //window.open(json.authors)   
    this.setState({
      url:json.authors[0],
      count:json.authors[1],
      papers:json.authors[2],
      authors:json.authors[3],
      titles:json.authors[4],
      isModalLoader:true,
      noder:nodeId
    })               
})

//window.open( url)
};
componentWillMount(){
  fetch("http://127.0.0.1:8000/api/interests/getalltopics/2011")
  .then(response =>  response.json())
  .then(json => {
      
      this.setState({
          
        
        keywords:json.keywords,

        
      
        
      })            
  });
  fetch("http://127.0.0.1:8000/api/interests/getalltitles/Learning/2011")
  .then(response =>  response.json())
  .then(json => {
   this.state.graphData=[];   
      this.setState({
        selectYear:"2011",
        selectVal:"Learning",
        key:"Learning",
        graphData:json.titles,
        isLoaded:true,
        nodeval:"Learning"
      
        
      })            
  });
    
}
selectyearValue(e){
    
   
        
        this.setState({
         
            
          selectYear:e.value,
         

          
        
          
        })
}
selectTopic(e){
  fetch("http://127.0.0.1:8000/api/interests/getalltopics/"+this.state.selectYear)
  .then(response =>  response.json())
  .then(json => {
      
      this.setState({
          
        active1:true,
        active2:false,
        selectVal:null,
        keywords:json.keywords,

        
      
        
      })            
  });
}
selectKeyword(e){
  fetch("http://127.0.0.1:8000/api/interests/getallkeywords/"+this.state.selectYear)
  .then(response =>  response.json())
  .then(json => {
      
      this.setState({
          
        active1:false,
        active2:true,
        selectVal:'',
        keywords:json.keywords,

        
      
        
      })            
  });
}
selectValue(e){
    
    fetch("http://127.0.0.1:8000/api/interests/getalltitles/"+e.value+"/"+this.state.selectYear)
    .then(response =>  response.json())
    .then(json => {
     this.state.graphData=[];   
        this.setState({
          selectVal:e.value,
          key:e.value,
          graphData:json.titles,
          isLoaded:true,
          nodeval:e.value
        
          
        })            
    });

}
toggle(id){
  this.setState({
    isModalLoader: !this.state.isModalLoader,
  });
}
modalDetail = () => {
  swal(
    <div>
      <p>Click on researcher to view the details</p>
      <br></br>
      <p>Hover on the researcher to highlight the connections</p>
    </div>
  );
};
handleToogle = (status) => {
  this.setState({ imageTooltipOpen: status });
  console.log(this.state.imageTooltipOpen)
};

  render() {
    var {keywords,authors,nodeval,graphData,selectVal,titles,isLoaded,count,
      isModalLoader,myConfig,selectYear,url,papers,noder,active1,active2}=this.state;
    const highlighter={
      '.highlight': {
        backgroundColor: 'yellow'
      }
    }
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
     
      <div id="graph_div" className="App" style={{'height':'1300px' ,'width':'800px',
      'backgroundColor':'#F0F8FF','marginLeft':'50px',
      'borderRadius':'2px'}}>
        <div style={{'marginLeft':'30px'}}>
        <h3>Researcher Collaboration Network</h3>
               <br></br>
               <p>This visualization displays the collaboration of researchers for the selected year with a specific Topic/Keyword</p>
        <Form>
          <FormGroup>
        <br></br>
        <Label>Select year</Label>

        <Select 
                placeholder="Select Option"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
              <br></br>
              <Label>Select Topic or Keyword</Label>
        <br></br>

        <Button outline color="primary" active={active1} onClick={this.selectTopic}>Topic</Button>
          <Button outline color="primary" active={active2} onClick={this.selectKeyword}>Keyword</Button>
          <br></br>
          <Label>Select a Topic or Keyword</Label>
        <Select 
                placeholder="Select Option"
                options={keywords}
                value={keywords.find((obj) => obj.value === selectVal)}
                onChange={this.selectValue}
              />
         <br></br>   
         </FormGroup>
         </Form>
  
        <div>
        
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
                              left:'10px',
                              width:'400px',
                              color: "#8E8E8E",
                              border: "1px solid #BDBDBD",
                              
                            }}
                            >
                            <li> Click on researcher to view the details</li>

<li>Hover on the researcher to highlight the connections</li>
                            </div>
                          )}
                          </div>
        <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={graphData}
        config={myConfig}
        
        onClickNode={this.onClickNode}
        />
        
        </div>
       
  
    
<Modal isOpen={isModalLoader} toggle={this.toggle} size="lg">
<div style={{'backgroundColor':'#F7F7F7','padding':'20px','border':'0.5px solid #F7F7F7'}}>  
    <ModalHeader toggle={this.toggle}><h3>Researchers Details for {noder}</h3></ModalHeader>
    </div>
        <ModalBody>
          
      <div id="authProf" style={{'border':'1px solid #F7F7F7','border-radius':'50px','padding':'20px'}}>  
      {/* <i  className="fas fa-question-circle text-blue"></i> */}
      
      
    <b>Total No. of published documents related to the topic </b>
    <i>{nodeval}:</i>
  <Badge color="info">{count}</Badge>
    <br></br>
    <Button  color="primary"><a href={url} target="_blank" style={{'color':'white'}}>Researcher Profile</a></Button>

    </div>  
     

      <div style={{'border':'0.5px solid #F7F7F7','border-radius':'50px','padding':'20px'}}> 
      <b>List of Papers</b>
      {papers.map((item,index) => {
          const author = authors[index];
          const title=titles[index];
          return <li style={{'whiteSpace': 'unset'}}><a href={item} target="_blank">{title}</a><br></br>
          <p><b>Researchers:</b> {author}</p>
          </li>;
        })}
        </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle} >Close</Button>{' '}
          
        </ModalFooter>
      </Modal>
      </div>
      
    );
    }
    else{
        return(<>
        <div style={{'height':'1300px' ,'width':'800px',
      'backgroundColor':'#F0F8FF','marginLeft':'50px',
      'borderRadius':'2px'}}>
        <div style={{'marginLeft':'30px'}}>
         <h3>Researcher Collaboration Network</h3>
               <br></br>
               <p>This visualization displays the collaboration of researchers for the selected year with a specific Topic/Keyword</p>
          <Form><FormGroup>
        <Label>Select year</Label>
        <br></br>
        <Select 
                placeholder="Select Option"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
              <br></br>
              <Label>Select Topic or Keyword</Label>
              <br></br>
        <Button outline color="primary" active={active1} onClick={this.selectTopic}>Topic</Button>
          <Button outline color="primary" active={active2} onClick={this.selectKeyword}>Keyword</Button>
          <br></br>
          <br></br>
          <Label>Select a Topic or Keyword</Label>
        <br></br>
        <Select 
                placeholder="Select Option"
                options={keywords}
                value={keywords.find((obj) => obj.value === selectVal)}
                onChange={this.selectValue}
              />
              </FormGroup></Form>
              </div>
       </div>
        </>)
    }
  }
}

export default SigmaNode;