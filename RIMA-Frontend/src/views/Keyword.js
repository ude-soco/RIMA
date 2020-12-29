import React from "react";
// react plugin used to create google maps
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
import {handleServerErrors} from "utils/errorHandler";
import RestAPI from "../services/api";
import swal from "sweetalert";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

class Keyword extends React.Component {
  state = {
    keywordData: [],
    rows: [{name: "", weight: null, id: ""}],
    name: "",
    Weight: null,
    isLoding: false,
    isDisabled: true,
  };

  componentDidMount() {
    this.setState({isLoding: true}, () => {
      this.getKeywords();
    });
  }

  handleChangeWeight = (idx) => (e) => {
    const newKeywords = this.state.rows.map((data, sidx) => {
      if (idx !== sidx) return data;
      return {...data, weight: e.target.value};
    });
    this.setState({rows: newKeywords});
  };

  handleChangeKeyword = (idx) => (e) => {
    const newKeywords = this.state.rows.map((data, sidx) => {
      if (idx !== sidx) return data;
      return {...data, name: e.target.value};
    });
    this.setState({rows: newKeywords});
  };

  handleAddRow = () => {
    const item = {
      name: "",
      weight: null,
      id: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
  };

  handleRemoveSpecificRow = (id, idx) => () => {
    if (id) {
      this.deleteKeyword(id);
    } else {
      const rows = [...this.state.rows];
      rows.splice(idx, 1);
      this.setState({rows});
    }
  };

  getKeywords = () => {
    RestAPI.cloudChart()
      .then((response) => {
        let rowArray = [];
        if (response && response.data) {
          for (let i = 0; i < response.data.length; i++) {
            rowArray.push({
              name: response.data[i].keyword,
              weight: response.data[i].weight,
              id: response.data[i].id,
            });
          }
        }
        this.setState({
          isLoding: false,
          rows: rowArray,
        });
        var inputs = document.getElementsByTagName("Input");
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].id === "keyword") {
            inputs[i].disabled = true;
          }
        }
      })
      .catch((error) => {
        this.setState({isLoding: false});
        handleServerErrors(error, toast.error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    RestAPI.addKeyword(this.state.rows)
      .then((response) => {
        toast.success("Your Changes Has Been Successfully Updated!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        window.location.href = "/app/cloud-chart";
      })
      .catch((error) => {
        this.setState({isLoding: false});
        handleServerErrors(error, toast.error);
      });
  };

  handleBack = () => {
    window.location.href = "/app/cloud-chart/";
  }


  //** DELETE A Keyword **//
  deleteKeyword = (id) => {
    console.log(id);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to see this Keyword!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        RestAPI.deletekeyword(id)
          .then((response) => {
            swal("Poof! Your Keyword has been deleted!", {
              icon: "success",
            });
            const newvalue = this.state.keywordData.filter(
              (v, i) => v.id !== id
            );
            this.setState({
              keywordData: [...newvalue],
            });
            this.getKeywords();
          })
          .catch((error) => {
            swal("Oops! Something Went Wrong", {
              icon: "error",
            });
          });
      } else {
        swal("Your Keyword is safe!");
      }
    });
  };

  render() {
    return (
      <>
        <Header/>

        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="12">
                      <h3 className="mb-0">Manage Interest Page</h3>
                      <p className="bold">
                        In this page you can add your interests which were not
                        explored or remove the interests which you think they are
                        not related/correct. <br/>You can rate for your interest from 1-5 to
                        define the importance of your interests.</p>
                      <p><i>(P.S: only top 15 interests will be visualized in the word cloud.)</i>
                      </p>
                    </Col>
                  </Row>
                </CardHeader>
                {this.state.isLoding ? (
                  <div className="text-center" style={{padding: "20px"}}>
                    <Loader
                      type="Puff"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <CardBody>
                    <Form onSubmit={this.handleSubmit} method="post">
                      <div className="pl-lg-4">
                        {this.state.rows.map((item, idx) => (
                          <Row>
                            <Col lg="5">
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  id="keyword"
                                  name="name"
                                  required
                                  value={this.state.rows[idx].name}
                                  onChange={this.handleChangeKeyword(idx)}
                                  placeholder="Add Keyword"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="5">
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  name="weight"
                                  value={this.state.rows[idx].weight}
                                  onChange={this.handleChangeWeight(idx)}
                                  placeholder="Weight "
                                  type="Number"
                                  required
                                  min="1"
                                  max="5"
                                  step="0.1"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <Button
                                  className="btn btn-outline-danger btn-sm"
                                  style={{marginTop: "8px"}}
                                  onClick={this.handleRemoveSpecificRow(
                                    this.state.rows[idx].id,
                                    idx
                                  )}
                                >
                                  Remove
                                </Button>
                              </FormGroup>
                            </Col>
                          </Row>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          margin: " 0 53px 0 25px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div align="left">
                          <Button
                            style={{color: "green"}}
                            type="button"
                            onClick={this.handleAddRow}
                          >
                            Add
                          </Button>
                        </div>

                        <div style={{margin: "32px 0px 0px 0px"}}>
                          <div align="right">
                            <Button color="primary" type="submit">
                              {" "}
                              Save{" "}
                            </Button>

                            <Button color="secondary" onClick={this.handleBack}>
                              {" "}
                              Back{" "}
                            </Button>
                          </div>
                        </div>

                      </div>
                    </Form>
                  </CardBody>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Keyword;
