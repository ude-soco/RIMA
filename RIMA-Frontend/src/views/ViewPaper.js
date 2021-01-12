import React from "react";
import user from "../services/api";
// react plugin used to create google maps
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "utils/errorHandler";

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
import RestAPI from "../services/api";

// core components
import Header from "components/Headers/Header.js";

class ViewPaper extends React.Component {
  state = {
    data: [],
    paperDetail: [],
    isLoding: false,
    modal: false,
    editmodal: false,
    title: "",
    url: "",
    year: "",
    abstract: "",
    id: "",
    authors: "",
  };

  componentDidMount() {
    this.setState({ isLoding: true }, this.getPaperData());
  }

  //** GET ALL PAPERS **//
  getPaperData = () => {
    RestAPI.getListPaper()
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

  //** DELETE A PAPERS **//
  deleteEnquiry = (id) => {
    this.setState({ isLoding: true }, () => {
      RestAPI.deletePaper(id)
        .then((response) => {
          const newvalue = this.state.data.filter((v, i) => v.id !== id);
          this.setState({
            isLoding: false,
            data: [...newvalue],
          });

          toast.success("Delete Papaer !", {
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

  //** SHOW A PAPERS **//
  showEnquiry = (id) => {
    const paperdata = this.state.data.find((v, i) => {
      return v.id === id;
    });

    this.setState({
      modal: !this.state.modal,
      paperDetail: paperdata,
    });
  };

  //** SET VALUES IN EDIT PAPERS MODAL **//
  editEnquiry = (id) => {
    const paperdata = this.state.data.find((v, i) => {
      return v.id === id;
    });
    this.setState({
      editmodal: !this.state.editmodal,
      id: paperdata.id,
      title: paperdata.title,
      url: paperdata.url,
      year: paperdata.year,
      authors: paperdata.authors,
      abstract: paperdata.abstract,
    });
  };

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  //** UPDATE A PAPERS **//
  handleUpdate = () => {
    let data = {
      // id: this.state.id,
      title: this.state.title,
      url: this.state.url,
      year: this.state.year,
      abstract: this.state.abstract,
      authors: this.state.authors,
    };

    this.setState(
      {
        isLoding: true,
        editmodal: !this.state.editmodal,
      },
      () => {
        RestAPI.updatePaper(data, this.state.id)
          .then((response) => {
            this.setState({
              isloading: false,
            });

            this.getPaperData();

            toast.success("Update Papaer !", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          })
          .catch((error) => {
            handleServerErrors(error, toast.error);
          });
      }
    );
  };

  edittoggle = () => {
    this.setState({
      editmodal: !this.state.editmodal,
    });
  };

  handleChange = (e) => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }));
  };

  refreshPaper = () => {
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
  };

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">My Publications</h3>
                  <Button color="info" onClick={this.refreshPaper} style={{left:"1300px",}}>
                        Refresh Paper Data
                  </Button>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">URL</th>
                      <th scope="col">Year</th>
                      <th scope="col">Authors</th>
                      <th scope="col">Abstract</th>
                      <th scope="col"></th>
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
                        <tr key={value.id}>
                          <th scope="row">
                            {" "}
                            {`${(value.title || "").slice(0, 35)} ...`}{" "}
                          </th>
                          <td><a href={value.url} target="_blank">Link</a></td>                          <td>{value.year}</td>
                          <td>{`${(value.authors || "").slice(0, 35)} ...`}</td>
                          <td>
                            {" "}
                            {`${(value.abstract || "").slice(0, 35)} ...`}
                          </td>

                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu
                                className="dropdown-menu-arrow"
                                right
                              >
                                <DropdownItem
                                  onClick={() => this.showEnquiry(value.id)}
                                >
                                  View
                                </DropdownItem>

                                <Link to={`/app/edit-paper/${value.id}`}>
                                  <DropdownItem
                                  //  onClick={()=>this.editEnquiry(value.id)}
                                  >
                                    Edit
                                  </DropdownItem>
                                </Link>
                                <DropdownItem
                                  onClick={() => this.deleteEnquiry(value.id)}
                                >
                                  Remove
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center1" style={{ padding: "20px" }}>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {" "}
                          <strong> No Papers Found</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
              {/* //  Start Modal */}
              <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
                  <ModalHeader toggle={this.toggle}>Paper Detail</ModalHeader>
                  <ModalBody>
                    <strong>Title: </strong>{" "}
                    {this.state.paperDetail && this.state.paperDetail.title}
                    <br />
                    <br />
                    <strong>Year: </strong>{" "}
                    {this.state.paperDetail && this.state.paperDetail.year}
                    <br />
                    <br />
                    <strong>Authors: </strong>{" "}
                    {this.state.paperDetail && this.state.paperDetail.authors}
                    <br />
                    <br />
                    <strong>URL: </strong>{" "}
                    {this.state.paperDetail && this.state.paperDetail.url}
                    <br />
                    <br />
                    <strong>Abstract: </strong>
                    {this.state.paperDetail && this.state.paperDetail.abstract}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              {/* //  End Modal   */}

              {/* // Edit Start Modal */}
              <div>
                <Modal isOpen={this.state.editmodal} toggle={this.edittoggle}>
                  <ModalHeader toggle={this.edittoggle}>
                    <strong>Edit Paper information</strong>
                  </ModalHeader>
                  <ModalBody>
                    <CardBody>
                      <Form>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-username"
                                >
                                  Title
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // defaultValue="lucky.jesse"
                                  type="text"
                                  id="input-username"
                                  name="title"
                                  defaultValue={this.state.title}
                                  value={this.state.title}
                                  onChange={this.handleChange}
                                  placeholder="Title"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-email"
                                >
                                  URL
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-email"
                                  name="url"
                                  defaultValue={this.state.url}
                                  onChange={this.handleChange}
                                  placeholder="https://www.zyz.com"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  Year
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-first-name"
                                  name="year"
                                  defaultValue={this.state.year}
                                  onChange={this.handleChange}
                                  placeholder="Year"
                                  type="number"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Abstract
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // defaultValue="Jesse"
                                  id="input-last-name"
                                  name="abstract"
                                  defaultValue={this.state.abstract}
                                  onChange={this.handleChange}
                                  placeholder="Abstract"
                                  type="textarea"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <Button
                          color="primary"
                          type="button"
                          onClick={() => this.handleUpdate()}
                          // size="md"
                        >
                          Save
                        </Button>
                      </Form>
                    </CardBody>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </Modal>
              </div>
              {/* // Edit End Modal   */}
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default ViewPaper;
