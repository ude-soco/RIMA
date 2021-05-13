import React, {useState} from "react";
import RestAPI from "../../../services/api";
import {handleServerErrors} from "../../../utils/errorHandler";
import {toast} from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import Loader from "react-loader-spinner";
import {OverlayTrigger, Popover} from "react-bootstrap";
import {useHistory} from "react-router-dom";


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


  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">

          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div>
            {isLoading ?
              <div className="text-center">
                <Loader type="Puff" color="#00BFFF" height={100} width={100}/>
              </div>
              :
              <Form role="form" onSubmit={handleSubmit} method="post">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="First Name"
                      type="text"
                      name="firstName"
                      value={details.firstName}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Last Name"
                      type="text"
                      name="lastName"
                      value={details.lastName}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      value={details.email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      name="password"
                      value={details.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Semantic Scholar Id"
                      type="text"
                      autoComplete="new-email"
                      name="authorID"
                      value={details.authorID}
                      onChange={handleChange}
                    />
                    <OverlayTrigger trigger="click" placement="right" overlay={
                      <Popover style={{maxWidth: "300px"}}>
                        <Popover.Content>
                          Semantic Scholar ID is used to get your paper information.<br/>
                          You can find your ID at the end of URL in <a href='https://www.semanticscholar.org'
                                                                       target="_blank"> Semantic Scholar</a>
                        </Popover.Content>
                      </Popover>
                    }>
                      <i
                        className="fa fa-question-circle"
                        style={{
                          cursor: "pointer",
                          lineHeight: "3",
                          backgroundColor: "#fff",
                          paddingRight: "8px",
                          borderRadius: "0px 5px 5px 0px"
                        }}
                      />
                    </OverlayTrigger>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fab fa-twitter"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Twitter Account"
                      type="text"
                      autoComplete="new-email"
                      name="twitterID"
                      value={details.twitterID}
                      onChange={handleChange}
                    />

                    <OverlayTrigger trigger="click" placement="right" overlay={
                      <Popover style={{maxWidth: "300px"}}>
                        <Popover.Content>
                          Twitter username is used to get your tweets information.<br/>
                          Open<a href='https://twitter.com/' target="_blank"> Twitter</a> and get your username 'e.g.
                          @username'.
                        </Popover.Content>
                      </Popover>
                    }>
                      <i
                        className="fa fa-question-circle"
                        style={{
                          cursor: "pointer",
                          lineHeight: "3",
                          backgroundColor: "#fff",
                          paddingRight: "8px",
                          borderRadius: "0px 5px 5px 0px"
                        }}
                      />
                    </OverlayTrigger>
                  </InputGroup>
                </FormGroup>
                <Row className="my-4">
                  <Col xs="12">

                  </Col>
                </Row>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit">
                    Create account
                  </Button>
                </div>
              </Form>
            }
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
