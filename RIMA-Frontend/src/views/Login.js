import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "utils/errorHandler";
import RestAPI from "../services/api";

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
  Col,
} from "reactstrap";
class Login extends React.Component {
  state = {
    email: "",
    password: "",
    isLoding: false,
    modal: false,
  };

  handleChange = (e) => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }));
  };

  _handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      email: this.state.email,
      password: this.state.password,
    };

    this.setState({ isLoding: true });
    RestAPI.userSignIn(data)
      .then((response) => {
        this.setState({ isLoding: false, modal: true });
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("name", response.data.first_name);
          localStorage.setItem("lastname", response.data.last_name);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("mId", response.data.id);
          if (response.data.data_being_loaded) {
            window.location.href = "/app/redirect";
          } else {
            this.props.history.push("/app/cloud-chart/" + response.data.id);
          }
        }
      })
      .catch((error) => {
        console.log("Login Api Response", error);
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4"></div>
              {this.state.isLoding ? (
                <div className="text-center">
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              ) : (
                <Form role="form" onSubmit={this._handleSubmit} method="post">
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit">
                      Sign in
                    </Button>
                  </div>
                </Form>
              )}
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6"></Col>
            <Col className="text-right" xs="6">
              <Link className="text-light" to="/auth/register">
                <small>Create new account</small>
              </Link>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
