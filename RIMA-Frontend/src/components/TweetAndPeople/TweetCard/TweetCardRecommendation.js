import React, {useEffect, useState} from 'react';
import {Button, Col, Container, OverlayTrigger, Popover, Row, Spinner} from "react-bootstrap";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faTimes} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../services/api";
import LineChartDummy from "./Charts/LineChartDummy";
import HeatmapTweet from "./Charts/HeatmapTweet.js";

export default function TweetCardRecommendation(props) {
  // Props
  const {userInterestModel, tweetText} = props;

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [tweetKeywords, setTweetKeywords] = useState([]);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState("");
  const explanation = [
    "Intermediate explanation",
    "Advanced explanation"
  ];
  const description = [
    "This tweet is recommended to you because your interest keywords and the keywords extracted from the tweet are highly similar. Here you can see the exact similarity score between your interest and the tweet text",
    "The inner logic of recommending this tweet is as follow:"
  ]

  // Functions
  // Opens the Overlay Popover and requests keywords from tweet
  const tweetInfo = () => {
    if (tweetKeywords.length === 0) {
      calculateSimilarity()
    }
    setOpenOverlay(!openOverlay);
    if (openOverlay) {
      setStep(0);
    }
  }
  // Step to the next level of explanation
  const handleStepForward = () => {
    setStep(step + 1);
  }
  // Step back to the previous level of explanation
  const handleStepBackward = () => {
    setStep(step - 1);
  }
  // Step out of the explanation
  const handleClose = () => {
    setOpenOverlay(!openOverlay);
    setTimeout(() => {
      setStep(0);
      if (error) {
        setTweetKeywords(undefined);
        setSeries([])
      }
    }, 500);
  }

  // REST API request for keywords from tweet and to compute similarity between tweet keywords
  const calculateSimilarity = async () => {
    const data = {
      text: tweetText.trim(),
      algorithm: "TopicRank"
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
      setTweetKeywords(keywordArray);
    } catch (error) {
      setError("Error loading, please refresh page.")
      console.log(error);
    }
    let seriesData = [];
    if (keywordArray.length !== 0) {
      for (const userSelectedKeyword of userInterestModel) {
        let data = [];
        for (const tweetKeyword of keywordArray) {
          let requestData = {
            keywords_1: [userSelectedKeyword.text],
            keywords_2: [tweetKeyword.text],
            algorithm: "WordEmbedding"
          }
          try {
            let response = await RestAPI.computeSimilarity(requestData)
            data.push({
              x: tweetKeyword.text,
              y: response.data.score,
            });
          } catch (e) {
            setError("Error loading, please refresh page.")
            console.log(error);
          }
        }
        seriesData.push({
          name: userSelectedKeyword.text,
          data: data,
        });
      }
      setSeries(seriesData);
    }
  }

  return (
    <>
      <OverlayTrigger
        show={openOverlay}
        placement="bottom-end"
        overlay={
          <Popover style={{maxWidth: "600px"}}>
            <Popover.Title>
              <Container>
                <Row style={{alignItems: "center"}}>
                  <Col style={{padding: "0px"}}>
                    <h2 style={{marginBottom: "0px"}}>
                      {/* Change the title of the level of explanation above */}
                      {step === 0 ? explanation[step] : (step === 1 ? explanation[step] : explanation[step])}
                    </h2>
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    <IconButton type="button" style={{width: "48px"}} onClick={handleClose}>
                      <FontAwesomeIcon icon={faTimes}/>
                    </IconButton>
                  </Col>
                </Row>
              </Container>
            </Popover.Title>
            <Popover.Content>
              <Container style={{marginBottom: "16px"}}>
                <Row style={{marginBottom: "16px"}}>
                  <h4>
                    {/* Change the description of the levels of explanation above */}
                    {description[step]}
                  </h4>
                </Row>
                <Row style={{justifyContent: "center"}}>
                  {/* Replace the LineChartDummy with the visualization component you would like to put at each step */}
                  {(step === 0 && series.length !== 0) ? <HeatmapTweet series={series}/>
                    : (step === 1 ? <LineChartDummy/>
                        : (error ?
                            <Button variant="link" disabled style={{fontSize: "16px", color: "red"}}>
                              {error}
                            </Button>
                            :
                            <Button variant="link" disabled style={{fontSize: "16px"}}>
                              <Spinner animation="border" role="status" size="sm"
                                       style={{margin: "0px 4px 3px 0px"}}/>
                              Loading...
                            </Button>
                        )
                    )
                  }
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col style={{paddingLeft: "0px"}}>
                    {step > 0 ?
                      <Button variant="link" onClick={handleStepBackward} style={{fontSize: "16px"}}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{marginRight: "4px"}}/> Previous
                      </Button>
                      : <></>
                    }
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    {(step < 1 && tweetKeywords.length !== 0) ?
                      <Button variant="link" onClick={handleStepForward} style={{fontSize: "16px"}}>
                        More <FontAwesomeIcon icon={faAngleRight} style={{marginLeft: "4px"}}/>
                      </Button>
                      : (step === 1 ?
                          <Button variant="link" onClick={handleClose} style={{fontSize: "16px"}}>Finish</Button>
                          : <></>
                      )
                    }
                  </Col>
                </Row>
              </Container>
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="link" onClick={tweetInfo}>
          Why this tweet?
        </Button>
      </OverlayTrigger>
    </>
  )
}