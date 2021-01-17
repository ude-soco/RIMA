import React, {useState} from 'react';
import {Button, Col, Container, OverlayTrigger, Popover, Row, Spinner, Image} from "react-bootstrap";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faTimes} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../services/api";
import HeatmapTweet from "../../ReuseableComponents/Charts/HeatMap/HeatMap.js";


export default function TweetCardRecommendation(props) {
  // Props
  const {userInterestModel, tweetText} = props;

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const explanation = [
    "Intermediate explanation",
    "Advanced explanation"
  ];
  const description = [
    "This tweet is recommended to you because your interest keywords and the keywords " +
    "extracted from the tweet are highly similar. Here you can see the exact similarity " +
    "score between your interest and the tweet text",
    "The inner logic of recommending this tweet is as follow:"
  ];

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
      if (error) {
        setCount(count + 1);
        setError("");
        setSeries([]);
      }
      setStep(0);
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
            algorithm: "WordEmbedding"
          }
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
                      {explanation[step]}
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
              <Container>
                <Row style={{marginBottom: "16px"}}>
                  <h4>
                    {description[step]}
                  </h4>
                </Row>
                <Row className="justify-content-center">
                  {(step === 0 && series.length !== 0) ? <HeatmapTweet series={series} width={'550'} height={'280'}/>
                    : (step === 1 ? (
                        <Row style={{marginBottom: "22px"}}>
                          <Col xs={6} md={4}>
                            <Image src='/images/wikilink.png' width={'570'} rounded/>
                          </Col>
                        </Row>
                      ) : (error ?
                          <Button variant="link" disabled style={{fontSize: "16px", color: "red"}}>
                            {count >= 1 ? "Sorry, no data available for this tweet." : error}
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
                <Row>
                  <Col style={{paddingLeft: "0px"}}>
                    {step > 0 ?
                      <Button variant="link" onClick={handleStepBackward} style={{fontSize: "16px"}}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{marginRight: "4px"}}/> Less
                      </Button>
                      : <></>
                    }
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    {(step < 1 && series.length !== 0) ?
                      <Button variant="link" onClick={handleStepForward} style={{fontSize: "16px"}}>
                        More <FontAwesomeIcon icon={faAngleRight} style={{marginLeft: "4px"}}/>
                      </Button>
                      : <></>
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