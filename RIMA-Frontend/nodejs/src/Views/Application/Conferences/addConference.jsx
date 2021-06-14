import React, {useState} from "react";
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
import {handleServerErrors} from "Services/utils/errorHandler";
import RestAPI from "../../../Services/api";
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row,} from "reactstrap";
import {useHistory} from "react-router-dom";


export default function AddConference() {
  const [details, setDetails] = useState({
    confname: "",
    conference_url: "",
    year: "",
    platform: "",
    platfrom_url: "",
    
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
      confname: details.confname,
      conference_url: details.conference_url,
      year: details.year,
      platform: details.platform,
      platfrom_url: details.platfrom_url
    };

    setIsLoading(true);
   /*
    RestAPI.addPaper(data).then((response) => {
      toast.success("Paper Added!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setDetails({
        confname: "",
        conference_url: "",
        year: "",
        platform: "",
        platfrom_url:"",
      });
      setIsLoading(false);
      history.push("/app/view-paper")
    }).catch((error) => {
      setIsLoading(false);
      handleServerErrors(error, toast.error);
    });
    */
  }

  return (
    <>
    {/* Conference Data */}
    <Container  fluid>
      <Row>
        <Col className="order-xl-1" xl="12">
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">Add Conference</h3>
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
                    Conference information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-confname"
                          >
                            Conference Name Abbr.
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-confname"
                            name="confname"
                            value={details.confname}
                            onChange={handleChange}
                            placeholder=" Ex: Lak "
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-conference_url"
                          >
                            Conference Url
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-conference_url"
                            name="conference_url"
                            value={details.conference_url}
                            onChange={handleChange}
                            placeholder="Ex: https://dblp.org/db/conf/lak/index.html"
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
                            htmlFor="input-year"
                          >
                            Year
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-year"
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
                            htmlFor="input-platform"
                          >
                            platform
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-platform"
                            name="platform"
                            value={details.platform}
                            onChange={handleChange}
                            placeholder="Ex: dblp"
                            // className="form-control-alternative"
                            rows="10"
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
                              htmlFor="input-platform_url"
                            >
                              Platfrom Url
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-platform_url"
                              name="platform_url"
                              value={details.platform_url}
                              onChange={handleChange}
                              placeholder="Ex: https://dblp.org/"
                              type="text"
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
