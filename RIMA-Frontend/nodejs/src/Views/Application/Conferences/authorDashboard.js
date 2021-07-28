import React from "react";
import RestAPI from "../../../Services/api";
// react plugin used to create google maps
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "Services/utils/errorHandler";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getItem } from "../../../Services/utils/localStorage";
import Select from "react-select";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import ReactWordcloud from "react-wordcloud";






// reactstrap components
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  CardBody,
  FormGroup,
  Form,
  Input,
  Col,
  Label,
} from "reactstrap";

const options = {

    colors: ["#90EE90", "#0BDA51", "#17B169", "#03C03C", "#00693E"],
    enableTooltip: true,
    deterministic: true,
    fontFamily: "Arial",
    fontSizes: [15, 45],
    fontStyle: "oblique",
    fontWeight: "normal",
    padding: 3,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };

class authorDashboard extends React.Component {
  state = {
    data: [],
    authorPublications: [],
    isLoding: false,
    modal: false,
    url: "",
    year: "",
    id: "",
    count: "10",
    items: [],
    length: 0,
    active1: true,
    active2: false,

    publicationsmodal: "",
    wordcloudmodal :"",

    currentAuthor:"",
    conferenceName:"",

    available: 
        [
            
            { label: 'aaecc', value: 'aaecc' },
            { label: 'eann', value: 'eann' },
            { label: 'lak', value: 'lak' },
            { label: 'edm', value: 'edm' },
            { label: 'aied', value: 'aied' },
            { label: 'camsap', value: 'camsap' },
            { label: 'ecctd', value: 'ecctd' },
        ],

   selectedOption :{ label: 'lak', value: 'lak' },
   numbers : [
    {
      value: "5",
      label: "5"
    },
    {
      value: "10",
      label: "10"
    }
  ],

  };

  
  componentDidMount() {
    this.setState({ isLoding: true });
    this.getConferenceAuthorsData(this.state.selectedOption.value)
  }

 

  handleChange = (selectedOption) => {
    this.setState({
        selectedOption : selectedOption,
        isLoding: true,
    });
    this.getConferenceAuthorsData(selectedOption.value);
  };

  //** GET ALL CONFERENCES **//
  getConferenceAuthorsData = (conference_name) => {
    RestAPI.getListConferenceAuthors(conference_name)
      .then((response) => {
        this.setState({
          isLoding: false,
          data: response.data,
        });

      })
      .catch((error) => {
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };


//** GET ALL CONFERENCE EVENTS **//
getListPublications = (conference_name,author_id) => {
  RestAPI.getListPublications(conference_name,author_id)
    .then((response) => {
      this.setState({
        isLoding: false,
        publicationsmodal: !this.state.publicationsmodal,
        authorPublications: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};

//** EXTRACT INTERESTS OF AN AUTHOR **//
ExtractAuthorInterests = (conference_name,author_id) => {
    this.setState({
        isLoding: false,
        wordcloudmodal: !this.state.wordcloudmodal,
        currentAuthor:author_id,
        conferenceName:conference_name
      });
      
    this.selectKeyword(conference_name,author_id)
};

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  publicationstoggle = (id) => {
    this.setState({
      publicationsmodal: !this.state.publicationsmodal,
    });
  };

  wordstoggle = (id) => {
    this.setState({
        wordcloudmodal: !this.state.wordcloudmodal,
    });

  };

  selectCountValue = (e) => {
    this.setState({
      count: e.value
    })
  }

  selectTopic = (conference_name,author_id) => {
    this.setState({ //isLoding: true,
      isLoaded: true })

    fetch(`${BASE_URL_CONFERENCE}` + "wordCloudAuthor/topic/" + this.state.count + "/" + conference_name+"/"+author_id)
      .then(response => response.json())
      .then(json => {
        this.setState({
          //isLoding: false,
          isLoaded: false,
          items: json.words,
          length: json.words.length,
          active1: true,
          active2: false
          
        })
      });

  }
  // BAB 08.06.2021 

  selectKeyword = (conference_name,author_id) => {
    console.log("count", this.state.count)
    console.log("conf", conference_name)
    console.log("id", author_id)
    fetch(`${BASE_URL_CONFERENCE}` + "wordCloudAuthor/keyword/" + this.state.count + "/" + conference_name+"/"+author_id)
        .then(response => response.json())
        .then(json => {
            this.setState({
            //isLoaded: true,
            items: json.words,
            length: json.words.length,
            active1: false,
            active2: true
            
            })
        });

  }
   


  render() {

    var {
      available,
      selectedOption,
      count,
      numbers,
    } = this.state;

    return (
      <>
        {/* Page content */}
        <Container  fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row style={{ alignItems: "center" }}>
                    <Col>
                      <h2 className="mb-0">
                       Conference Authors Dashboard
                      </h2>
                    </Col>
                  </Row>
                </CardHeader>
               
                <div style={{marginLeft: "40px"}}>
                      <Label>Select conference</Label>
                      <br></br>
                      <div style={{width: "200px"}}>
                        <Select
                        // BAB:BEGIN 08/06/2021 :: cover other conferences.
                          placeholder="Select conference"
                          options={available}
                          value={selectedOption}
                          onChange={this.handleChange}
                        // BAB:END 08/06/2021 :: cover other conferences.
                        />
                      </div>
                </div>
                <br/>
                <br/>
                <br/>
              </Card>

            </div>
          </Row>
        </Container>
        <br/>
        <Container  fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row style={{ alignItems: "center" }}>
                    <Col>
                      <h2 className="mb-0">
                        Authors List
                      </h2>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col style={{ alignItems: "right" }} >
                    <Link to={"/app/view-conference"}>
                      <Button color="primary" width = "30px">
                        Conferences Dashboard
                      </Button>
                    </Link> 
                    </Col>
                  </Row>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>

                  <thead className="thead-light">
                    <tr>

                     <th scope="col">semantic scholar id</th>
                      <th scope="col">name</th>
                      <th scope="col">semantic scholar url</th>
                      <th scope="col">No. of papers</th>
                      <th scope="col" width="5"></th>
                      <th scope="col" width="5"></th>

                    </tr>
                  </thead>

                  <tbody>
                    {/* START LOADER */}

                    {this.state.isLoding ? (
                      <tr className="text-center" style={{ padding: "20px" }}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                          />
                        </td>
                      </tr>
                    ) : this.state.data.length ? (
                      this.state.data.map((value, index) => (
                        <tr key={value.semantic_scholar_author_id}>
                          <td>{value.semantic_scholar_author_id}</td>
                          <td>{value.name}</td>
                          <td><a href ={ value.semantic_scholar_url}>{value.semantic_scholar_url}</a></td>
                          <td>{value.no_of_papers}</td>
                         
                          <td className="text-center">
                              <Button color="secondary" onClick={() => this.ExtractAuthorInterests(value.conference_name,value.semantic_scholar_author_id)} width = "50px">
                                Interests Cloud
                              </Button>    
                          </td>
                          <td className="text-center">
                              <Button color="secondary" onClick={() => this.getListPublications(value.conference_name,value.semantic_scholar_author_id)} width = "50px">
                                Publications in {value.conference_name} 
                              </Button>    
                          </td>
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Authors Found</strong>
                            </td>
                          </tr>
                        )}
                  </tbody>
                </Table>
              </Card>
               <div>
                <Modal isOpen={this.state.publicationsmodal} toggle={this.publicationstoggle} size="lg">
                  <ModalHeader toggle={this.publicationstoggle}>Conference Events</ModalHeader>
                  <ModalBody>

                  <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">conference event</th>
                      <th scope="col">title</th>
                      <th scope="col">semantic scholar url</th>
                      <th scope="col">paper doi</th>
                    </tr>
                  </thead>
                  

                  <tbody>
                    {/* START LOADER */}

                    {this.state.isLoding ? (
                      <tr className="text-center" style={{ padding: "20px" }}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                          />
                        </td>
                      </tr>
                    ) : this.state.authorPublications.length ? (
                      this.state.authorPublications.map((value, index) => (
                        <tr>
                          <td>{value.conference_event}</td>
                          <td>{value.title}</td>
                          <td><a href = {value.semantic_scholar_url}>{value.semantic_scholar_url}</a></td>
                          <td>{value.paper_doi}</td>                         
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Authors Found</strong>
                            </td>
                          </tr>
                        )}
                  </tbody>
                  </Table>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.publicationstoggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>



              <div>
                <Modal isOpen={this.state.wordcloudmodal} toggle={this.wordstoggle}  size="lg" >
                  <ModalHeader toggle={this.wordstoggle}>Author Topic/Keyword cloud</ModalHeader>
                  <ModalBody>
                        <Label>Select the number of keywords</Label>
                        <div style={{width: '200px'}}>
                        <Select
                            placeholder="Select number"
                            options={numbers} value={numbers.find(obj => obj.value === count)}
                            onChange={this.selectCountValue}
                        />
                        </div>
                        <br/>

                        <br/>                               
                        <Button color="primary" outline active={this.state.active2} onClick={() => this.selectKeyword(this.state.conferenceName,this.state.currentAuthor)}>Keyword</Button>
                        <Button color="primary" outline active={this.state.active1} onClick={() => this.selectTopic(this.state.conferenceName,this.state.currentAuthor)}>Extract and show Topics</Button>{' '}

                        <div>




                        {this.state.isLoaded ? (
                          <tr className="text-center" style={{ padding: "20px" }}>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "center" }}>
                              {" "}
                              <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={100}
                                width={100}
                              />
                            </td>
                          </tr>
                        ):(
                            <ReactWordcloud
                            id="tpc_cloud"
                            options={options}
                            words={this.state.items}
                        />
                        )
                        /*
                        : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No keywords Found</strong>
                            </td>
                          </tr>
                        )}
                        */ }
                        </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.wordstoggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default authorDashboard;
