import Loader from "react-loader-spinner";
import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import RestAPI from "../../../services/api";
import {handleServerErrors} from "../../../utils/errorHandler";
import {toast} from "react-toastify";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";


export default function Login() {
  const [details, setDetails] = useState({
    email: "",
    password: ""
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
      email: details.email,
      password: details.password,
    };
    setIsLoading(true)

    RestAPI.userSignIn(data)
      .then((res) => {
        setIsLoading(false);
        console.log(res.data)
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.token);
          localStorage.setItem("name", res.data.first_name);
          localStorage.setItem("lastname", res.data.last_name);
          localStorage.setItem("userId", res.data.id);
          localStorage.setItem("mId", res.data.id);
          const {data: {data_being_loaded}} = res;
          if (data_being_loaded) {
            window.location.href = "/app/redirect";
          } else {
            history.push("/app/cloud-chart/" + res.data.id);
          }
        }
      })
      .catch((error) => {
        console.log("Login Api Response", error);
        setIsLoading(false)
        handleServerErrors(error, toast.error);
      });
  };

  const customStyles = {
    gutterBottom: {
      marginBottom: 16
    }
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <Card.Body className="px-lg-5 py-lg-5">
            {isLoading ? (
              <div className="text-center">
                <Loader
                  type="Puff"
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <>
                <Container style={customStyles.gutterBottom}>
                  <Row className="justify-content-center">
                    <h1 className="text-muted">Sign-in</h1>
                  </Row>
                </Container>

                <Form onSubmit={handleSubmit}>
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
                      placeholder="Password"
                      name="password"
                      value={details.password}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" block style={customStyles.gutterBottom}>
                    Sign-in
                  </Button>

                  <Container>
                    <Row className="justify-content-end">
                      <Link to="/auth/register">Don't have an account? Sign-up</Link>
                    </Row>
                  </Container>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
