
import React from 'react';
import { Box } from "@material-ui/core";
import {
  CardHeader,
  Container,
  Row,
  Col,
} from "reactstrap";

import PaperGraph from "./src/PaperGraph";

const ExplorePublications = () => {
  return (
    <>
      <style>
        {`
          .fullScreenContainer {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: white;
            z-index: 1000;
          }
        `}
      </style>

      <Container fluid className="fullScreenContainer">
        <Box width="100%" minHeight="90vh" sx={{ borderRadius: 20 }}>
          <CardHeader className="bg-white border-0">
            <Row className="align-items-center">
              <Col xs="8">
                <h3 className="mb-0">Paper Explorer</h3>
              </Col>
            </Row>
          </CardHeader>
          <PaperGraph />
        </Box>


      </Container>
    </>
  );
}

export default ExplorePublications;