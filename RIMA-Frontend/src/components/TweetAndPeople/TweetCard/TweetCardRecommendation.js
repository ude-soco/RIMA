import React, {useState} from 'react';
import {Button, Col, Container, Image, OverlayTrigger, Popover, Row} from "react-bootstrap";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../services/api";

export default function TweetCardRecommendation(props) {
  // Props
  const {userSelectedKeywords, tweetText, tag} = props;
  console.log(props);

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [tweetKeywords, setTweetKeywords] = useState(undefined);
  console.log(tweetKeywords);
  console.log(openOverlay);
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
  const imageData = (
    <Image src={"/images/banner.jpg"} fluid style={{borderRadius: "4px"}}/>
  )

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
  }
  // Step back to the previous level of explanation
  const handleStepBackward = () => {
    setStep(step - 1);
  }
  // Step out of the explanation
  const handleStepFinish = () => {
    setOpenOverlay(!openOverlay);
    setTimeout(() => {
      setStep(0);
    }, 1000);
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

  return (
    <>
      <OverlayTrigger
        show={openOverlay}
        placement="bottom-end"
        overlay={
          <Popover style={{maxWidth: "768px", maxHeight: "768px"}}>
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
                      onClick={() => setOpenOverlay(!openOverlay)}
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
                  {/* Replace the imageData with the visualization component you would like to put at each step */}
                  {step === 0 ? imageData : (step === 1 ? imageData : imageData)}
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col style={{paddingLeft: "0px"}}>
                    {step > 0 ? <Button variant="link" onClick={handleStepBackward}
                                        style={{fontSize: "16px"}}>Less</Button> : <></>}
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    {step < 2 ? <Button variant="link" onClick={handleStepForward}
                                        style={{fontSize: "16px"}}>More</Button>
                      : (step === 2 ? <Button variant="link" onClick={handleStepFinish}
                                              style={{fontSize: "16px"}}>Finish</Button>
                        : <></>)
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