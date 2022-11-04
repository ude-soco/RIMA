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

import AddConference from "../Conferences/addConference";




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
    isLoading: false,
    modal: false,
    deleteConference: "",
    title: "",
    url: "",
    year: "",
    abstract: "",
    id: "",
    authors: "",
    show: false,
    selectyear: "",
    eventsmodal: "",
    add_conference_name_abbr : "",
    is_staff:"",

      
  };

  componentDidMount() {
    this.setState({ 
      isLoading: true,
      is_staff:localStorage.getItem('isStaff')
    }, this.getConferenceData());
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
          isLoading: false,
          data: response.data,
        });

      })
      .catch((error) => {
        this.setState({ isLoading: false });
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
        isLoading: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      handleServerErrors(error, toast.error);
    });

    
    console.log("current user");
    console.log(localStorage.getItem('isStaff'));
    console.log("current user");
};

//** COLLECT PAPERS FOR AN EVENT **//
collectEventPapers = (conference_name_abbr,conference_event_name_abbr) => {
  RestAPI.collectEventPapers(conference_name_abbr,conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoading: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      handleServerErrors(error, toast.error);
    });
};

//** EXTRACT TRENDS OF AN EVENT **//
ExtractEventTrends = (conference_event_name_abbr) => {
  RestAPI.ExtractEventTrends(conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoading: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      handleServerErrors(error, toast.error);
    });
};

//** EXTRACT TRENDS OF THE AUTHORS OF AN EVENT **//
ExtractAuthorsTrends = (conference_event_name_abbr) => {
  RestAPI.ExtractAuthorsTrends(conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoading: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      handleServerErrors(error, toast.error);
    });
};

  // Toggles the delete Conference modal
  toggleDeleteConference = (conference_name_abbr) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deleteConference: conference_name_abbr,
    })
  }

  //** DELETE A PAPER **//
  deleteEnquiry = (conference_name_abbr) => {
    this.setState({
      isLoading: true,
      deleteModal: !this.state.deleteModal,
    }, () => {
      RestAPI.deleteConference(conference_name_abbr)
        .then((response) => {
          const newvalue = this.state.data.filter((v, i) => v.conference_name_abbr !== conference_name_abbr);
          this.setState({
            isLoading: false,
             data: [...newvalue],
          });

          toast.success("Conference deleted!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          handleServerErrors(error, toast.error);
        });
       // this.getConferenceData()

    });

  };

  
  

  eventstoggle = (id) => {
    this.setState({
      eventsmodal: !this.state.eventsmodal,
    });
  };


  handleChange = (e) => {
    this.setState({ 
      add_conference_name_abbr: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      platform_name: "dblp",
      platform_url: "https://dblp.org/",
      conferences: [
        {
          conference_name_abbr: this.state.add_conference_name_abbr,
          conference_url: "https://dblp.org/db/conf/"+this.state.add_conference_name_abbr +"/index.html	",
        }, 
    ],    
    };
     RestAPI.addConference (data).then((response) => {
       toast.success("Conference Event Added!", {
         position: toast.POSITION.TOP_RIGHT,
         autoClose: 2000,
       });
       this.setState({
       isLoading: true , 
     });
     this.getConferenceData()
     
     });
     
   }

  render() {

    console.log(this.state.conferenceEvents)

    var {
      
      selectyear,
    
    } = this.state;

    return (
      <>
       <Container  fluid>
      <Row>
        <Col className="order-xl-1" xl="12">
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">Add Conference</h3>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
                <Form onSubmit={this.handleSubmit} method="post">
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-conference_name_abbr"
                          >
                            Conference Name Abbr.
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-conference_name_abbr"
                            name="conference_name_abbr"
                            value={this.state.add_conference_name_abbr}
                            onChange={this.handleChange}
                            placeholder=" Ex.: lak "
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    </div>
                    <div align="right">
                    <Button color="primary" type="submit">
                      Save
                    </Button>
                  </div>
                      </Form>
            </CardBody>
          </Card>
        </Col>
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
                      <th scope="col" width="5"></th>
                      {this.state.is_staff == "true" ? (
                      <th scope="col" width="5"></th>) : (<></>)}
                    </tr>
                  </thead>

                  <tbody>
                    {/* START LOADER */}
                    {this.state.isLoading ? (
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
                          <Link to={{
                              pathname: "/app/view-author",
                              state: {
                                  current_conference: value.conference_name_abbr
                              }
                          }}>
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
                          
                          {this.state.is_staff == "true" ? (
                          <td>
                          <div align="left">
                          <Tooltip title="delete conference">
                            <IconButton onClick={() => this.toggleDeleteConference(value.conference_name_abbr)}>
                              <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                            </IconButton>
                            </Tooltip>   
                          </div>
                          </td>
                          ):(<></>)}
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
              
              
              </Card>


              {/* //  Start Modal */}
              <div>
                <Modal isOpen={this.state.deleteModal} toggle={() => this.toggleDeleteConference("")} size="lg">
                  <ModalHeader toggle={() => this.toggleDeleteConference("")}>
                    <h2>
                      Remove Conference?
                    </h2>
                  </ModalHeader>
                  <ModalBody>
                    <h4>You are about to delete the conference from the list! Are you sure?</h4>
                  </ModalBody>
                  <ModalFooter>
                    <Button varian="link" onClick={() => this.toggleDeleteConference("")}>
                      Cancel
                    </Button>
                    <Button color="danger" onClick={() => this.deleteEnquiry(this.state.deleteConference)}>
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

                      {this.state.is_staff == "true" ? (
                        <>
                      <th scope="col" width="5"></th>
                      <th scope="col" width="5" style={{textAlign: "center"}}>Options</th>
                      <th scope="col" width="5"></th>
                      </>
                      ):(<></>)}
                  
                    </tr>
                  </thead>
                  

                  <tbody>
                    {/* START LOADER */}

                    {this.state.isLoading ? (
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
                    ) : Boolean(this.state.conferenceEvents.length) ? (
                      this.state.conferenceEvents.map((value, index) => (
                        <tr>
                          <td>{value.conference_name_abbr}</td>
                          <td>{value.conference_event_name_abbr}</td>
                          <td><a href = {value.conference_event_url}>{value.conference_event_url}</a></td>
                          <td>{value.no_of_stored_papers}</td>  
                          {/*{this.state.is_staff == "true" ? (*/}
                            <>
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
                        </>
                          {/*):(*/}
                          {/*  <>*/}
                          {/*  </>*/}
                          {/*)}                       */}

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
