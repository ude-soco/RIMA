import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../../../Services/api";
import HeatmapTweet from "../../../ReuseableComponents/Charts/HeatMap/HeatMap.js";
import Flow from "../../TweetCharts/FlowChart/flow.js";

export default function TweetCardRecommendation(props) {
  // Props
  const { userInterestModel, tweetText, score } = props;

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const explanation = ["Intermediate explanation", "Advanced explanation"];

  // Functions
  // Opens the Overlay Popover and requests keywords from tweet
  const tweetInfo = () => {
    if (series.length === 0) {
      calculateSimilarity();
    }
    setOpenOverlay(!openOverlay);
    if (openOverlay) {
      setStep(0);
    }
  };
  // Step to the next level of explanation
  const handleStepForward = () => {
    setStep(step + 1);
  };
  // Step back to the previous level of explanation
  const handleStepBackward = () => {
    setStep(step - 1);
  };
  // Step out of the explanation
  const handleClose = () => {
    setOpenOverlay(!openOverlay);
    setTimeout(() => {
      if (error) {
        setCount(count + 1);
        setError("");
        setSeries([]);
      }
      setStep(0);
    }, 500);
  };

  // REST API request for keywords from tweet and to compute similarity between tweet keywords
  const calculateSimilarity = async () => {
    const data = {
      text: tweetText.trim(),
      algorithm: "Yake",
    };
    const keywordArray = [];
    try {
      let response = await RestAPI.interestExtract(data);
      const keys = Object.keys(response.data);
      const value = Object.values(response.data);
      for (let i = 0; i < keys.length; i++) {
        keywordArray.push({
          text: keys[i],
          value: value[i],
        });
      }
    } catch (error) {
      setError("Loading error, close and try again.");
      console.log(error);
    }
    // Calling the REST API to compute similarity between tweet keywords
    let seriesData = [];
    if (keywordArray.length !== 0) {
      for (const userInterest of userInterestModel) {
        let data = [];
        for (const tweetKeyword of keywordArray) {
          let requestData = {
            keywords_1: [userInterest.text],
            keywords_2: [tweetKeyword.text],
            algorithm: "WordEmbedding",
          };
          try {
            let response = await RestAPI.computeSimilarity(requestData);
            data.push({
              x: tweetKeyword.text,
              y: response.data.score,
            });
          } catch (e) {
            setError("Loading error, close and try again.");
            console.log(error);
          }
        }
        seriesData.push({
          name: userInterest.text,
          weight: userInterest.weight,
          data: data,
        });
      }
      setSeries(seriesData);
    }
  };

  return (
    <>
      {/* Yasmin: Flowchart added. button, spinner, Container, badge changed from bootstrap to MUI*/}
      <OverlayTrigger
        show={openOverlay}
        placement="bottom-end"
        overlay={
          <Popover style={{ maxWidth: "750px", zIndex: 5 }}>
            <Popover.Title>
              <Container>
                <Row className="align-items-center">
                  <Col style={{ padding: "0px" }}>
                    <h2 style={{ marginBottom: "0px" }}>{explanation[step]}</h2>
                  </Col>
                  <Col md="auto" style={{ paddingRight: "0px" }}>
                    <h2 style={{ marginBottom: "0px" }}>
                      <Badge
                        style={{
                          backgroundColor: "#f7f7f7",
                          borderRadius: "20px",
                          fontSize: "14px",
                          paddingRight: "15px",
                          paddingLeft: "15px",
                        }}
                      >
                        Similarity: {score}%
                      </Badge>
                    </h2>
                  </Col>
                  <Col md="auto" style={{ paddingRight: "0px" }}>
                    <IconButton
                      type="button"
                      style={{ width: "48px" }}
                      onClick={handleClose}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                  </Col>
                </Row>
              </Container>
            </Popover.Title>
            <Popover.Content>
              <Container>
                <Row style={{ marginBottom: "16px" }}>
                  {step === 0 ? (
                    <>
                      <h4>
                        In this chart, you can see the similarity score between
                        your interests and keywords extracted from the tweet by
                        hovering over the areas of the heatmap.
                      </h4>
                      <h4>
                        The x-axis represents the keywords extracted from the
                        tweet, and the y-axis represents your interests.
                      </h4>
                    </>
                  ) : (
                    <>
                      <h4>
                        In this figure, the inner logic of recommending this
                        tweet is explained. It shows the steps of extracting
                        interests and tweet keywords, generating their embedding
                        representations, and computing similarity between them.{" "}
                      </h4>
                    </>
                  )}
                </Row>
                <Row className="justify-content-center">
                  {step === 0 && series.length !== 0 ? (
                    <HeatmapTweet
                      series={series}
                      width={"700"}
                      height={"380"}
                    />
                  ) : step === 1 ? (
                    <Row style={{ marginBottom: "22px" }}>
                      <Col>
                        {/*<FlowChart series={series} score={score} />*/}
                        <Flow series={series} score={score} />
                      </Col>
                    </Row>
                  ) : error ? (
                    <Button
                      variant="link"
                      disabled
                      style={{ fontSize: "16px", color: "red" }}
                    >
                      {count >= 1
                        ? "Sorry, no data available for this tweet."
                        : error}
                    </Button>
                  ) : (
                    <Button
                      variant="link"
                      disabled
                      style={{
                        fontWeight: "bold",
                        textTransform: "none",

                        fontSize: "16px",
                      }}
                    >
                      <Box sx={{ position: "relative", marginRight: "5px" }}>
                        <CircularProgress
                          variant="determinate"
                          sx={{
                            color: (theme) =>
                              theme.palette.grey[
                                theme.palette.mode === "light" ? 200 : 800
                              ],
                          }}
                          size={25}
                          thickness={4}
                          value={100}
                        />
                        <CircularProgress
                          variant="indeterminate"
                          disableShrink
                          sx={{
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#1a90ff"
                                : "#308fe8",
                            animationDuration: "550ms",
                            position: "absolute",
                            left: 0,
                            [`& .${circularProgressClasses.circle}`]: {
                              strokeLinecap: "round",
                            },
                          }}
                          size={25}
                          thickness={4}
                        />
                      </Box>
                      Loading...
                    </Button>
                  )}
                </Row>
                <Row>
                  <Col style={{ paddingLeft: "0px" }}>
                    {step > 0 ? (
                      <Button
                        variant="link"
                        onClick={handleStepBackward}
                        style={{
                          fontWeight: "bold",
                          textTransform: "none",

                          fontSize: "16px",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          style={{ marginRight: "4px" }}
                        />{" "}
                        Less
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Col>
                  <Col md="auto" style={{ paddingRight: "0px" }}>
                    {step < 1 && series.length !== 0 ? (
                      <Button
                        variant="link"
                        onClick={handleStepForward}
                        style={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "16px",
                        }}
                      >
                        More{" "}
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          style={{ marginLeft: "4px" }}
                        />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Container>
            </Popover.Content>
          </Popover>
        }
      >
        <Button
          size="medium"
          style={{ fontWeight: "bold", textTransform: "none" }}
          onClick={tweetInfo}
        >
          Why this tweet?
        </Button>
      </OverlayTrigger>
    </>
  );
}
