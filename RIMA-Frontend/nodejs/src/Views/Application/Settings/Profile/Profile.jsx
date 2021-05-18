import React, {useEffect, useState} from "react";
import RestAPI from "../../../../Services/api";
import {handleServerErrors} from "../../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import Loader from "react-loader-spinner";

export default function Profile() {
  const [details, setDetails] = useState({
    data: [],
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    twitterAccountID: "",
    authorID: "",
    paperCount: "",
    tweetCount: "",
    keywordCount: "",
  })
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    RestAPI.getUserData().then((res) => {
      setDetails({
        ...details,
        id: res.data.id,
        firstName: res.data.first_name,
        email: res.data.email,
        lastName: res.data.last_name,
        twitterAccountID: res.data.twitter_account_id,
        authorID: res.data.author_id,
        paperCount: res.data.paper_count,
        tweetCount: res.data.tweet_count,
        keywordCount: res.data.keyword_count,
      });
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
      handleServerErrors(err, toast.error);
    })
  }, []);


  const handleChange = (e) => {
    const {name, value} = e.target;
    setDetails(() => ({
      ...details,
      [name]: value
    }))
  };


  const refreshData = () => {
    setIsLoading(true);
    RestAPI.refreshData().then(() => {
      toast.success("New data will be available in a few minutes!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }).catch(err => {
      setIsLoading(false);
      handleServerErrors(err, toast.error);
    })
  }


  const handleSubmit = e => {
    e.preventDefault();
    let data = {
      email: details.email,
      first_name: details.firstName,
      last_name: details.lastName,
      twitter_account_id: details.twitterAccountID,
      author_id: details.authorID,
    };
    setIsLoading(true);
    RestAPI.updateUserProfile(data, details.id).then(() => {
      toast.success("Update Profile Data !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
      handleServerErrors(err, toast.error);
    })
  }


  return (
    <>
      <Container className="mt--14" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between" />
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                          <span className="heading">
                            {details.data && details.paperCount}
                          </span>
                        <span className="description">Publications</span>
                      </div>

                      {/*

                      <div>
                        <span className="heading">
                          {details.data && details.keywordCount}
                        </span>
                        <span className="description">Keywords</span>
                      </div>

                      */}
                      <div>
                          <span className="heading">
                            {details.data && details.tweetCount}
                          </span>
                        <span className="description">Tweets</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{details.data && details.firstName + " " + details.lastName}</h3>

                  <hr className="my-4" />
                  <div>
                    <Button color="info" onClick={refreshData}>
                      Refresh Account Data
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <div className="text-center" style={{ padding: "20px" }}>
                    <Loader
                      type="Puff"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <>
                    <Form onSubmit={handleSubmit} method="post">
                      <h6 className="heading-small text-muted mb-4">
                        User information
                      </h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                              >
                                First name
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-first-name"
                                name="firstName"
                                value={details.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-last-name"
                              >
                                Last name
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-last-name"
                                name="lastName"
                                value={details.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
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
                                htmlFor="input-email"
                              >
                                Email address
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-email"
                                name="email"
                                value={details.email}
                                onChange={handleChange}
                                placeholder="jesse@example.com"
                                type="email"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className="my-4" />
                      {/* Address */}
                      <h6 className="heading-small text-muted mb-4">
                        Source information
                      </h6>
                      <div className="pl-lg-4">
                        <Row></Row>
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-city"
                              >
                                Semantic Scholar Id
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-city"
                                name="authorID"
                                value={details.authorID}
                                onChange={handleChange}
                                placeholder="Semantic Scholar Id"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Twitter Id
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-country"
                                name="twitterAccountID"
                                value={details.twitterAccountID}
                                onChange={handleChange}
                                placeholder="Twitter Account id"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className="my-4" />
                      <Button color="info" type="submit">
                        Save
                      </Button>
                    </Form>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
