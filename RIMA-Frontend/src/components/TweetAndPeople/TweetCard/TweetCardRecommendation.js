import React, {useState} from 'react';
import {Button, Col, Container, OverlayTrigger, Popover, Row, Spinner} from "react-bootstrap";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../services/api";
import LineChartDummy from "./Charts/LineChartDummy";

export default function TweetCardRecommendation(props) {
  // Props
  const {userSelectedKeywords, tweetText} = props;
  // console.log(userSelectedKeywords);

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [tweetKeywords, setTweetKeywords] = useState(undefined);
  const [series, setSeries] = useState([]);
  const explanation = [
    "First level of explanation",
    "Second level of explanation",
    "Third level of explanation"
  ];
  const description = [
    "First level of explanation description to let users know the keywords that matches with the recommended tweets",
    "Second level of explanation description to let the users know how much do the keyword matches in heatmap representation",
    "Third level of explanation description to let the users know the similarity between the keywords"
  ]

  console.log(series);

  // Functions
  // Opens the Overlay Popover and requests keywords from tweet
  const tweetInfo = () => {
    setOpenOverlay(!openOverlay);
    extractKeywordFromTweet();
    if (openOverlay) {
      setStep(0);
    }
  }
  // Step to the next level of explanation
  const handleStepForward = () => {
    setStep(step + 1);
    if (series.length === 0) {
      calculateSimilarity();
    }
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
    }, 500);
  }
  // REST API request for keywords from tweet
  const extractKeywordFromTweet = () => {
    const data = {
      text: tweetText.trim(),
      algorithm: "TopicRank"
    };
    RestAPI.interestExtract(data)
      .then((response) => {
        const keys = Object.keys(response.data);
        const value = Object.values(response.data);
        const keywordArray = [];
        for (let i = 0; i < keys.length; i++) {
          keywordArray.push({
            text: keys[i],
            value: value[i],
          });
        }
        setTweetKeywords(keywordArray);
      }).catch((error) => {
      console.log("err", error);
    });
  }

  const calculateSimilarity = () => {
    let seriesData = [];
    if (tweetKeywords !== undefined) {
      userSelectedKeywords.forEach((userSelectedKeyword) => {
        let data = [];
        tweetKeywords.forEach((tweetKeyword) => {
          let requestData = {
            keywords_1: [userSelectedKeyword.text],
            keywords_2: [tweetKeyword.text],
            algorithm: "WordEmbedding"
          }
          RestAPI.computeSimilarity(requestData)
            .then((response) => {
              data.push({
                x: tweetKeyword.text,
                y: response.data.score,
              });
            }).catch((error) => {
            console.log("err", error);
          });
        })
        seriesData.push({
          name: userSelectedKeyword.text,
          data: data,
        });
      })
      setSeries(seriesData);
    }
  }

  return (
    <>
      <OverlayTrigger
        show={openOverlay}
        placement="bottom-end"
        overlay={
          <Popover style={{maxWidth: "768px"}}>
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
                    <IconButton
                      type="button"
                      style={{width: "48px"}}
                      onClick={handleClose}
                    >
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
                    {step === 0 ? description[step] : (step === 1 ? description[step] : description[step])}
                  </h4>
                </Row>
                <Row>
                  {/* Replace the LineChartDummy with the visualization component you would like to put at each step */}
                  {/* pass the series state variable as props for the HeatMapViz component */}
                  {step === 0 ? <LineChartDummy/> : (step === 1 ? <LineChartDummy/> : <LineChartDummy/>)}
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col style={{paddingLeft: "0px"}}>
                    {step > 0 ? <Button variant="link" onClick={handleStepBackward}
                                        style={{fontSize: "16px"}}>Previous</Button> : <></>}
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    {(step < 2 && tweetKeywords) ? <Button variant="link" onClick={handleStepForward}
                                                           style={{fontSize: "16px"}}>More</Button>
                      : (step === 2 ? <Button variant="link" onClick={handleClose}
                                              style={{fontSize: "16px"}}>Finish</Button>
                        : (
                          <Button variant="link" disabled style={{fontSize: "16px"}}>
                            <Spinner animation="border" role="status" size="sm" style={{margin: "0px 4px 3px 0px"}}/>
                            Loading...
                          </Button>
                        ))
                    }
                  </Col>
                </Row>
              </Container>
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="link" onClick={tweetInfo}>
          Why am I getting this recommendation?
        </Button>
      </OverlayTrigger>
    </>
  )
}