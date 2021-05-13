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
  InputGroupText
} from "reactstrap";
import Loader from "react-loader-spinner";
import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import RestAPI from "../../../services/api";
import {handleServerErrors} from "../../../utils/errorHandler";
import {toast} from "react-toastify";


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
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("name", response.data.first_name);
          localStorage.setItem("lastname", response.data.last_name);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("mId", response.data.id);
          let {data: data_being_loaded} = response;
          if (data_being_loaded) {
            window.location.href = "/app/redirect";
          } else {
            history.push("/app/cloud-chart/" + response.data.id);
          }
        }
      })
      .catch((error) => {
        console.log("Login Api Response", error);
        setIsLoading(false)
        handleServerErrors(error, toast.error);
      });
  };


  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4"/>
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
              <Form role="form" onSubmit={handleSubmit} method="post">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
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
                      name="password"
                      value={details.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{marginTop: "32px"}}>
                    <Link style={{color: "black"}} to="/auth/register">
                      <medium>Create new account</medium>
                    </Link>
                  </div>
                  <div>
                    <Button className="my-4" color="primary" type="submit">
                      Sign in
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
