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



class authorDashboard extends React.Component {
  state = {
    data: [],
    authorPublications: [],
    isLoding: false,
    modal: false,
    url: "",
    year: "",
    id: "",
    count: "",
 

    publicationsmodal: "",
    wordcloudmodal :"",

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
    this.setState({ isLoding: true }, this.getConferenceAuthorsData());
  }

 

  handleChange = (selectedOption) => {
    this.setState({
        selectedOption : selectedOption,
        isLoding: true,
    });
this.getConferenceAuthorsData(selectedOption.value);
};

  //** GET ALL CONFERENCES **//
  getConferenceAuthorsData = (conference_name_abbr) => {
    RestAPI.getListConferenceAuthors(conference_name_abbr)
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
getListPublications = (conference_name_abbr,author_id) => {
  RestAPI.getListPublications(conference_name_abbr,author_id)
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

//** EXTRACT TRENDS OF AN EVENT **//
ExtractAuthorTrends = (conference_event_name_abbr) => {
    this.setState({
        isLoding: false,
        wordcloudmodal: !this.state.wordcloudmodal,
      });
/*
  RestAPI.ExtractEventTrends(conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        wordcloudmodal: !this.state.wordcloudmodal,
        authorPublications: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
*/
};

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  eventstoggle = (id) => {
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
                              <Button color="secondary" onClick={() => this.ExtractAuthorTrends(value.conference_name_abbr)} width = "50px">
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
                <Modal isOpen={this.state.publicationsmodal} toggle={this.eventstoggle} size="lg">
                  <ModalHeader toggle={this.eventstoggle}>Conference Events</ModalHeader>
                  <ModalBody>

                  <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">title</th>
                      <th scope="col">conference event</th>
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
                          <td>{value.title}</td>
                          <td>{value.conference_event}</td>
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
                    <Button color="primary" onClick={this.eventstoggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>



              <div>
                <Modal isOpen={this.state.wordcloudmodal} toggle={this.wordstoggle} size="lg">
                  <ModalHeader toggle={this.wordstoggle}>Author Topic/Keyword cloud</ModalHeader>
                  <ModalBody>
                        <Label>Select the number of topics/keywords</Label>
                        <div style={{width: '200px'}}>
                        <Select
                            placeholder="Select number"
                            options={numbers} value={numbers.find(obj => obj.value === count)}
                            onChange={this.selectCountValue}
                        />
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
