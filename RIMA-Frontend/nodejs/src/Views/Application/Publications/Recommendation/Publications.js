import React, { Component } from "react";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";

import Button from '@material-ui/core/Button';
import { Typography } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import Seperator from './Components/Seperator';

// import SimplePopover from "./TweetAndPeople/TweetUtilities/SimplePopover";
import { handleServerErrors } from "Services/utils/errorHandler";
import {
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
import styled from "styled-components";
// import { calculate_percentage } from "../Twitter/TweetAndPeople/TweetUtilities/percentage";
import classnames from "classnames";
import TagSearch from "./TagSearch.js";
// import TwitterUsers from "./TweetAndPeople/TwitterUserCard/TwitterUsers.js";
import PaperCard from "./PaperCard.js";
import RestAPI from "Services/api";
// import { COUNTRIES } from "./TweetAndPeople/countries";
// import SavedTweetCard from "./TweetAndPeople/TweetCard/SavedTweetCard";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { Spinner } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";


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
      loading: false,

      //New States added by Yasmin for showing pie chart
      newPapers: [],
      isAdded: false,
      reloadPapers: true,
      percentage: {},
      isShowing: false,
      restTag: [],
      test: 'test'
    };
    this.getRecommendedPapers = this.getRecommendedPapers.bind(this);
    // this.handleDeleteTag = this.handleDeleteTag.bind(this);
    // this.handleTagAddition = this.handleTagAddition.bind(this);
    // this.handleDragTag = this.handleDragTag.bind(this);
    // this.handleTagSettingsChange = this.handleTagSettingsChange.bind(this);

    //1this.changeHandler = this.changeHandler.bind(this);
  }
  // changed by yasmin
  // generateRandomRGB() {
  //   var hexValues = [
  //     "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e",
  //   ];
  //   var newColor = "";
  //   var o = Math.round, r = Math.random, s = 255;
  //   var newColor = 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
  //   //TODO: create a blocked list (like white and light yellow)
  //   //rgb(103, 245, 11)
  //   return newColor;
  // }
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
      "7a9097"
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
        console.log(this.state.papers)
      })
      .catch((err) => console.error("Error Getting Papers:", err));

  };

  getTagColorByName(tagName) {
    const { tags } = this.state;
    const color = tags.find(tag => tag.text === tagName).color
    return color
  }
  componentDidMount() {
    this.getInterests().then(() => {
      this.getRecommendedPapers();
    })
  }
  render() {
    const { papers } = this.state;
    // return (
    //   <>
    //     <Card className="bg-gradient-default1 shadow">
    //       <CardHeader className="bg-transparent">
    //         <Row className="align-items-center">
    //           <Col>
    //             <h2>Publications Recommendation</h2>
    //           </Col>
    //         </Row>
    //       </CardHeader>
    //       <Container>
    //         <Row className="align-items-center">
    //           <Col md={11}>
    //             <fieldset className="paper-interests-box">

    //               <legend style={{ fontSize: "12px" }}>Your Interest:</legend>
    //               <Row className="align-items-center">
    //                 <Col md={10}>
    //                   <TagSearch
    //                     tags={this.state.tags}
    //                     newTags={this.state.newTags}
    //                   />
    //                 </Col>
    //               </Row>
    //             </fieldset>
    //           </Col>
    //           <Col md={1}>
    //             <div className="what-if-btn">What-if?</div>
    //             {/* <SimplePopover
    //                     handleSearchButtonClick1={this.handleSearchButtonClick1}
    //                     changeTagWeight={this.changeTagWeight2}
    //                     handleAddition={this.handleTagAddition}
    //                     handleDelete={this.handleDeleteTag}
    //                     interest={this.state.tags}
    //                     percentage={this.state.percentage}
    //                     isAdded={this.state.isAdded}
    //                     newTweets={this.state.newTweets}
    //                     oldTweets={this.state.tweets}
    //                     handleApplyChanges={this.handleApplyChanges}
    //                     isShowing={this.state.isShowing}
    //                     restOfTags={this.state.restTag}
    //                   /> */}
    //           </Col>
    //         </Row>
    //       </Container>
    //       <Container style={{ paddingTop: "20px" }} id="paper-card-container">
    //         {papers.length > 0 ? (
    //           papers.map((paper) => {
    //             if (this.state.loading === true) {
    //               this.setState({
    //                 loading: false,
    //               });
    //             }
    //             return (
    //               <PaperCard
    //                 key={paper.paperId}
    //                 paper={paper}
    //                 keyword_tags={this.state.tags}
    //                 reloadPapers={this.state.reloadPapers}

    //               />
    //             );
    //           })
    //         ) : null}
    //       </Container>
    //     </Card>
    //     <ScrollTopWrapper />
    //   </>)
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
                    fontSize: "12px",
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
                <div id="WhatifButton">
                  <Typography align="center" variant="caption" size="large">
                    What-if?
                  </Typography >
                  {/* <SimplePopover
                          handleSearchButtonClick1={this.handleSearchButtonClick1}
                          changeTagWeight={this.changeTagWeight2}
                          handleAddition={this.handleTagAddition}
                          handleDelete={this.handleDeleteTag}
                          interest={this.state.tags}
                          percentage={this.state.percentage}
                          isAdded={this.state.isAdded}
                          newTweets={this.state.newTweets}
                          oldTweets={this.state.tweets}
                          handleApplyChanges={this.handleApplyChanges}
                          isShowing={this.state.isShowing}
                          restOfTags={this.state.restTag}
                        /> */}
                </div>
              </Col>
            </div>
            <div className="d-flex align-items-center ml-4 mt-2">
              <Button variant="string">
                <CloudQueueIcon color="action" fontSize="small" />
                <Typography align="center" variant="subtitle2" className="ml-2">
                  Interests Sources
                </Typography >
              </Button>
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
              ) : null}
            </Container>
          </CardHeader>
        </Card>
        <ScrollTopWrapper />
      </>
    );
  }
}
const Tabs = () => {
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <div>
      <Nav tabs className="popover--tabs">
        <NavItem className="cursor--pointer--2">
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            keywords weight
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            keywords Tweets
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <h4>Tab 1 Contents</h4>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <h4>Tab Tab2</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
}




