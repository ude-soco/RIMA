import React from "react";
import RestAPI from "../../../Services/api";
// react plugin used to create google maps
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "Services/utils/errorHandler";
import { OverlayTrigger} from "react-bootstrap";
import { getItem } from "../../../Services/utils/localStorage";
import Select from "react-select";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';




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
} from "reactstrap";



class viewConference extends React.Component {
  state = {
    data: [],
    conferenceEvents: [],
    isLoding: false,
    modal: false,
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
  };

  componentDidMount() {
    this.setState({ isLoding: true }, this.getConferenceData());
  }

  selectYear = (e) => {
    this.setState({
      selectyear: e.value,
    });
  }


  //** GET ALL CONFERENCES **//
  getConferenceData = () => {
    RestAPI.getListConference()
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

//** COLLECT PAPERS FOR AN EVENT **//
collectEventPapers = (conference_name_abbr,conference_event_name_abbr) => {
  RestAPI.collectEventPapers(conference_name_abbr,conference_event_name_abbr)
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

//** EXTRACT TRENDS OF THE AUTHORS OF AN EVENT **//
ExtractAuthorsTrends = (conference_event_name_abbr) => {
  RestAPI.ExtractAuthorsTrends(conference_event_name_abbr)
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

  // Toggles the delete paper modal
  toggleDeletePaper = (id) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deletePaperId: id,
    })
  }

  //** DELETE A PAPER **//
  deleteEnquiry = (id) => {
    this.setState({
      isLoding: true,
      deleteModal: !this.state.deleteModal,
    }, () => {
      RestAPI.deletePaper(id)
        .then((response) => {
          const newvalue = this.state.data.filter((v, i) => v.id !== id);
          this.setState({
            isLoding: false,
            data: [...newvalue],
          });

          toast.success("Paper deleted!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding: false });
          handleServerErrors(error, toast.error);
        });
    });
  };

  
  

  eventstoggle = (id) => {
    this.setState({
      eventsmodal: !this.state.eventsmodal,
    });
  };


  handleChange = (e) => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }));
  };

  refreshPaper = () => {
    /*
    this.setState({ isLoding1: true }, () => {
      user
        .refreshPaper()
        .then((response) => {
          toast.success("New data will be available in a few minutes!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding1: false });
          handleServerErrors(error, toast.error);
        });
    });
  */
  };

  saveChanges = () => {
    /*
    this.setState({ isLoding1: true }, () => {
      user
        .refreshPaper()
        .then((response) => {
          toast.success("Data saved!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding1: false });
          handleServerErrors(error, toast.error);
        });
    });
    */
  };

  render() {

    var {
      
      selectyear,
    
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
                        <tr key={value.conference_name_abbr}>
                          <td>{value.conference_name_abbr}</td>
                          <td><a href ={ value.conference_url}>{value.conference_url}</a></td>
                          <td>{value.platform_name}</td>
                          <td><a href ={value.platform_url}>{value.platform_url}</a></td>
                          <td align = "center">{value.no_of_events}</td>
                          
                       
                          
                          <td className="text-center">
                          <Link to={"/app/view-author"}>
                              <Button color="secondary"  width = "50px">
                              {value.conference_name_abbr}'s Authors Dashboard
                              </Button>
                           </Link> 
                          </td>
                          <td className="text-center">
                              <Button color="secondary" onClick={() => this.getConferenceEventsData(value.conference_name_abbr)} width = "50px">
                              {value.conference_name_abbr}'s Stored Events
                              </Button>    
                          </td>

                          <td>
                          <div align="left">
                          <Tooltip title="delete conference">
                            <IconButton onClick={() => this.toggleDeletePaper(value.conference_name_abbr)}>
                              <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                            </IconButton>
                            </Tooltip>
                               
                          </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Conferences Found</strong>
                            </td>
                          </tr>
                        )}
                  </tbody>
                </Table>
              
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
                <div style={{ display: "flex", margin: " 0 53px 25px 25px", justifyContent: "space-between" }}>
                  <div style={{ margin: "32px 0px 0px 0px" }}>
                    <div align="right">
                      <Link to={"/app/add-conference"}>
                        <Button color="primary">
                          Add new Conference
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>


              {/* //  Start Modal */}
              <div>
                <Modal isOpen={this.state.deleteModal} toggle={() => this.toggleDeletePaper("")} size="lg">
                  <ModalHeader toggle={() => this.toggleDeletePaper("")}>
                    <h2>
                      Remove paper?
                    </h2>
                  </ModalHeader>
                  <ModalBody>
                    <h4>You are about to delete the publication from the list! Are you sure?</h4>
                  </ModalBody>
                  <ModalFooter>
                    <Button varian="link" onClick={() => this.toggleDeletePaper("")}>
                      Cancel
                    </Button>
                    <Button color="danger" onClick={() => this.deleteEnquiry(this.state.deletePaperId)}>
                      Delete
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              
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
                      <th scope="col" width="5" style={{textAlign: "center"}}>Options</th>
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
                            <Button color="secondary" onClick={() => this.collectEventPapers(value.conference_name_abbr, value.conference_event_name_abbr)} width = "50px">
                             Collect Publications
                            </Button>
                          </td >
                          <td className="text-center" style={{ width: "5"}}>
                            <Button color="secondary" onClick={() => this.ExtractEventTrends(value.conference_event_name_abbr)} width = "50px">
                            Extract Publications' Keywords/Topics
                            </Button>
                          </td>
                           <td className="text-center" style={{ width: "5"}}>
                            <Button color="secondary" onClick={() => this.ExtractAuthorsTrends(value.conference_event_name_abbr)} width = "50px">
                            Extract Authors' Keywords/Topics
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Events Found</strong>
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
              {/* //  End Modal   */}

              
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default viewConference;
