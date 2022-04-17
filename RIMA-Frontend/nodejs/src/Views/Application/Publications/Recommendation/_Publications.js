import React, { Component } from "react";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";
// import SimplePopover from "./TweetAndPeople/TweetUtilities/SimplePopover";
import { handleServerErrors } from "Services/utils/errorHandler";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  DropdownMenu,
  Form,
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
// import PaperCard from "./PaperCard.js";
import RestAPI from "Services/api";
// import { COUNTRIES } from "./TweetAndPeople/countries";
// import SavedTweetCard from "./TweetAndPeople/TweetCard/SavedTweetCard";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { Spinner } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

// const suggestions = COUNTRIES.map((country) => {
//   return {
//     id: country,
//     text: country,
//   };
// });

const styles = {
  tabLink: {
    margin: "0 2rem",
    fontSize: "1.5rem",
    fontWeight: 500,
    border: 0,
    background: "transparent",
    opacity: 0.7,
    cursor: "pointer",
  },
  activeTabLink: {
    opacity: 1,
    color: "#5e72e4",
    borderBottom: "2px solid #525f7f",
  },
};

const FilterBox = styled(Container);
const InnerDropDownMenu = styled(DropdownMenu)`
  width: 300px !important;
  right: 0 !important;
  left: auto !important;
`;
export default class PublicationRecommendation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      papersLoaded: false,
      filteredUsers: [],
      tags: [],
      tagsWithoutWeight: [],
      lng: 150.644,
      lat: -34.397,
      radius: 10,

      place: {
        lat: -34.397,
        lng: 150.644,
        radius: 0,
      },
      //   suggestions: suggestions,
      papers: [],
      savedPapers: [],
      activeTab: "1",
      weight: 1,
      loading: false,
      //New States added by Yasmin for showing pie chart
      newPapers: [],
      isAdded: false,
      reloadPapers: true,
      percentage: {},
      isShowing: false,
      restTag: [],
    };
    this.handleSearchButtonClick = this.handleSearchButtonClick1.bind(this);
    // this.handleDeleteTag = this.handleDeleteTag.bind(this);
    // this.handleTagAddition = this.handleTagAddition.bind(this);
    // this.handleDragTag = this.handleDragTag.bind(this);
    // this.handleTagSettingsChange = this.handleTagSettingsChange.bind(this);

    this.changeHandler = this.changeHandler.bind(this);
  }

  // changed by yasmin
  generateRandomRGB() {
    var hexValues = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
    ];
    var newColor = "";
    // for (var i = 0; i < 6; i++) {
      // var x = Math.round(Math.random() * 14);
      // var y = hexValues[x];
      var o = Math.round, r = Math.random, s = 255;
      var newColor = 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';

      // newColor += y;
    // }
    //TODO: create a blocked list (like white and light yellow)
    //rgb(103, 245, 11)
    return newColor;
  }
  getTagColorByName(tagName) {
    const { tags } = this.state;
    const color = tags.find(tag => tag.text === tagName).color
    return color
  }
  getKeywords = () => {
    RestAPI.cloudChart()
      .then((response) => {
        let rowArray = [];
        let restOfTags = [];
        if (response && response.data) {
          for (let i = 0; i < response.data.length; i++) {
            if (i < 5) {
              rowArray.push({
                text: response.data[i].keyword,
                weight: response.data[i].weight,
                id: response.data[i].id,
                color: this.generateRandomRGB(),
                n_papers: "5",

              });
            } else {
              //added by yasmin for AutoComplete
              restOfTags.push({
                text: response.data[i].keyword,
                weight: response.data[i].weight,
                id: response.data[i].id,
                color: this.generateRandomRGB(),
                n_tweets: "5",
                lng: 150.644,
                lat: -34.397,
                radius: 10,

                language: "ANY",
                type: "ALL",
                retweets: 0,
                favorites: 0,

                place: {
                  lat: -34.397,
                  lng: 150.644,
                  radius: 0,
                },
              });
            }
          }
        }
        const finalRowArray = [...rowArray].sort((a, b) => b.weight - a.weight);
        this.setState({
          isLoding: false,
          tags: finalRowArray,
          restTag: restOfTags,
          tagsWithoutWeight: finalRowArray,
        });
        var inputs = document.getElementsByTagName("Input");
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].id === "keyword") {
            inputs[i].disabled = true;
          }
        }
      })
      .catch((error) => {
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };

  //   filterUsers = (e, tagId, action) => {
  //     if (this.state.tweetsLoaded === false) return;
  //     let filteredUsers = this.state.filteredUsers;
  //     if (action === "create") {
  //       this.state.tweets.map((tweet) => {
  //         if (tweet.tagId == tagId) {
  //           let found = false;
  //           let found1 = {};
  //           filteredUsers.map((user) => {
  //             if (user["id_str"] == tweet["user"]["id_str"]) {
  //               found = true;
  //             }
  //           });
  //           this.state.tags.map((tag) => {
  //             if (tag.id === tagId) {
  //               found1 = tag.weight;
  //             }
  //           });
  //           if (found1) tweet.weight = found1;
  //           if (found !== true) {
  //             let user = tweet;
  //             filteredUsers.push(user);
  //           }
  //         }
  //       });
  //       this.setState({ filteredUsers: filteredUsers });
  //     } else if (action === "delete") {
  //       let newFilteredUsers = [];
  //       filteredUsers.map((user) => {
  //         if (user["tagId"] !== tagId) {
  //           newFilteredUsers.push(user);
  //         }
  //       });
  //       this.setState({ filteredUsers: newFilteredUsers });
  //     }
  //   };

  changeHandler = (name, value) => {
    this.setState({
      [name]: value,
    });

    if (["lng", "radius", "lat"].includes(name)) {
      const place = {
        lat: parseFloat(this.state.lat),
        lng: parseFloat(this.state.lng),
        radius: parseFloat(this.state.radius) * 1000,
      };
      this.setState({
        place: place,
      });
    }
  };
  tabToggle = (tab) => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  };

  handleDeleteTag(i) {
    const { tags } = this.state;
    this.setState(
      (prevState) => ({
        ...prevState,
        reloadTweets: false,
        isAdded: true,
        isShowing: true,
        tags: tags.filter((tag, index) => index !== i),
        tagsWithoutWeight: tags.filter((tag, index) => index !== i),
      }),
      () => {
        this.handleSearchButtonClick1(true);
      }
    );
  }

  //   makeTagId(length) {
  //     var result = "";

  //     var characters =
  //       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //     var charactersLength = characters.length;
  //     for (var i = 0; i < length; i++) {
  //       result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //     }
  //     return result;
  //   }
  //Changed by Yasmin spread function and added handle click1
  handleTagAddition(tag) {
    this.setState({ isShowing: true });
    this.setState({ weight: this.state.weight - 0.5 });
    tag.id = this.makeTagId(10);
    tag.color = this.generateRandomRGB();
    tag.n_tweets = 5;
    tag.lat = this.state.lat;
    tag.lng = this.state.lng;
    tag.radius = this.state.radius;
    tag.language = this.state.language;
    tag.type = this.state.type;
    tag.retweets = this.state.retweets;
    tag.favorites = this.state.favorites;
    tag.weight = 1;
    tag.place = {
      lat: tag.lat,
      lng: tag.lng,
      radius: tag.radius,
    };
    this.setState(
      (prevState) => ({
        ...prevState,
        reloadTweets: false,
        tags: [...prevState.tags, tag],
        tagsWithoutWeight: [...prevState.tags, tag],
        isAdded: true,
      }),
      () => {
        this.handleSearchButtonClick1(true);
      }
    );
  }
  //   //
  //   setTagDistance(distance, tagId) {
  //     let tags = this.state.tags;
  //     tags.map((tag) => {
  //       if (tag.id == tagId) {
  //         tag["distance"] = distance;
  //       }
  //     });
  //     this.setState({ tags: tags });
  //   }

  //   setUserDistance(distance, id_str) {
  //     let users = this.state.filteredUsers;
  //     users.map((user) => {
  //       if (user.id_str == id_str) {
  //         user["distance"] = distance;
  //       }
  //     });
  //     this.setState({ filteredUsers: users });
  //   }

  //   makeBorder(newTweets) {
  //     this.setState({ tweets: newTweets });
  //   }

  //   sortTagsByDistance() {
  //     if (this.state.tweetsLoaded === false) return;
  //     let tags = this.state.tags;
  //     let newTags;
  //     newTags = [...tags].sort((a, b) => a.distance - b.distance);
  //     let tweets = this.state.tweets;
  //     let newTweets = [];
  //     newTags.map((tag) => {
  //       tweets.map((tweet) => {
  //         if (tag.id == tweet.tagId) {
  //           tweet["distance"] = tag.distance;
  //           newTweets.push(tweet);
  //         }
  //       });
  //     });
  //     const newTweets1 = [...newTweets].sort((a, b) => b.distance - a.distance);
  //     this.setState({ tweets: newTweets1, newTags: newTags });
  //   }

  //   sortTagsByWeight() {
  //     if (this.state.tweetsLoaded === false) return;
  //     let tags = this.state.tags;
  //     const newTags = [...tags].sort((a, b) => b.weight - a.weight);
  //     let tweets = this.state.tweets;
  //     let newTweets = [];
  //     newTags.map((tag) => {
  //       tweets.map((tweet) => {
  //         if (tag.id == tweet.tagId) {
  //           newTweets.push(tweet);
  //         }
  //       });
  //     });
  //     this.setState({ tweets: newTweets, tags: newTags });
  //   }

  //   sortTweetsByTagOrder() {
  //     if (this.state.tweetsLoaded === false) return;
  //     else {
  //       let tweets = this.state.tweets;
  //       let newTweets = [];
  //       this.state.tags.map((tag) => {
  //         tweets.map((tweet) => {
  //           if (tag.id == tweet.tagId) {
  //             newTweets.push(tweet);
  //           }
  //         });
  //       });

  //       this.setState({ tweets: newTweets });
  //     }
  //   }

  //   sortTweetsByUserDistance() {
  //     if (this.state.tweetsLoaded === false) return;
  //     let tweets = this.state.tweets;
  //     let users = this.state.filteredUsers;
  //     let sortedUsers = users.sort((a, b) => (a.distance > b.distance ? 1 : -1));
  //     tweets.map((tweet) => {
  //       sortedUsers.map((user) => {
  //         if (tweet.user.id_str == user.id_str) {
  //           tweet.user["distance"] = user.distance;
  //         }
  //       });
  //     });
  //     tweets.sort((a, b) => (a.user.distance < b.user.distance ? 1 : -1));
  //     this.setState({ tweets: tweets });
  //   }

  handleDragTag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
    this.sortTweetsByTagOrder();
  }

  //   extractUsersFromTweets(tweets) {
  //     let users = [];
  //     tweets.map((tweet) => {
  //       let user = tweet["user"];
  //       users.push(user);
  //     });
  //     this.setState({ users: users });
  //   }

  //   deleteTweet(tweet) {
  //     if (this.state.tweetsLoaded) {
  //       let tweets = this.state.tweets;
  //       let newTweets = [];
  //       tweets.map((t) => {
  //         if (t["id_str"] !== tweet["id_str"]) {
  //           newTweets.push(t);
  //         }
  //       });
  //       this.setState({ tweets: newTweets });
  //     }
  //   }

  //   deleteSavedTweet(tweet) {
  //     if (this.state.tweetsLoaded) {
  //       let tweets = this.state.savedTweets;
  //       const newTweets = tweets.filter((t) => t["id_str"] !== tweet["id_str"]);
  //       RestAPI.hideSavedTweet(tweet["id_str"])
  //         .then(() => {
  //           this.setState({ savedTweets: newTweets });
  //         })
  //         .catch((err) => console.error("Error Getting Tweets:", err));
  //     }
  //   }

  //   newSavedTweet(newTweet) {
  //     this.setState({ savedTweets: [...this.state.savedTweets, newTweet] });
  //   }

  // handleSearchButtonClick(e) {
  //   e.preventDefault();
  //   const { tags } = this.state;

  //   this.setState({
  //     loading: true,
  //     papers: [],
  //   });
  //   RestAPI.extractPapersFromTags(tags)
  //     .then((res) => {
  //       this.setState({ papers: res.data.data, papersLoaded: true });
  //       // this.extractUsersFromPapers(res.data.data);
  //     })
  //     .catch((err) => console.error("Error Getting Papers:", err));

  //   // RestAPI.getSavedTweets()
  //   //   .then((res) => {
  //   //     this.setState({ savedTweets: res.data });
  //   //   })
  //   //   .catch((err) => console.error("Error Getting Tweets:", err));
  // }

  //Changed by Yasmin
  handleSearchButtonClick1 = (newTagAdded = false) => {
    const { tags } = this.state;

    RestAPI.extractPapersFromTags(tags)
      .then((res) => {
        if (newTagAdded) {
          this.setState((prevState) => ({
            ...prevState,
            newPapers: res.data.data,
            PapersLoaded: true,
            isAdded: true,
            isShowing: true,
          }));
          //Jaleh
          // const perc = calculate_percentage(res.data.data);
          const perc = 45;

          this.setState((prevState) => ({
            ...prevState,
            percentage: perc,
            isShowing: false,
          }));
        } else {
          this.setState({
            loading: true,
            papers: [],
          });
          this.setState((prevState) => ({
            ...prevState,
            papers: res.data.data,
            papersLoaded: true,
          }));

          // this.extractUsersFromPapers(res.data.data);
        }
      })
      .catch((err) => console.error("Error Getting Papers:", err));

    // RestAPI.getSavedTweets()
    //   .then((res) => {
    //     this.setState({ savedTweets: res.data });
    //   })
    //   .catch((err) => console.error("Error Getting Tweets:", err));
  };
  //   //
  //   //changed by Yasmin, the other change weights are removed
  //   changeTagWeight2 = (index, newWeight) => {
  //     const newTags = [...this.state.tags];
  //     newTags[index].weight = newWeight;
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       tags: newTags,
  //       isAdded: true,
  //     }));
  //   };

  //   //Added by Yasmin
  //   handleApplyChanges = () => {
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       reloadTweets: true,
  //       loading: true,
  //       isAdded: false,
  //     }));
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       tweets: [...prevState.newTweets],
  //     }));
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //     }));
  //   };
  //   //
  handleTagSettingsChange(id, name, value) {
    let tag = this.state.tags.filter((tag) => tag.id === id)[0];
    tag[name] = value;

    if (["lng", "radius", "lat"].includes(name)) {
      const place = {
        lat: parseFloat(this.state.lat),
        lng: parseFloat(this.state.lng),
        radius: parseFloat(this.state.radius) * 1000,
      };
      tag.place = place;
    }

    let newTags = this.state.tags.map((t) => {
      if (t.id === id) {
        return tag;
      } else return t;
    });
    this.setState({
      tags: newTags,
    });
  }

  //Another ComponentDidMount is removed, this one is working fine
  componentDidMount() {
    this.getKeywords();
    this.handleSearchButtonClick1();
  }

  render() {
    const { papers } = this.state;

    // window.onload = function () {
    //   document.getElementById("search").click();
    // };

    return (
      <>
        <Card className="bg-gradient-default1 shadow">
          <CardHeader className="bg-transparent">
            <Row className="align-items-center">
              <Col>
                <h2>Publications Recommendation</h2>
              </Col>
            </Row>

            <div className="d-flex align-items-center">
              <fieldset className="paper-interests-box">
                <Row className="align-items-center">
                  <Col md={2}>
                    Your interests:
                  </Col>
                  <Col md={8}>
                    <TagSearch
                      tags={this.state.tags}
                      newTags={this.state.newTags}
                      delimiters={delimiters}
                    />
                  </Col>

                  <Col xs={1}>
                    What-if?
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
                  </Col>
                  <Col md={1}>
                    <Form
                      method="post"
                      onSubmit={this.handleSearchButtonClick1} // sometimes triggered automatically, sometimes not
                    >
                      <IconButton size="medium" id="search" type="submit">
                        <SearchTwoToneIcon size="medium"></SearchTwoToneIcon>
                      </IconButton>
                    </Form>
                  </Col>
                </Row>
              </fieldset>
            </div>

            <Container style={{ paddingTop: "20px" }} id="paper-card-container">
              {papers}
              {/* {papers.length > 0 ? (
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
                      color={this.getTagColorByName(paper.related_interest)}
                    />
                  );
                })
              ) : null} */}
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
};
