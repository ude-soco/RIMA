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
    conferenceEvents: [],
    isLoding: false,
    modal: false,
    editmodal: false,
    deleteModal: false,
    deletePaperId: "",
    title: "",
    url: "",
    year: "",
    abstract: "",
    id: "",
    authors: "",
    show: false,
    selectyear: "",
    eventsmodal: "",

    available: 
        [
            { label: 'acisp', value: 'acisp' },
            { label: 'aaecc', value: 'aaecc' },
            { label: 'eann', value: 'eann' },
            { label: 'lak', value: 'lak' },
            { label: 'edm', value: 'edm' },
            { label: 'aied', value: 'aied' },
            { label: 'camsap', value: 'camsap' }],

   selectedOption :{ label: 'lak', value: 'lak' },


  };

  componentDidMount() {
    this.setState({ isLoding: true }, this.getConferenceAuthorsData());
  }

  selectYear = (e) => {
    this.setState({
      selectyear: e.value,
    });
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
getConferenceEventsData = (conference_name_abbr) => {
  console.log("TEST")
  console.log(conference_name_abbr)
  console.log("TEST")

  RestAPI.getListConfercneEvents(conference_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};

//** EXTRACT TRENDS OF AN EVENT **//
ExtractEventTrends = (conference_event_name_abbr) => {
  RestAPI.ExtractEventTrends(conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  eventstoggle = (id) => {
    this.setState({
      eventsmodal: !this.state.eventsmodal,
    });
  };






  render() {

    var {
      
      selectyear,
      available,
      selectedOption,

    
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
                        Choose a Conference
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
                        Conferences List
                      </h2>
                    </Col>
                  </Row>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>

                  <thead className="thead-light">
                    <tr>

                     <th scope="col">Conference</th>
                      <th scope="col">Conference URL</th>
                      <th scope="col">Platform</th>
                      <th scope="col">Platform URl</th>
                      <th scope="col">Number of Events</th>
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
                        <tr key={value.platform_name}>
                          <td>{value.conference_name_abbr}</td>
                          <td><a href ={ value.conference_url}>{value.conference_url}</a></td>
                          <td>{value.platform_name}</td>
                          <td><a href ={value.platform_url}>{value.platform_url}</a></td>
                          <td align = "center">{value.no_of_events}</td>
                         
                          
                          <td className="text-center">
                              <Button color="secondary" onClick={() => this.getConferenceEventsData(value.conference_name_abbr)} width = "50px">
                                Stored Events
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
                <Modal isOpen={this.state.eventsmodal} toggle={this.eventstoggle} size="lg">
                  <ModalHeader toggle={this.eventstoggle}>Conference Events</ModalHeader>
                  <ModalBody>

                  <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Conference</th>
                      <th scope="col">Conference Event</th>
                      {/*<th scope="col">URL</th>*/}
                      <th scope="col">Conference URL</th>
                      <th scope="col">No. Stored Papers</th>
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
                    ) : this.state.conferenceEvents.length ? (
                      this.state.conferenceEvents.map((value, index) => (
                        <tr>
                          <td>{value.conference_name_abbr}</td>
                          <td>{value.conference_event_name_abbr}</td>
                          <td><a href = {value.conference_event_url}>{value.conference_event_url}</a></td>
                          <td>{value.no_of_stored_papers}</td>                         
                          <td className="text-center" style={{ width: "5"}}>
                            <Button color="secondary" onClick={() => this.ExtractEventTrends(value.conference_event_name_abbr)} width = "50px">
                            Extract Trends
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
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.eventstoggle}>
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
