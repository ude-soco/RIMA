import React from 'react';
import {Button, Container, Image, OverlayTrigger, Popover, Row} from "react-bootstrap";

export default function TweetCardRecommendation(props) {
  // Props
  const {tags, text, tag} = props;



  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement="left"
        overlay={
          <Popover style={{maxWidth: "48em", maxHeight: "48em"}}>
            <Popover.Title as="h3">Basic level of Explanation</Popover.Title>
            <Popover.Content>
              <Container>
                <Row style={{marginBottom: "16px"}}>
                  <Image src={"/images/banner.jpg"} fluid style={{borderRadius: "4px"}}/>
                </Row>
                <Row>
                  <h4>
                    Bootstrap CSS sets the max-width of a popover to 276px in the popover class. If you want something
                    wider you should override this. If using a local copy of Bootstrap CSS, just edit that file.
                    Alternatively, if you are using the Bootstrap CDN, create a local CSS file with something like the
                    following chunk in it, and place it in a folder called "assets" at the same level as your app
                  </h4>
                </Row>
              </Container>
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="link">
          Why am I getting this recommendation?
        </Button>
      </OverlayTrigger>
    </>
  )
};