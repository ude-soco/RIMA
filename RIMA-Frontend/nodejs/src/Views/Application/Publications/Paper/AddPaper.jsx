import React, {useState} from "react";
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
import {handleServerErrors} from "Services/utils/errorHandler";
import RestAPI from "../../../../Services/api";
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row,} from "reactstrap";
import Header from "../../../components/Headers/Header.js";
import {useHistory} from "react-router-dom";

export default function AddPaper() {
  const [details, setDetails] = useState({
    title: "",
    url: "",
    year: "",
    abstract: "",
    authors: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setDetails(() => ({
      ...details,
      [name]: value
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      title: details.title,
      url: details.url,
      year: details.year,
      authors: details.authors,
      abstract: details.abstract,
    };

    setIsLoading(true);

    RestAPI.addPaper(data).then((response) => {
      toast.success("Paper Added!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setDetails({
        title: "",
        url: "",
        year: "",
        authors: "",
        abstract: "",
      });
      setIsLoading(false);
      history.push("/app/view-paper")
    }).catch((error) => {
      setIsLoading(false);
      handleServerErrors(error, toast.error);
    });
  }

  return (
    <>
      {/* Page content */}
      <Container  fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Add Paper</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <div className="text-center" style={{padding: "20px"}}>
                    <Loader
                      type="Puff"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit} method="post">
                    <h6 className="heading-small text-muted mb-4">
                      Paper information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Title
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              name="title"
                              value={details.title}
                              onChange={handleChange}
                              placeholder="Title"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
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
                              value={details.url}
                              onChange={handleChange}
                              placeholder="https://www.zyz.com"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
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
                              value={details.year}
                              onChange={handleChange}
                              placeholder="Year"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Authors
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              name="authors"
                              value={details.authors}
                              onChange={handleChange}
                              placeholder="Authors"
                              type="text"
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
                              id="input-last-name"
                              name="abstract"
                              value={details.abstract}
                              onChange={handleChange}
                              placeholder="Abstract"
                              // className="form-control-alternative"
                              rows="10"
                              type="textarea"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4"/>
                    <div align="right">
                      <Button color="primary" type="submit">
                        Save
                      </Button>
                    </div>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
