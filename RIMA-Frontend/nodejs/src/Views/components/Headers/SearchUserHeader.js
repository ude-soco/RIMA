import React from "react";
import { getItem } from "Services/utils/localStorage";
import { BASE_URL } from "../../../Services/constants";
import axios from "axios";
// reactstrap components
import { Container, Row, Col } from "reactstrap";
import swal from "@sweetalert/with-react";
import "../../../assets/scss/custom.css";

class SearchUserHeader extends React.Component {
  state = {
    query: "",
    results: [],
    activeSuggestion: 0,
    showSuggestions: false,
    popupVisible: false,
  };

  getInfo = () => {
    const TOKEN = getItem("accessToken");
    axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${this.state.query}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then(({ data }) => {
      this.setState({
        results: data,
        popupVisible: !this.state.popupVisible,
      });
    });
  };

  handleInputChange = (e) => {
    this.setState(
      {
        query: e.target.value,
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          if (this.state.query.length % 2 === 0) {
            this.getInfo();
          }
        }
      }
    );
  };

  modalDetail = () => {
    swal(
      <div>
        <h1>How to calculate similarity?</h1>
        <img src={require("../../../assets/img/similaritychart.png")} />
      </div>
    );
  };
  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundImage:
              "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container
            className="d-flex align-items-center"
            fluid
            style={{ position: "absolute", top: "70px" }}
          >
            <Row>
              <Col lg="12" md="10">
                <h1
                  style={{ marginTop: "150px" }}
                  className="display-2 text-white"
                >
                  The similarity between you and  &nbsp;{this.props.first_name + " " + this.props.last_name} is  {this.props.score} %
                </h1>
                <p
                  className="text-white mt-0 mb-5"
                  style={{ fontSize: "1.2rem" }}
                >
                  You can find the explanation about "how is the similarity calculated " below. 
                  {/* <span
                    onClick={this.modalDetail}
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    (how is this calculated?)
                  </span>*/}
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default SearchUserHeader;
