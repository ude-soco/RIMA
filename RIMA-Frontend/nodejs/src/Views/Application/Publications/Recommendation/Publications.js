import React, { Component } from "react";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import Seperator from "./Components/Seperator";
import BarChart from "./Components/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";
import {
  Button as ButtonMUI,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// import SimplePopover from "./Components/SimplePopover";
import { handleServerErrors } from "Services/utils/errorHandler";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  DropdownMenu,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
// import { calculate_percentage } from "../Twitter/TweetAndPeople/TweetUtilities/percentage";
import classnames from "classnames";
import TagSearch from "./TagSearch.js";
import PaperCard from "./PaperCard.js";
import RestAPI from "Services/api";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { Spinner } from "react-bootstrap";
import Slider from "./Components/Slider";
import { Rowing } from "@material-ui/icons";

function InterestControlPanel({ tags }) {
  let res = [];
  if (tags.length > 0) {
    tags.map((tag, index) =>
      res.push(
        <Slider
          key={tag.text}
          handleSearchButtonClick1="{props.handleSearchButtonClick1}"
          changeTagWeight="{props.changeTagWeight}"
          handleDelete="{props.handleDelete}"
          name={tag.text}
          color={tag.color}
          weight={tag.weight}
          index={index}
        />
      )
    );
  }
  return (
    <Grid container rowSpacing={1} columns={{ xs: 4, sm: 8, md: 12 }}>
      {res}
      <Grid item container xs={2} sm={3} md={4}>
        <Grid
          item
          container
          style={{
            backgroundColor: "#fff",
            maxHeight: "40px",
            borderRadius: "5px",
            border: "1px solid gray",
            justifyContent: "flex-end",
          }}
          className={`p-1 pt-0 Rounded text-white`}
        ></Grid>
      </Grid>
    </Grid>
  );
}
export default class PublicationRecommendation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      papersLoaded: false,
      filteredUsers: [],
      tags: [],
      tagsWithoutWeight: [],

      papers: [],
      savedPapers: [],
      weight: 1,
      loading: true,

      //New States added by Yasmin for showing pie chart
      newPapers: [],
      isAdded: false,
      reloadPapers: true,
      percentage: {},
      isShowing: false,
      restTag: [],
      modal: false,
      paperDetail: [],
      //New States added by Tannaz
      whatWordCloud: false,
      whatModal: false,
    };
    this.getRecommendedPapers = this.getRecommendedPapers.bind(this);
    // this.handleDeleteTag = this.handleDeleteTag.bind(this);
    // this.handleTagAddition = this.handleTagAddition.bind(this);
    // this.handleDragTag = this.handleDragTag.bind(this);
    // this.handleTagSettingsChange = this.handleTagSettingsChange.bind(this);

    //1this.changeHandler = this.changeHandler.bind(this);
  }

  //What if modal - Jaleh:
  showEnquiry = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  //What modal - Tannaz:
  showWhatEnquiry = () => {
    this.setState({
      whatWordCloud: true,
      whatModal: !this.state.whatModal,
    });
  };
  whatToggle = () => {
    this.setState({
      whatModal: !this.state.whatModal,
    });
  };
  //Hoda
  generateRandomRGB(indexcolor) {
    var hexValues = [
      "9B59B6",
      "3498DB",
      "48C9B0",
      "F5B041",
      "F05CBA",
      "EE5177",
      "51EED4",
      "EDA043",
      "c39797",
      "7a9097",
    ];

    return "#" + hexValues[indexcolor];
  }
  /**
   * Get Interest to show on the top of the page
   */
  getInterests = () => {
    return RestAPI.cloudChart()
      .then((response) => {
        let rowArray = [];
        if (response.data) {
          //Top 5
          for (let i = 0; i < 5; i++) {
            rowArray.push({
              text: response.data[i].keyword,
              weight: response.data[i].weight,
              id: response.data[i].id.toString(),
              color: this.generateRandomRGB(i),
            });
          }
        }
        this.setState({
          isLoding: true,
          tags: rowArray,
          tagsWithoutWeight: rowArray,
        });

        //???
        // var inputs = document.getElementsByTagName("Input");
        // for (var i = 0; i < inputs.length; i++) {
        //   if (inputs[i].id === "keyword") {
        //     inputs[i].disabled = true;
        //   }
        // }
      })
      .catch((error) => {
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };
  /**
   * Get Recommended Items
   */
  getRecommendedPapers = (newTagAdded = false) => {
    const { tags } = this.state;
    RestAPI.extractPapersFromTags(tags)
      .then((res) => {
        // if (newTagAdded) {
        //   this.setState((prevState) => ({
        //     ...prevState,
        //     newPapers: res.data.data,
        //     PapersLoaded: true,
        //     isAdded: true,
        //     isShowing: true,
        //   }));
        //   //Jaleh
        //   // const perc = calculate_percentage(res.data.data);
        //   const perc = 45;

        //   this.setState((prevState) => ({
        //     ...prevState,
        //     percentage: perc,
        //     isShowing: false,
        //   }));
        // } else {
        // this.setState({
        //   ,
        //   papers: [],
        // });
        this.setState((prevState) => ({
          ...prevState,
          loading: true,
          papers: res.data.data,
          papersLoaded: true,
        }));
      })
      .catch((err) => console.error("Error Getting Papers:", err));
  };

  getTagColorByName(tagName) {
    const { tags } = this.state;
    const color = tags.find((tag) => tag.text === tagName).color;
    return color;
  }
  componentDidMount() {
    this.getInterests().then(() => {
      this.getRecommendedPapers();
    });
  }
  render() {
    const { papers } = this.state;
    return (
      <>
        <Card className="bg-gradient-default1 shadow">
          <CardHeader className="bg-transparent">
            <Row className="align-items-center">
              <Col>
                <h2>Publications Recommendation</h2>
              </Col>
            </Row>
            {/* start Tannaz */}
            <div className="d-flex align-items-center mt-3">
              <fieldset className="paper-interests-box">
                <legend
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Your interests:
                </legend>
                <Row className="align-items-center">
                  <Col md={12}>
                    <TagSearch
                      tags={this.state.tags}
                      newTags={this.state.newTags}
                    />
                  </Col>
                </Row>
              </fieldset>
              <Col md={1}>
                <div id="WhatifButton" onClick={() => this.showEnquiry()}>
                  <Typography align="center" variant="caption" size="large">
                    What-if?
                  </Typography>
                </div>
                <BarChart />
                <div>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    size="lg"
                    className="modalCSS"
                  >
                    <ModalHeader toggle={this.toggle}>
                      <Seperator Label="What if?" Width="130" />
                    </ModalHeader>
                    <ModalBody>
                      <InterestControlPanel tags={this.state.tags} />
                    </ModalBody>

                    <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>
                        Apply changes
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </Col>
            </div>
            <div className="d-flex align-items-center ml-4 mt-2">
              <Button variant="string" onClick={() => this.showWhatEnquiry()}>
                <CloudQueueIcon color="action" fontSize="small" />
                <Typography align="center" variant="subtitle2" className="ml-2">
                  Interests Sources
                </Typography>
              </Button>
            </div>
            {/* What Modal */}
            <div>
              <Modal
                isOpen={this.state.whatModal}
                toggle={this.whatToggle}
                size="lg"
                className="modalCSS"
              >
                <ModalHeader toggle={this.whatToggle}>
                  <Seperator Label="What does the system know?" Width="300" />
                </ModalHeader>
                <ModalBody>
                  <Typography align="left" variant="subtitle2" className="ml-3">
                    Your Top Interests have been chosen from this wordcloud:
                  </Typography>
                  <CloudChart />
                </ModalBody>
                <ModalFooter>
                  {/* is deactivated until the interest profile part is done -> then redirect this button to interest profile */}
                  {/* <ButtonMUI variant="string" onClick={() => {this.setState({whatWordCloud: false})}}>
                        <SettingsIcon color="action" fontSize="small" /> 
                        <Typography align="center" variant="subtitle2">
                            How? 
                        </Typography >
                      </ButtonMUI> */}
                </ModalFooter>
              </Modal>
            </div>

            <Seperator Label="Publications" Width="130" />
            {/* end Tannaz */}
            <Container style={{ paddingTop: "20px" }} id="paper-card-container">
              {papers.length > 0 ? (
                papers.map((paper) => {
                  if (this.state.loading === true) {
                    this.setState({
                      loading: false,
                    });
                  }
                  return (
                    <PaperCard
                      key={paper.paperId}
                      paper={paper}
                      keyword_tags={this.state.tags}
                      reloadPapers={this.state.reloadPapers}
                    />
                  );
                })
              ) : this.state.loading ? (
                <div style={{ marginTop: "8px" }}>
                  <h1 className="d-flex justify-content-center align-items-center">
                    <Spinner
                      animation="border"
                      role="status"
                      size="lg"
                      style={{ margin: "4px 4px 3px 0px" }}
                    />
                    Loading Publications.. please wait
                  </h1>
                </div>
              ) : null}
            </Container>
          </CardHeader>
        </Card>
        <ScrollTopWrapper />
      </>
    );
  }
}
