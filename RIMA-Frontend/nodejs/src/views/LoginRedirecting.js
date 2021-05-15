import React from "react";
import { toast } from "react-toastify";
import { handleServerErrors } from "utils/errorHandler";
import RestAPI from "../services/api";
// reactstrap components
import { Card, CardBody, Col, Row, Container } from "reactstrap";
import { getItem } from "utils/localStorage";
class LoginRedirecting extends React.Component {
  state = {
    intervalId: null,
  };
  componentDidMount() {
    let intervalId = setInterval(this.dataimport, 2000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  dataimport = () => {
    RestAPI.dataimportstatus()
      .then((response) => {
        console.log(response);
        let {data: data_being_loaded} = response;
        if (!data_being_loaded) {
          window.location.href = "/app/cloud-chart/" + getItem("mId");
        }
      })
      .catch((error) => {
        console.log("error", error);
        handleServerErrors(error, toast.error);
      });
  };

  render() {
    return (
      <>
        <Container>
          <Row>
            <Card
              className="bg-secondary shadow border-0"
              style={{ margin: "0 auto", width: "400px", marginTop: "100px" }}
            >
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-2">
                  <img
                    src={require("../assets/img/theme/loader.gif")}
                    style={{ maxWidth: "100%" }}
                  />
                  <h3
                    style={{
                      marginTop: "-50px",
                      fontWeight: "500",
                      color: "#172b4d",
                    }}
                  >
                    We are Fetching your data ...This could take a while!
                  </h3>
                </div>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </>
    );
  }
}

export default LoginRedirecting;
