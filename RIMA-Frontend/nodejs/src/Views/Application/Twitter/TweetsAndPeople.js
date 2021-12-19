import React, { Component } from "react";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";
import SimplePopover from "./TweetAndPeople/TweetUtilities/SimplePopover";
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
import { calculate_percentage } from "../Twitter/TweetAndPeople/TweetUtilities/percentage";
import classnames from "classnames";
import TagSearch from "./TweetAndPeople/TagSearch.js";
import TwitterUsers from "./TweetAndPeople/TwitterUserCard/TwitterUsers.js";
import TweetCard from "./TweetAndPeople/TweetCard/TweetCard.js";
import RestAPI from "Services/api";
import { COUNTRIES } from "./TweetAndPeople/countries";
import SavedTweetCard from "./TweetAndPeople/TweetCard/SavedTweetCard";
import ScrollTopWrapper from "../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { Spinner } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const suggestions = COUNTRIES.map((country) => {
  return {
    id: country,
    text: country,
  };
});
const delimiters = [KeyCodes.comma, KeyCodes.enter];

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

const FilterBox = styled(Container)``;
const InnerDropDownMenu = styled(DropdownMenu)`
  width: 300px !important;
  right: 0 !important;
  left: auto !important;
`;
export default class TweetsAndPeople extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetsLoaded: false,
      filteredUsers: [],
      tags: [],
      tagsWithoutWeight: [],
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
      suggestions: suggestions,
      tweets: [],
      savedTweets: [],
      users: [],
      activeTab: "1",
      weight: 1,
      loading: false,
      //New States added by Yasmin for showing pie chart
      newTweets: [],
      isAdded: false,
      reloadTweets: true,
      percentage: {},
      isShowing: false,
      restTag: [],
    };
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleTagAddition = this.handleTagAddition.bind(this);
    this.handleDragTag = this.handleDragTag.bind(this);
    this.handleTagSettingsChange = this.handleTagSettingsChange.bind(this);

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
    var newColor = "#";
    for (var i = 0; i < 6; i++) {
      var x = Math.round(Math.random() * 14);
      var y = hexValues[x];
      newColor += y;
    }
    return newColor;
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

  filterUsers = (e, tagId, action) => {
    if (this.state.tweetsLoaded === false) return;
    let filteredUsers = this.state.filteredUsers;
    if (action === "create") {
      this.state.tweets.map((tweet) => {
        if (tweet.tagId == tagId) {
          let found = false;
          let found1 = {};
          filteredUsers.map((user) => {
            if (user["id_str"] == tweet["user"]["id_str"]) {
              found = true;
            }
          });
          this.state.tags.map((tag) => {
            if (tag.id === tagId) {
              found1 = tag.weight;
            }
          });
          if (found1) tweet.weight = found1;
          if (found !== true) {
            let user = tweet;
            filteredUsers.push(user);
          }
        }
      });
      this.setState({ filteredUsers: filteredUsers });
    } else if (action === "delete") {
      let newFilteredUsers = [];
      filteredUsers.map((user) => {
        if (user["tagId"] !== tagId) {
          newFilteredUsers.push(user);
        }
      });
      this.setState({ filteredUsers: newFilteredUsers });
    }
  };

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

  makeTagId(length) {
    var result = "";

    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
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
  //
  setTagDistance(distance, tagId) {
    let tags = this.state.tags;
    tags.map((tag) => {
      if (tag.id == tagId) {
        tag["distance"] = distance;
      }
    });
    this.setState({ tags: tags });
  }

  setUserDistance(distance, id_str) {
    let users = this.state.filteredUsers;
    users.map((user) => {
      if (user.id_str == id_str) {
        user["distance"] = distance;
      }
    });
    this.setState({ filteredUsers: users });
  }

  makeBorder(newTweets) {
    this.setState({ tweets: newTweets });
  }

  sortTagsByDistance() {
    if (this.state.tweetsLoaded === false) return;
    let tags = this.state.tags;
    let newTags;
    newTags = [...tags].sort((a, b) => a.distance - b.distance);
    let tweets = this.state.tweets;
    let newTweets = [];
    newTags.map((tag) => {
      tweets.map((tweet) => {
        if (tag.id == tweet.tagId) {
          tweet["distance"] = tag.distance;
          newTweets.push(tweet);
        }
      });
    });
    const newTweets1 = [...newTweets].sort((a, b) => b.distance - a.distance);
    this.setState({ tweets: newTweets1, newTags: newTags });
  }

  sortTagsByWeight() {
    if (this.state.tweetsLoaded === false) return;
    let tags = this.state.tags;
    const newTags = [...tags].sort((a, b) => b.weight - a.weight);
    let tweets = this.state.tweets;
    let newTweets = [];
    newTags.map((tag) => {
      tweets.map((tweet) => {
        if (tag.id == tweet.tagId) {
          newTweets.push(tweet);
        }
      });
    });
    this.setState({ tweets: newTweets, tags: newTags });
  }

  sortTweetsByTagOrder() {
    if (this.state.tweetsLoaded === false) return;
    else {
      let tweets = this.state.tweets;
      let newTweets = [];
      this.state.tags.map((tag) => {
        tweets.map((tweet) => {
          if (tag.id == tweet.tagId) {
            newTweets.push(tweet);
          }
        });
      });

      this.setState({ tweets: newTweets });
    }
  }

  sortTweetsByUserDistance() {
    if (this.state.tweetsLoaded === false) return;
    let tweets = this.state.tweets;
    let users = this.state.filteredUsers;
    let sortedUsers = users.sort((a, b) => (a.distance > b.distance ? 1 : -1));
    tweets.map((tweet) => {
      sortedUsers.map((user) => {
        if (tweet.user.id_str == user.id_str) {
          tweet.user["distance"] = user.distance;
        }
      });
    });
    tweets.sort((a, b) => (a.user.distance < b.user.distance ? 1 : -1));
    this.setState({ tweets: tweets });
  }

  handleDragTag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
    this.sortTweetsByTagOrder();
  }

  extractUsersFromTweets(tweets) {
    let users = [];
    tweets.map((tweet) => {
      let user = tweet["user"];
      users.push(user);
    });
    this.setState({ users: users });
  }

  deleteTweet(tweet) {
    if (this.state.tweetsLoaded) {
      let tweets = this.state.tweets;
      let newTweets = [];
      tweets.map((t) => {
        if (t["id_str"] !== tweet["id_str"]) {
          newTweets.push(t);
        }
      });
      this.setState({ tweets: newTweets });
    }
  }

  deleteSavedTweet(tweet) {
    if (this.state.tweetsLoaded) {
      let tweets = this.state.savedTweets;
      const newTweets = tweets.filter((t) => t["id_str"] !== tweet["id_str"]);
      RestAPI.hideSavedTweet(tweet["id_str"])
        .then(() => {
          this.setState({ savedTweets: newTweets });
        })
        .catch((err) => console.error("Error Getting Tweets:", err));
    }
  }

  newSavedTweet(newTweet) {
    this.setState({ savedTweets: [...this.state.savedTweets, newTweet] });
  }

  handleSearchButtonClick(e) {
    e.preventDefault();
    const { tags } = this.state;

    this.setState({
      loading: true,
      tweets: [],
    });
    RestAPI.extractTweetsFromTags(tags)
      .then((res) => {
        this.setState({ tweets: res.data.data, tweetsLoaded: true });
        this.extractUsersFromTweets(res.data.data);
      })
      .catch((err) => console.error("Error Getting Tweets:", err));

    RestAPI.getSavedTweets()
      .then((res) => {
        this.setState({ savedTweets: res.data });
      })
      .catch((err) => console.error("Error Getting Tweets:", err));
  }

  //Changed by Yasmin
  handleSearchButtonClick1 = (newTagAdded = false) => {
    const { tags } = this.state;

    RestAPI.extractTweetsFromTags(tags)
      .then((res) => {
        if (newTagAdded) {
          this.setState((prevState) => ({
            ...prevState,
            newTweets: res.data.data,
            tweetsLoaded: true,
            isAdded: true,
            isShowing: true,
          }));
          const perc = calculate_percentage(res.data.data);

          this.setState((prevState) => ({
            ...prevState,
            percentage: perc,
            isShowing: false,
          }));
        } else {
          this.setState({
            loading: true,
            tweets: [],
          });
          this.setState((prevState) => ({
            ...prevState,
            tweets: res.data.data,
            tweetsLoaded: true,
          }));

          this.extractUsersFromTweets(res.data.data);
        }
      })
      .catch((err) => console.error("Error Getting Tweets:", err));

    RestAPI.getSavedTweets()
      .then((res) => {
        this.setState({ savedTweets: res.data });
      })
      .catch((err) => console.error("Error Getting Tweets:", err));
  };
  //
  //changed by Yasmin, the other change weights are removed
  changeTagWeight2 = (index, newWeight) => {
    const newTags = [...this.state.tags];
    newTags[index].weight = newWeight;
    this.setState((prevState) => ({
      ...prevState,
      tags: newTags,
      isAdded: true,
    }));
  };

  //Added by Yasmin
  handleApplyChanges = () => {
    this.setState((prevState) => ({
      ...prevState,
      reloadTweets: true,
      loading: true,
      isAdded: false,
    }));
    this.setState((prevState) => ({
      ...prevState,
      tweets: [...prevState.newTweets],
    }));
    this.setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };
  //
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
    const { tweets, users } = this.state;

    window.onload = function () {
      document.getElementById("search").click();
    };

    return (
      <>
        <Container>
          <Card className="bg-gradient-default1 shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <Col>
                  <h2>Tweets & People</h2>
                  <p>
                    Here you can get recommended tweets relevant to your
                    interests. The interest set below represents the top 5
                    interests in your interest profile.
                    <br />
                    You can learn more about why/how a tweet is recommended to
                    you:
                    <li>
                      {" "}
                      The <strong>color band</strong>, the{" "}
                      <strong>highlighted words</strong> and the{" "}
                      <strong>similarity score</strong> show you how relevant is
                      the tweet to your interest profile{" "}
                      <i>(basic explanation)</i>
                    </li>
                    <li>
                      {" "}
                      Click on <strong>'Why this tweet?'</strong> to get more
                      details <i>(intermediate and advanced explanations)</i>
                    </li>
                  </p>
                </Col>
              </Row>

              <div className="d-flex align-items-center">
                {/* Added by Yasmin*/}
                <fieldset
                  style={{
                    width: "90%",
                    marginLeft: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgb(140, 140, 137, 0.6)",
                  }}
                >
                  {/* Added by Yasmin*/}
                  <legend
                    style={{
                      width: "150px",
                      marginLeft: "30px",
                      fontSize: 15,
                      backgroundColor: "#FFFFFF",
                      fontWeight: "bold",
                      marginBottom: "0px",
                    }}
                  >
                    Your top 5 interests:
                  </legend>
                  <Row
                    style={{ marginLeft: "35px" }}
                    className="align-items-center"
                  >
                    <Col xs={10}>
                      <TagSearch
                        tags={this.state.tags}
                        newTags={this.state.newTags}
                        delimiters={delimiters}
                        handleDelete={this.handleDeleteTag}
                        handleAddition={this.handleTagAddition}
                        handleDrag={this.handleDragTag}
                        handleTagClick={this.handleTagClick}
                        handleTagSettingsChange={this.handleTagSettingsChange}
                        addNewTag={this.addNewTag}
                      />
                    </Col>

                    <Col xs={1}>
                      {/* Added by Yasmin*/}
                      <SimplePopover
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
                      />
                    </Col>
                    <Col xs={1}>
                      <Form
                        method="post"
                        onSubmit={this.handleSearchButtonClick} // sometimes triggered automatically, sometimes not
                      >
                        <IconButton size="medium" id="search" type="submit">
                          <SearchTwoToneIcon size="medium"></SearchTwoToneIcon>
                        </IconButton>
                      </Form>
                    </Col>
                  </Row>
                </fieldset>
              </div>

              <Container style={{ paddingTop: "20px" }}>
                <Container>
                  <Nav
                    tabs
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "1",
                        })}
                        onClick={() => {
                          this.tabToggle("1");
                        }}
                        style={Object.assign(
                          {},
                          styles.tabLink,
                          this.state.activeTab === "1"
                            ? styles.activeTabLink
                            : null
                        )}
                      >
                        Tweets
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "2",
                        })}
                        onClick={() => {
                          this.tabToggle("2");
                        }}
                        style={Object.assign(
                          {},
                          styles.tabLink,
                          this.state.activeTab === "2"
                            ? styles.activeTabLink
                            : null
                        )}
                      >
                        People
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "4",
                        })}
                        onClick={() => {
                          this.tabToggle("4");
                        }}
                        style={Object.assign(
                          {},
                          styles.tabLink,
                          this.state.activeTab === "4"
                            ? styles.activeTabLink
                            : null
                        )}
                      >
                        Saved Tweets
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                      <Container id="tweet-card-container">
                        {tweets.length > 0 ? (
                          tweets.map((tweet) => {
                            if (this.state.loading === true) {
                              this.setState({
                                loading: false,
                              });
                            }
                            return (
                              <TweetCard
                                key={tweet.id_str}
                                tweet={tweet}
                                keyword_tags={this.state.tags}
                                deleteTweet={this.deleteTweet.bind(this)}
                                newSavedTweet={this.newSavedTweet.bind(this)}
                                reloadTweets={this.state.reloadTweets}
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
                              Loading tweets.. please wait
                            </h1>
                          </div>
                        ) : null}
                      </Container>
                    </TabPane>
                    <TabPane tabId="2">
                      <TwitterUsers users={users}></TwitterUsers>
                    </TabPane>
                    <TabPane tabId="4">
                      <Container id="tweet-card-container">
                        {this.state.savedTweets.length > 0 &&
                        this.state.tweets.length > 0
                          ? this.state.savedTweets
                              .slice(0)
                              .reverse()
                              .map((tweet) => (
                                <SavedTweetCard
                                  key={Math.random() * 99999999}
                                  tweet={tweet}
                                  deleteSavedTweet={this.deleteSavedTweet.bind(
                                    this
                                  )}
                                ></SavedTweetCard>
                              ))
                          : null}
                      </Container>
                    </TabPane>
                  </TabContent>
                </Container>
              </Container>
            </CardHeader>
          </Card>
        </Container>
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
