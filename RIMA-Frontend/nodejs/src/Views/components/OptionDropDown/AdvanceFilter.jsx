import React, { useRef, useEffect } from "react";
import { KeywordRangeSlider } from "../../Application/Twitter/TweetAndPeople/TweetCard/KeywordWieghtRange";
import DrabableImage from "../../Application/Twitter/TweetAndPeople/TweetCard/DragableImage";
import DragableText from "../../Application/Twitter/TweetAndPeople/TweetCard/DragableText";
import backgroundImage from "../../../assets/img/backgrounds/circule1.png";
import backgroundDragableText from "../../../assets/img/backgrounds/tab1.png";
import {
  MdErrorOutline,
  MdHighlightOff,
} from "react-icons/md";
import classnames from "classnames";
import styled from "styled-components";
import Draggable from "react-draggable";
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Table,
  UncontrolledCollapse,
} from "reactstrap";
import DragableImage from "../../Application/Twitter/TweetAndPeople/TweetCard/DragableImage";
import {ImPencil} from "react-icons/all";

const DragableTextWrapper = styled.div`
  background-image: url("${backgroundDragableText}");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 400px;
`;
const CheckboxContainer = styled.div``;

const TabTwoWrapper = styled.div`
  max-height: 400px;
  overflow-y: scroll;
`;
const TabTwoDivOne = styled.div`
    width: auto;
`;
const TabTwoDivTwo = styled.div`
  position: relative;
  background-image: url("${backgroundImage}");
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  margin-top: 5px;
  background-size: contain;
`;

const PopOver = styled.div`
  .popover__title {
    font-size: 24px;
    line-height: 36px;
    text-decoration: none;
    color: rgb(228, 68, 68);
    text-align: center;
    padding: 15px 0;
  }
  React .popover__wrapper {
    position: relative;
    /* margin-top: 1.5rem; */
    margin: auto;
    display: inline-block;
  }
  .popover__content,
  .popover__content--more {
    opacity: 0;
    visibility: hidden;
    position: fixed;
    left: 58.5%;
    top: 30%;
    transform: translate(0, 10px);
    background-color: #ede7e7;
    border: 3px solid #bfbfbf;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    width: 500px;
  }
  .popover__content:before,
  .popover__content--more:before {
    position: absolute;
    z-index: -1;
    content: "";
    /* right: calc(50% - 165px); */
    top: -12px;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    /* border-color: transparent transparent #bfbfbf transparent; */
    transition-duration: 0.3s;
    transition-property: transform;
  }
  .popover__content--more {
    z-index: 10;
    opacity: 1;
    visibility: ${(props) => (props.more === true ? "visible" : "hidden")};
    transform: translate(0, -20px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
  }
  .popover__content {
    overflow: hidden;
    z-index: 10;
    opacity: 1;
    visibility: ${(props) => (props.state === true ? "visible" : "hidden")};

    transform: translate(0, -20px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
  }
  .popover__message {
    text-align: center;
  }
  .info__inner--div {
    background: #bfbfbf;
    padding: 10px 20px;
  }
  .color--green {
    color: green;
  }
  .color--blue {
    color: blue;
  }
`;
const StyledNav = styled(Nav)`
  background: #d0d3e3;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;

  && {
    .nav-link.active {
      background-color: white !important;
      border-radius: 20px;
      color: blue;
    }
  }
  .nav-link:hover {
    border-color: #d0d3e3;
    border-radius: 20px;
  }
  li {
    width: 50%;
  }
`;
const StyledTabContent = styled(TabContent)`
  margin-top: 20px;
  text-align: "center";
`;

const AdvanceFilter = (props) => {
  const [state, setstate] = React.useState(false);
  function crossHandler(params) {
    setstate(false);
  }
  const element = useRef(null);
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const centerOfCircle = {
    x: 164.5,
    y: 177,
  };
  const centerOfUserCircle = {
    x: -3,
    y: 94,
  };

  const onKeywordDrag = (event, dragData, tagId) => {
    const x = dragData.x;
    const y = dragData.y;

    let fx = x - centerOfCircle["x"];
    let fy = y - centerOfCircle["y"];
    let distance = Math.sqrt(fx * fx + fy * fy);
    props.setTagDistance(distance, tagId);
    props.sortTagsByDistance();
    props.sortTweetsByUserDistance();
  };

  const onUserDrag = (event, dragData, tagId, id_str) => {
    const x = dragData.x;
    const y = dragData.y;
    // console.log("onDragStop :", x, ",", y);

    let fx = x - centerOfUserCircle["x"];
    let fy = y - centerOfUserCircle["y"];
    let distance = Math.sqrt(fx * fx + fy * fy);
    props.setUserDistance(distance, id_str);
    props.sortTweetsByUserDistance();
  };

  const keywordCheckboxChangeHandler = (defaultChecked, tagId) => {
    // this.setState({
    //   defaultChecked: !this.state.defaultChecked,
    // });
    props.sortTweetsByUserDistance();

    // console.log(defaultChecked);
    // console.log("TagId: ", tagId);
  };
  const weightMultiplier = 37.5;

  const getDefaultPosition = () => {
    return {
      x: 0,
      y: -50,
    };
  }

  return (
    <PopOver state={state}>
      <div className="popover__wrapper">
        <ImPencil
          id="PopoverLegacy"
          className="cursor--pointer"
          style={{
            fontSize: "24px",
            color: "rgb(17, 137, 239)",
            marginRight: "8px"
          }}
          onClick={() => setstate(true)}
          />

          <Draggable 
            // defaultPosition={getDefaultPosition()}
            handle="strong"
          >
        <div className="popover__content">
        <strong style={{ display: 'block', width: '100%', cursor: 'move' }}>
          <MdHighlightOff
            style={{
              fontSize: "30px",
            }}
            className="cursor--pointer"
            onClick={crossHandler}
          />
          </strong>
          <div>
            <StyledNav tabs className="popover--tabs">
              <NavItem className="cursor--pointer--2">
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  Your Interests 
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  Your Interest weight
                </NavLink>
              </NavItem>
            </StyledNav>
            <StyledTabContent
              activeTab={activeTab}
              styled={{ marginTop: "20px" }}
            >
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <h4>
                      You can adjust the position of your interest based on its
                      importance. The closer to the center the more important the interest. 
                      
                    </h4>

                    <DragableTextWrapper>
                      {props.tags.map((tag) => {
                        // console.log('sssssssss ', tag.weight)
                        return (
                          <DragableText
                            key={tag.id}
                            tagId={tag.id}
                            text={tag.text}
                            color={tag.color}
                            weight={tag.weight}
                            centerOfCircle={centerOfCircle}
                            weightMultiplier={weightMultiplier}
                            onKeywordDrag={onKeywordDrag.bind(this)}
                            setTagDistance={props.setTagDistance}
                          />
                        );
                      })}
                    </DragableTextWrapper>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <TabTwoWrapper>
                      <TabTwoDivOne>
                        <h5>Keywords:</h5>
                        <CheckboxContainer>
                          {props.tagsWithoutWeight.map((tag) => {
                              return (
                                <KeywordRangeSlider
                                  key={tag.id}
                                  tagId={tag.id}
                                  text={tag.text}
                                  color={tag.color}
                                  weight={tag.weight}
                                  keywordCheckboxChangeHandler={
                                    keywordCheckboxChangeHandler
                                  }
                                  filterUsers={props.filterUsers}
                                  setWeightOfkeyword={props.setWeightOfkeyword.bind(
                                    this
                                  )}
                                />
                              );
                            })}
                        </CheckboxContainer>
                      </TabTwoDivOne>
                      {/* <TabTwoDivTwo> 
                        {props.filterUsers
                          ? props.filteredUsers.map((obj) => {
                              return (
                                <DragableImage
                                  color={obj.color}
                                  username={obj.user["name"]}
                                  imageURL={obj.user["profile_image_url_https"]}
                                  id_str={obj.user["id_str"]}
                                  centerOfCircle={centerOfUserCircle}
                                  onUserDrag={onUserDrag.bind(this)}
                                  setTagDistance={props.setTagDistance}
                                  weightMultiplier={weightMultiplier}
                                  weight={obj.weight}
                                  tweets={props.tweets}
                                  makeBorder={props.makeBorder}
                                />
                              );
                            })
                          : null}
                        <DrabableImage />
                      </TabTwoDivTwo> */}
                    </TabTwoWrapper>
                  </Col>
                </Row>
              </TabPane>
            </StyledTabContent>
          </div>
        </div>
      </Draggable>
      </div>
    </PopOver>
  );
};

export default AdvanceFilter;
