import React, {Component} from "react";
import {toast} from "react-toastify";
import {handleServerErrors} from "Services/utils/errorHandler";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  DropdownMenu,
  ButtonGroup,
  Button,
  Form,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import styled from "styled-components";

import classnames from "classnames";

import Header from "../../components/Headers/Header.js";
import TagSearch from "./TweetAndPeople/TagSearch.js";
import TwitterUsers from "./TweetAndPeople/TwitterUserCard/TwitterUsers.js";
import TwitterUserCard from "./TweetAndPeople/TwitterUserCard/TwitterUserCard.js";
import TweetCard from "./TweetAndPeople/TweetCard/TweetCard.js";
import RestAPI from "Services/api";
import {COUNTRIES} from "./TweetAndPeople/countries";
import AdvanceFilter from "../../components/OptionDropDown/AdvanceFilter.jsx";
import SavedTweetCard from "./TweetAndPeople/TweetCard/SavedTweetCard";
import ScrollTopWrapper from "../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import {Spinner} from "react-bootstrap";

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
    };
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleTagAddition = this.handleTagAddition.bind(this);
    this.handleDragTag = this.handleDragTag.bind(this);
    this.handleTagSettingsChange = this.handleTagSettingsChange.bind(this);
    this.addNewTag = this.addNewTag.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.setWeightOfkeyword = this.setWeightOfkeyword.bind(this);
  }

  componentDidMount() {
    const {tags} = this.state;
    // console.log("success")
    RestAPI.extractTweetsFromTags(tags)
      .then((res) => {
        // console.log({tweet111: res.data.data})
        this.setState({tweets: res.data.data, tweetsLoaded: true});
        this.extractUsersFromTweets(res.data.data);
      })
      .catch((err) => console.error("Error Getting Tweets:", err));
  }

  generateRandomRGB() {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(100, 255);
    const g = randomBetween(50, 200);
    const b = randomBetween(100, 255);
    let rgb = `rgb(${r},${g},${b})`; // Collect all to a css color string
    return rgb;
  }

  getKeywords = () => {
    RestAPI.cloudChart()
      .then((response) => {
        let rowArray = [];
        if (response && response.data) {
          for (let i = 0; i < response.data.length; i++) {
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
            if (i === 4) {
              break;
            }
          }
        }
        const finalRowArray = [...rowArray].sort((a, b) => b.weight - a.weight);
        this.setState({
          isLoding: false,
          tags: finalRowArray,
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
        this.setState({isLoding: false});
        handleServerErrors(error, toast.error);
      });
  };

  setWeightOfkeyword = (id, newWeight) => {
    let oldTags = this.state.tags;
    let newTags = [];
    oldTags.map((tag) => {
      if (tag.id === id) tag.weight = newWeight;
      newTags.push(tag);
    });
    this.setState({tags: newTags});
    this.sortTagsByWeight();
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
          })
          if (found1) tweet.weight = found1;
          if (found !== true) {
            let user = tweet;
            filteredUsers.push(user);
          }
        }
      });
      this.setState({filteredUsers: filteredUsers});
    } else if (action === "delete") {
      let newFilteredUsers = [];
      filteredUsers.map((user) => {
        if (user["tagId"] !== tagId) {
          newFilteredUsers.push(user);
        }
      });
      this.setState({filteredUsers: newFilteredUsers});
    }
  };

  changeHandler = (name, value) => {
    // let name = e.target.name;
    // let value = e.target.value;
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
    if (this.state.activeTab !== tab) this.setState({activeTab: tab});
  };

  handleDeleteTag(i) {
    const {tags} = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
      tagsWithoutWeight: tags.filter((tag, index) => index !== i),
    });
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

  handleTagAddition(tag) {
    this.setState({weight: this.state.weight - 0.5})
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

    this.setState((state) => ({tags: [...state.tags, tag], tagsWithoutWeight: [...state.tags, tag]}));
  }

  setTagDistance(distance, tagId) {
    let tags = this.state.tags;
    tags.map((tag) => {
      if (tag.id == tagId) {
        tag["distance"] = distance;
      }
    });
    this.setState({tags: tags});
  }

  setUserDistance(distance, id_str) {
    let users = this.state.filteredUsers;
    users.map((user) => {
      if (user.id_str == id_str) {
        user["distance"] = distance;
      }
    });
    this.setState({filteredUsers: users});
  }

  makeBorder(newTweets) {
    this.setState({tweets: newTweets})
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
          tweet['distance'] = tag.distance;
          newTweets.push(tweet);
        }
      });
    });
    const newTweets1 = [...newTweets].sort((a, b) => b.distance - a.distance);
    this.setState({tweets: newTweets1, newTags: newTags});
  }

  sortTagsByWeight() {
    if (this.state.tweetsLoaded === false) return;
    let tags = this.state.tags;
    const newTags = [...tags].sort((a, b) => (b.weight - a.weight));
    let tweets = this.state.tweets;
    let newTweets = [];
    newTags.map((tag) => {
      tweets.map((tweet) => {
        if (tag.id == tweet.tagId) {
          newTweets.push(tweet);
        }
      });
    });
    this.setState({tweets: newTweets, tags: newTags});
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
      this.setState({tweets: newTweets});
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
    this.setState({tweets: tweets});
  }

  handleDragTag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({tags: newTags});
    this.sortTweetsByTagOrder();
  }

  extractUsersFromTweets(tweets) {
    let users = [];
    tweets.map((tweet) => {
      let user = tweet["user"];
      users.push(user);
    });
    this.setState({users: users});
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
      this.setState({tweets: newTweets});
    }
  }

  deleteSavedTweet(tweet) {
    if (this.state.tweetsLoaded) {
      let tweets = this.state.savedTweets;
      const newTweets = tweets.filter((t) => t["id_str"] !== tweet["id_str"]);
      RestAPI.hideSavedTweet(tweet["id_str"]).then(() => {
        // console.log('test done done')
        this.setState({savedTweets: newTweets});
      }).catch((err) => console.error("Error Getting Tweets:", err));
    }
  }

  newSavedTweet(newTweet) {
    this.setState({savedTweets: [...this.state.savedTweets, newTweet]})
  }

  handleSearchButtonClick(e) {
    e.preventDefault();
    const {tags} = this.state;
    console.info(`Search Clicked:Tags:${tags}`);
    this.setState({
      loading: true,
      tweets: [],
    })
    RestAPI.extractTweetsFromTags(tags)
      .then((res) => {
        // console.log({tweet111: res.data.data})
        this.setState({tweets: res.data.data, tweetsLoaded: true});
        this.extractUsersFromTweets(res.data.data);
      })
      .catch((err) => console.error("Error Getting Tweets:", err));

    RestAPI.getSavedTweets()
      .then((res) => {
        this.setState({savedTweets: res.data});
      })
      .catch((err) => console.error("Error Getting Tweets:", err));
  }

  changeTagWeight(tagId, newWeight) {
    let tags = this.state.tags;
    let newTags = [];
    tags.map((tag) => {
      if (tag["id"] == tagId) {
        tag["weight"] = newWeight;
      }
      newTags.push(tag);
    });
    this.setState({tags: newTags});
  }

  handleTagSettingsChange(id, name, value) {
    // console.log({id, name, value})
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

  addNewTag(newTag) {
    // console.log('wwwwwwwwwwwww ', newTag, this.state.tags)
  }

  componentDidMount() {
    this.getKeywords();
  }

  render() {
    const {tweets, users} = this.state;

    window.onload = function () {
      document.getElementById("search").click();
    };
    // console.log("the state is");
    // console.log(this.state.place);
    return (
      <>
        <Container>
          <Card className="bg-gradient-default1 shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <Col>
                  <h2>
                    Tweets & People
                  </h2>
                  <p>Here you can get recommended tweets relevant to your interests.
                    The interest set below represents the top 5 interests in your interest profile.
                    <br/>

                    You can learn more about why/how a tweet is recommended to you:
                    <li> The <strong>color band</strong>, the <strong>highlighted words</strong> and the <strong>similarity
                      score</strong> show you how relevant is the tweet to your interest profile <i>(basic
                      explanation)</i></li>
                    <li> Click on <strong>'Why this tweet?'</strong> to get more details <i>(intermediate and advanced
                      explanations)</i></li>
                  </p>
                </Col>
              </Row>

              <div className="d-flex align-items-center">
                <div className="mt-4">
                  {/* <UncontrolledDropdown>
                    <DropdownToggle
                      // tag="a"
                      className="text-primary p-0"
                      style={{
                        fontSize: "20px",
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      <MdErrorOutline
                        style={{
                          fontSize: "30px",
                          color: "rgb(17, 137, 239)",
                        }}
                      />
                    </DropdownToggle>

                    <OptionDropDown HideHandler={this.HideHandler} />
                  </UncontrolledDropdown> */}
                  <div>
                    {/* <Button id="PopoverLegacy" type="button">
                      Launch Popover (Legacy)
                    </Button> */}
                    {/* <MdErrorOutline
                      id="PopoverLegacy"
                      className="cursor--pointer"
                      style={{
                        fontSize: "30px",
                        color: "rgb(17, 137, 239)",
                      }}
                    /> */}

                    {/* <AdvanceFilter
                      setWeightOfkeyword={this.setWeightOfkeyword}
                      tags={this.state.tags}
                      filterUsers={this.filterUsers.bind(this)}
                      setTagDistance={this.setTagDistance.bind(this)}
                      setUserDistance={this.setUserDistance.bind(this)}
                      sortTagsByDistance={this.sortTagsByDistance.bind(this)}
                      sortTweetsByUserDistance={this.sortTweetsByUserDistance.bind(
                        this
                      )}
                      filteredUsers={this.state.filteredUsers}
                      tweets={this.state.tweets}
                      tagsWithoutWeight={this.state.tagsWithoutWeight}
                      makeBorder={this.makeBorder.bind(this)}
                    /> */}

                    {/* <UncontrolledPopover
                      trigger="legacy"
                      placement="bottom"
                      target="PopoverLegacy"
                    > */}
                    {/* <PopoverBody>
                        <Tabs /> */}
                    {/* Legacy is a reactstrap special trigger value (outside of
                        bootstrap's spec/standard). Before reactstrap correctly
                        supported click and focus, it had a hybrid which was
                        very useful and has been brought back as
                        trigger="legacy". One advantage of the legacy trigger is
                        that it allows the popover text to be selected while
                        also closing when clicking outside the triggering
                        element and popover itself. */}
                    {/* </PopoverBody>
                    </UncontrolledPopover> */}
                  </div>
                </div>
                <Container className="mt-4" id="tag-search-container">
                  <Row className="align-items-center">
                    <Col>
                      <TagSearch
                        tags={this.state.tags}
                        newTags={this.state.newTags}
                        // suggestions={this.state.suggestions} 
                        delimiters={delimiters}
                        handleDelete={this.handleDeleteTag}
                        handleAddition={this.handleTagAddition}
                        handleDrag={this.handleDragTag}
                        handleTagClick={this.handleTagClick}
                        handleTagSettingsChange={this.handleTagSettingsChange}
                        addNewTag={this.addNewTag}
                        //   changeHandler={this.changeHandler}
                      />
                    </Col>
                    <ButtonGroup>
                      {/*                      <UncontrolledDropdown>
                        <DropdownToggle
                          // tag="a"
                          className="text-primary"
                          caret
                          style={{
                            fontSize: "20px",
                            background: "none",
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          Filters
                        </DropdownToggle>

                        <Filter
                          state={this.state}
                          changeHandler={this.changeHandler}
                        />
                      </UncontrolledDropdown> */}

                      <Form
                        method="post"
                        onSubmit={this.handleSearchButtonClick} // should be triggered automatically
                      >
                        <div style={{padding: '15px'}}>
                          <Button id="search" className="bg-primary" type="submit">
                            <i className="fas fa-search text-white"></i>
                          </Button>
                        </div>
                      </Form>

                    </ButtonGroup>
                  </Row>
                </Container>
              </div>

              <Row className="mt-4">
                <Col md={12}>
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
                    {/* <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "3",
                        })}
                        onClick={() => {
                          this.tabToggle("3");
                        }}
                        style={Object.assign(
                          {},
                          styles.tabLink,
                          this.state.activeTab === "3"
                            ? styles.activeTabLink
                            : null
                        )}
                      >
                        Tests
                      </NavLink>
                    </NavItem> */}
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
                </Col>
              </Row>

              <Container style={{paddingTop: "20px"}}>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Container id="tweet-card-container">
                      {tweets.length > 0
                        ? (
                          tweets.map((tweet) => {
                              if (this.state.loading === true) {
                                this.setState({
                                  loading: false
                                })
                              }
                              return (
                                <TweetCard
                                  key={Math.random() * 99999999}
                                  tweet={tweet}
                                  keyword_tags={this.state.tags}
                                  deleteTweet={this.deleteTweet.bind(this)}
                                  newSavedTweet={this.newSavedTweet.bind(this)}
                                />
                              )
                            }
                          ))
                        : (this.state.loading ? (
                          <div style={{marginTop: "8px"}}>
                            <h1 className="d-flex justify-content-center align-items-center">
                              <Spinner animation="border" role="status" size="lg"
                                       style={{margin: "4px 4px 3px 0px"}}/>
                              Loading tweets.. please wait
                            </h1>
                          </div>
                        ) : null)}
                    </Container>
                  </TabPane>
                  <TabPane tabId="2">
                    <TwitterUsers users={users}></TwitterUsers>
                  </TabPane>
                  <TabPane tabId="4">
                    <Container id="tweet-card-container">
                      {this.state.savedTweets.length > 0 && this.state.tweets.length > 0 ?
                        this.state.savedTweets.slice(0).reverse().map((tweet) => (
                          <SavedTweetCard
                            key={Math.random() * 99999999}
                            tweet={tweet}
                            deleteSavedTweet={this.deleteSavedTweet.bind(this)}
                          ></SavedTweetCard>
                        )) : null}
                    </Container>
                  </TabPane>
                </TabContent>
              </Container>
            </CardHeader>
          </Card>
        </Container>
        <ScrollTopWrapper/>
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
            className={classnames({active: activeTab === "1"})}
            onClick={() => {
              toggle("1");
            }}
          >
            keywords weight
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === "2"})}
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
