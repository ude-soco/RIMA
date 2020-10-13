
import React from "react";
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'
import { handleServerErrors } from "utils/errorHandler";
import RestAPI from '../services/api';

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

class Register extends React.Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    twitterId: '',
    authorId: '',
    isLoding: false,
    passwordError: false
  };

  handleChange = e => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }))
  };

  _handleSubmit = e => {
    e.preventDefault();
    let data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      twitter_account_id: this.state.twitterId,
      author_id: this.state.authorId,
    };

    this.setState({ isLoding: true })

    RestAPI.userSignup(data).then(response => {
      this.setState({ isLoding: false })
      this.props.history.push("/auth/login");

    }
    ).catch(error => {
      this.setState({ isLoding: false })
      handleServerErrors(error, toast.error)

    }
    )

  };

  toogle = (status) => {
    this.setState({ tooltipOpen: status });
  };

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">

            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div>
              {
                this.state.isLoding ? <div className="text-center"><Loader type="Puff" color="#00BFFF" height={100} width={100} /></div>
                  :
                  <Form role="form" onSubmit={this._handleSubmit} method="post">
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="First Name" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-circle-08" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Last Name" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" type="email" autoComplete="new-email" name="email" value={this.state.email} onChange={this.handleChange} />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Password" type="password" autoComplete="new-password" name="password" value={this.state.password} onChange={this.handleChange} />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-hat-3" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Semantic Scholar Id" type="text" autoComplete="new-email" name="authorId" value={this.state.authorId} onChange={this.handleChange} />                       
                        <i
                            className="fa fa-question-circle"
                            style={{ lineHeight: "3" }}
                            onMouseOver={() => this.toogle(true)}
                            onMouseOut={() => this.toogle(false)}
                          />
                          {this.state.tooltipOpen && (
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                color: "#8E8E8E",
                                borderRadius: "8px",
                                padding: "6px",
                                fontSize: "11px",
                                border: "1px solid #ffffff",
                                position: "static",
                                marginTop: "8px",
                                right: "32px",
                              }}
                            >
                                Semantic Scholar ID used to get your paper information.<br />
                               You can find your ID at the end of URL in 'https://www.semanticscholar.org/'
                            </div>
                          )} 
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fab fa-twitter" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Twitter Account" type="text" autoComplete="new-email" name="twitterId" value={this.state.twitterId} onChange={this.handleChange} />
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
}

export default Register;
