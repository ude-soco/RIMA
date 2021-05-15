import React from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "Services/utils/errorHandler";
import RestAPI from "../../../Services/api";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Row,
  Col,
  Form,
} from "reactstrap";

import ReactWordcloud from "react-wordcloud";
/* Chart code */
// Themes begin
// Themes end
const options = {
  colors: ["#aab5f0", "#99ccee", "#a0ddff", "#00ccff", "#00ccff", "#90c5f0"],
  enableTooltip: true,
  deterministic: true,
  fontFamily: "arial",
  fontSizes: [15, 60],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 3,
  rotations: 1,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
  };

class Demo extends React.Component {
  state = {
    isLoding: true,
    weight: null,
    wiki: false,
    keywords: "",
    algorithm: "",
    keywords_1: [],
    keywords_2: [],
    score: "",
    wordArray: [],
    keyarray: "",
    isDemoLoader: false,
    isWordCloud: false,
    isData: true,
    isScore: false,
  };
  componentDidMount() {
    this.setState({
      isLoding: false,
    });
  }

  interestExtraction = (e) => {
    e.returnValue = false;
    if (this.state.keywords === "") {
      toast.error("Please Enter text for interest extraction", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.algorithm === "") {
      toast.error("Please Select Algorithm", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.algorithm === "null") {
      toast.error("Please Select Algorithm", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.weight === null) {
      toast.error("Please Enter Keywords Count", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.weight === "") {
      toast.error("Please Enter Keywords Count", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      let data = {
        num_of_keywords: this.state.weight,
        wiki_filter: this.state.wiki,
        text: this.state.keywords.trim(),
        algorithm: this.state.algorithm,
      };
      this.setState({ isDemoLoader: true }, () => {
        RestAPI.interestExtract(data)
          .then((response) => {
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
            let keywordArray = [];
            if (keys.length === 0) {
              this.setState({
                isData: false,
              });
            }
            for (let i = 0; i < keys.length; i++) {
              keywordArray.push({
                text: keys[i],
                value: value[i],
              });
            }
            this.setState({
              isDemoLoader: false,
              isWordCloud: true,
              wordArray: keywordArray,
            });
          })
          .catch((error) => {
            this.setState({ isDemoLoader: false });
            handleServerErrors(error, toast.error);
          });
      });
    }
  };

  computeSimilarities = () => {
    if (this.state.keywords_1.length === 0) {
      toast.error("Please Add Keyword (Set 1)", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.keywords_2.length === 0) {
      toast.error("Please Add Keyword (Set 2)", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.algorithm === "") {
      toast.error("Please Select Algorithm", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    if (this.state.algorithm === "null") {
      toast.error("Please Select Algorithm", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      let keyword1 = this.state.keywords_1.trim().split(",");
      let keyword2 = this.state.keywords_2.trim().split(",");
      let data = {
        algorithm: this.state.algorithm,
        keywords_1: keyword1,
        keywords_2: keyword2,
      };
      this.setState({
        isDemoLoader: true,
      });
      RestAPI.computeSimilarity(data)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              score: response.data.score,
              isScore: true,
              isDemoLoader: false,
            });
          }
        })
        .catch((error) => {
          this.setState({ isDemoLoader: false });
          handleServerErrors(error, toast.error);
        });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleWikipedia = () => {
    this.setState({ wiki: !this.state.wiki });
  };

  selectchange = (e) => {
    this.setState({
      algorithm: e.target.value,
    });
  };

  render() {
    const callbacks = {
      getWordTooltip: (word) => `${word.text}`,
    };
    return (
      <>
        <Col lg="10" md="12">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4"/>
              {this.state.isLoding ? (
                <div className="text-center">
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              ) : (
                <Tabs
                  style={{
                    border: "1px solid gainsboro",
                    borderRadius: "4px",
                    padding: "12px 16px",
                  }}
                >
                  <TabList>
                    <Tab>Interest Extraction</Tab>
                    <Tab>Semantic Similarity</Tab>
                  </TabList>
                  <TabPanel>
                    {this.state.isDemoLoader ? (
                      <div className="text-center" style={{ padding: "20px" }}>
                        <Loader
                          type="Puff"
                          color="#00BFFF"
                          height={100}
                          width={100}
                          timeout={1000}
                        />
                      </div>
                    ) : (
                      <>
                        <Form>
                          <Row>
                            <br />
                            <br />
                            <Col lg="12">
                              <FormGroup>
                                <textarea
                                  rows="5"
                                  style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "4px",
                                  }}
                                  className="form-control-alternative"
                                  name="keywords"
                                  placeholder="Enter text for interest extraction"
                                  value={this.state.keywords}
                                  type="text"
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup>
                                <select
                                  className="form-control form-control-alternative"
                                  name="algorithm"
                                  value={this.state.algorithm}
                                  onChange={this.selectchange}
                                >
                                  <option value="null">Select Algorithm</option>
                                  <option value="TopicRank">Topic Rank</option>
                                  <option value="SingleRank">
                                    Single Rank
                                  </option>
                                  <option value="MultipartiteRank">
                                    Multi Partite Rank
                                  </option>
                                  <option value="PositionRank">
                                    Position Rank
                                  </option>
                                  <option value="TopicalPageRank">
                                    Topical Page Rank
                                  </option>
                                  <option value="TextRank">Text Rank</option>
                                  <option value="Rake">Rake</option>
                                  <option value="Yake">Yake</option>
                                </select>
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  name="weight"
                                  placeholder="Keywords Count"
                                  type="Number"
                                  value={this.state.weight}
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup style={{ fontSize: "14px" }}>
                                <FormControlLabel
                                  value="end"
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={this.handleWikipedia}
                                      placeholder="Use Wikipedia"
                                      value={this.state.wiki}
                                      checked={this.state.wiki}
                                      inputProps={{
                                        "aria-label": "secondary checkbox",
                                      }}
                                    />
                                  }
                                  label="Use Wikipedia"
                                  labelPlacement="end"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <Button
                                color="primary"
                                type="button"
                                onClick={this.interestExtraction}
                                style={{ margin: "0 auto", display: "block" }}
                              >
                                Extract Interest
                              </Button>
                              {this.state.isWordCloud ? (
                                this.state.isData ? (
                                  <div
                                    style={{
                                      height: 400,
                                      width: "100%",
                                      marginTop: "40px",
                                    }}
                                  >
                                    <ReactWordcloud
                                      options={options}
                                      callbacks={callbacks}
                                      words={this.state.wordArray}
                                    />
                                  </div>
                                ) : (
                                  <p
                                    style={{
                                      textAlign: "center",
                                      lineHeight: "3",
                                    }}
                                  >
                                    No Keywords Found
                                  </p>
                                )
                              ) : (
                                <></>
                              )}
                            </Col>
                          </Row>
                        </Form>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel>
                    {this.state.isDemoLoader ? (
                      <div className="text-center" style={{ padding: "20px" }}>
                        <Loader
                          type="Puff"
                          color="#00BFFF"
                          height={100}
                          width={100}
                        />
                      </div>
                    ) : (
                      <>
                        <Form>
                          <Row>
                            <br />
                            <br />
                            <Col lg="6">
                              <FormGroup>
                                <textarea
                                  rows="5"
                                  style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "4px",
                                  }}
                                  className="form-control-alternative"
                                  name="keywords_1"
                                  placeholder="Keywords (Set 1)"
                                  type="text"
                                  value={this.state.keywords_1}
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <textarea
                                  rows="5"
                                  style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "4px",
                                  }}
                                  className="form-control-alternative"
                                  name="keywords_2"
                                  value={this.state.keywords_2}
                                  placeholder="Keywords (Set 2)"
                                  type="text"
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup
                                style={{
                                  textAlign: "center",
                                  width: "40%",
                                  margin: "0 auto 30px",
                                }}
                              >
                                <select
                                  className="form-control form-control-alternative"
                                  onChange={this.selectchange}
                                  value={this.state.algorithm}
                                >
                                  <option value="null">Select Algorithm</option>
                                  <option value="WordEmbedding">
                                    Word Embedding
                                  </option>
                                  <option value="WikiLinkMeasure">
                                    Wiki Link Measure
                                  </option>
                                </select>
                              </FormGroup>
                            </Col>
                            <Button
                              color="primary"
                              type="button"
                              onClick={this.computeSimilarities}
                              style={{ display: "block", margin: "0 auto" }}
                            >
                              Compute Similarity
                            </Button>
                            {this.state.isScore ? (
                              <>
                                <br />
                                <h2
                                  className="text-center"
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    marginTop: "20px",
                                    fontSize: "28px",
                                  }}
                                >
                                  {this.state.score}%
                                </h2>
                              </>
                            ) : (
                              <></>
                            )}
                          </Row>
                        </Form>
                      </>
                    )}
                  </TabPanel>
                </Tabs>
              )}
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Demo;
