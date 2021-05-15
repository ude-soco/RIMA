import React, {useState} from "react";
import RestAPI from "../../../services/api";
import {handleServerErrors} from "../../../utils/errorHandler";
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
import {Card, Button, Container, Form, OverlayTrigger, Popover, Col, Row} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";


export default function Register() {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    twitterID: '',
    authorID: '',
  })
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();


  const handleChange = (e) => {
    const {name, value} = e.target;
    setDetails(() => ({
      ...details,
      [name]: value
    }))
  };


  const handleSubmit = e => {
    e.preventDefault();
    let data = {
      first_name: details.firstName,
      last_name: details.lastName,
      email: details.email,
      password: details.password,
      twitter_account_id: details.twitterID,
      author_id: details.authorID,
    };

    setIsLoading(true);

    RestAPI.userSignup(data).then((res) => {
        setIsLoading(false);
        history.push("/auth/login");
      }
    ).catch(err => {
        setIsLoading(false);
        handleServerErrors(err, toast.error)
      }
    )
  };

  const customStyles = {
    gutterBottom: {
      marginBottom: 16
    },
    icon: {
      cursor: "pointer",
      marginLeft: 8
    },
    popover: {
      maxWidth: "300px"
    }
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <Card.Body className="px-lg-5 py-lg-5">
            {isLoading ?
              <div className="text-center">
                <Loader type="Puff" color="#00BFFF" height={100} width={100}/>
              </div>
              :
              <>
                <Container style={customStyles.gutterBottom}>
                  <Row className="justify-content-center">
                    <h1 className="text-muted">Sign-up</h1>
                  </Row>
                </Container>

                <Form onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md="6" controlId="formFirstName">
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter firstname"
                        name="firstName"
                        value={details.firstName}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="formLastName">
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter lastname"
                        name="lastName"
                        value={details.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form.Row>


                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={details.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      name="password"
                      value={details.password}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Row>
                    <Form.Group as={Col} md="6" controlId="formAuthorID">
                      <Form.Label>
                        Semantic Scholar ID
                        <OverlayTrigger delay={{hide: 1500}} placement="right" overlay={
                          <Popover style={customStyles.popover}>
                            <Popover.Content>
                              Semantic Scholar ID is used to get your paper information.<br/>
                              You can find your ID at the end of URL in <a href='https://www.semanticscholar.org'
                                                                           target="_blank"> Semantic Scholar</a>
                            </Popover.Content>
                          </Popover>
                        }>
                          <FontAwesomeIcon icon={faQuestionCircle} style={customStyles.icon}/>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter ID"
                        name="authorID"
                        value={details.authorID}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="formTwitterID">
                      <Form.Label>
                        Twitter ID
                        <OverlayTrigger delay={{hide: 1500}} placement="right" overlay={
                          <Popover style={customStyles.popover}>
                            <Popover.Content>
                              Twitter username is used to get your tweets information.<br/>
                              Open<a href='https://twitter.com/' target="_blank"> Twitter</a> and get your username
                              'e.g.
                              @username'.
                            </Popover.Content>
                          </Popover>
                        }>
                          <FontAwesomeIcon icon={faQuestionCircle} style={customStyles.icon}/>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter ID"
                        name="twitterID"
                        value={details.twitterID}
                        onChange={handleChange}
                      />

                    </Form.Group>
                  </Form.Row>

                  <Button variant="primary" type="submit" block style={customStyles.gutterBottom}>
                    Register
                  </Button>

                  <Container>
                    <Row className="justify-content-end">
                      <Link to="/auth/login">Already registered? Sign-in!</Link>
                    </Row>
                  </Container>
                </Form>
              </>
            }
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
