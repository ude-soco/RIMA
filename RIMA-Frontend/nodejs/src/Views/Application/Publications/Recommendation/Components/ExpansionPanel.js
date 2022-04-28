import React, { useState } from "react";

import { Accordion, Card, Button } from "react-bootstrap";
import Seperator from "./Seperator";
import { Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button as ButtonMUI, Grid, Item } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ReplaceableCloudChart from "../Components/ReplaceableCloudChart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Flowchart from "../Components/Flowchart";

export default function ExpansionPanel(props) {
  // Tannaz start
  const [whyShow, setWhyShow] = useState(false);
  const [whatIfShow, setWhatIfShow] = useState(false);
  const [moreDetail, setMoreDetail] = useState(false);

  var moreDetailFlowchart = [
    // nodes
    {
      data: {
        id: "one",
        label: "Interest Model",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 3, y: 30 },
    },
    {
      data: {
        id: "two",
        label: "Semantic Scholar API",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 215, y: 30 },
    },
    {
      data: {
        id: "three",
        label: "Interests",
        faveColor: "#3385ff",
        shape: "diamond",
        width: 110,
      },
      position: { x: -100, y: 110 },
    },
    {
      data: {
        id: "four",
        label: "Split Keyphrase into Keywords",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 200,
      },
      position: { x: 110, y: 110 },
    },
    {
      data: {
        id: "five",
        label: "Keywords",
        faveColor: "#3385ff",
        shape: "diamond",
        width: 110,
      },
      position: { x: 330, y: 110 },
    },
    {
      data: {
        id: "six",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: -105, y: 190 },
    },
    {
      data: {
        id: "seven",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 30, y: 190 },
    },
    {
      data: {
        id: "eight",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 190, y: 190 },
    },
    {
      data: {
        id: "nine",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 320, y: 190 },
    },
    {
      data: {
        id: "ten",
        label: "Interest Embeddings",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 130,
      },
      position: { x: -20, y: 260 },
    },
    {
      data: {
        id: "eleven",
        label: "Publication Keyword Embeddings",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 210,
      },
      position: { x: 250, y: 260 },
    },
    {
      data: {
        id: "twelve",
        label: "Cosine Similarity",
        faveColor: "#002966",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 110, y: 350 },
    },
    // edges
    { data: { source: "one", target: "three", label: "Weighted Interests" } },
    { data: { source: "two", target: "five", label: "Weighted Interests" } },
    { data: { source: "three", target: "four", label: "No" } },
    { data: { source: "three", target: "six", label: "Yes" } },
    { data: { source: "five", target: "four", label: "No" } },
    { data: { source: "five", target: "nine", label: "Yes" } },
    { data: { source: "four", target: "seven", label: "Keyword" } },
    { data: { source: "four", target: "eight", label: "Keyword" } },
    { data: { source: "six", target: "ten", label: "Interest Embedding" } },
    { data: { source: "seven", target: "ten", label: "Interest Embeddings" } },
    {
      data: { source: "eight", target: "eleven", label: "Keyword Embeddings" },
    },
    { data: { source: "nine", target: "eleven", label: "Keyword Embedding" } },
    {
      data: {
        source: "ten",
        target: "twelve",
        label: "Weighted avg of all Interest Embeddings",
      },
    },
    {
      data: {
        source: "eleven",
        target: "twelve",
        label: "Weighted avg of all publication Keyword Embeddings",
      },
    },
  ];
  var lessDetailFlowchart = [
    // nodes
    {
      data: {
        id: "one",
        label: "Interest Model",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 50 },
    },
    {
      data: {
        id: "two",
        label: "Semantic Scholar API",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 50 },
    },
    {
      data: {
        id: "three",
        label: "Interests",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 150 },
    },
    {
      data: {
        id: "four",
        label: "Keywords",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 150 },
    },
    {
      data: {
        id: "five",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 250 },
    },
    {
      data: {
        id: "six",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 250 },
    },
    {
      data: {
        id: "seven",
        label: "Cosine Similarity",
        faveColor: "#002966",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 110, y: 350 },
    },
    // edges
    { data: { source: "one", target: "three", label: "" } },
    { data: { source: "two", target: "four", label: "" } },
    { data: { source: "three", target: "five", label: "" } },
    { data: { source: "four", target: "six", label: "" } },
    { data: { source: "six", target: "seven", label: "" } },
    { data: { source: "five", target: "seven", label: "" } },
  ];
  // Tannaz end

  return (
    // Tannaz start

    <Accordion>
      <Card style={{ boxShadow: "none", border: "none" }}>
        <Card.Header className="d-flex justify-content-end ">
          <Accordion.Toggle
            as={Button}
            variant="link"
            eventKey="1"
            onClick={() => {
              setWhyShow(!whyShow);
              setWhatIfShow(false);
            }}
          >
            Why?
          </Accordion.Toggle>
          <div
            style={{
              width: "1px",
              height: "40px",
              backgroundColor: "#303F9F",
              marginRight: "10px",
            }}
          />
          <Accordion.Toggle
            as={Button}
            variant="link"
            eventKey="2"
            onClick={() => {
              setWhatIfShow(!whatIfShow);
              setWhyShow(false);
            }}
          >
            What-if?
          </Accordion.Toggle>
        </Card.Header>
        {/* Handling th Back button */}
        {whyShow && (
          <div className="d-flex justify-content-start ">
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              <ButtonMUI
                variant="string"
                onClick={() => {
                  setWhyShow(false);
                }}
              >
                <ArrowBackIosNewIcon color="action" fontSize="small" />
                <Typography align="center" variant="subtitle2">
                  Back
                </Typography>
              </ButtonMUI>
            </Accordion.Toggle>
          </div>
        )}
        {whatIfShow && (
          <div className="d-flex justify-content-start ">
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              <ButtonMUI
                variant="string"
                onClick={() => {
                  setWhatIfShow(false);
                }}
              >
                <ArrowBackIosNewIcon color="action" fontSize="small" />
                <Typography align="center" variant="subtitle2">
                  Back
                </Typography>
              </ButtonMUI>
            </Accordion.Toggle>
          </div>
        )}

        {/* Why visualizations */}
        <Accordion.Collapse eventKey="1" id="multiCollapseExample2">
          <Card.Body>
            <Seperator Label="Why this publication?" Width="170" />
            <Accordion>
              <Card style={{ boxShadow: "none", border: "none" }}>
                <Card.Header
                  className="d-flex justify-content-end "
                  style={{ border: "none" }}
                >
                  <Accordion.Toggle as={Button} variant="link" eventKey="3">
                    <ButtonMUI
                      variant="string"
                      onClick={() => {
                        setWhatIfShow(false);
                      }}
                    >
                      <SettingsIcon color="action" fontSize="small" />
                      <Typography align="center" variant="subtitle2">
                        How?
                      </Typography>
                    </ButtonMUI>
                  </Accordion.Toggle>
                </Card.Header>
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <div style={{ width: "90%" }}>
                        Wordcloud
                        {/* <ReplaceableCloudChart tags={props}/> */}
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      Barchart
                    </Grid>
                  </Grid>
                </div>

                {/* How Visualizations */}
                <Accordion.Collapse eventKey="3">
                  <Card.Body>
                    <Seperator Label="How the system works?" Width="200" />
                    <div className="d-flex justify-content-end ">
                      {!moreDetail ? (
                        <ButtonMUI
                          variant="string"
                          size="small"
                          onClick={() => {
                            setMoreDetail(true);
                          }}
                        >
                          <AddCircleOutlineIcon
                            color="action"
                            fontSize="small"
                          />
                          <Typography
                            align="center"
                            variant="subtitle2"
                            className="m-2 mr-4"
                          >
                            More
                          </Typography>
                        </ButtonMUI>
                      ) : (
                        <ButtonMUI
                          variant="string"
                          size="small"
                          onClick={() => {
                            setMoreDetail(false);
                          }}
                        >
                          <RemoveCircleOutlineOutlinedIcon
                            color="action"
                            fontSize="small"
                          />
                          <Typography
                            align="center"
                            variant="subtitle2"
                            className="m-2 mr-4"
                          >
                            Less
                          </Typography>
                        </ButtonMUI>
                      )}
                    </div>
                    <Grid container spacing={0}>
                      <Grid item xs={4}>
                        <div class="table-responsive-sm">
                          <table class="table">
                            <tbody>
                              <tr class="box">
                                <td class="box-item interestsBox">
                                  <Typography
                                    align="left"
                                    variant="subtitle2"
                                    className="arrowBox"
                                  >
                                    Interests
                                    <br />
                                    Keywords
                                  </Typography>
                                </td>
                              </tr>
                              <tr class="box">
                                <td class="box-item dataBox">
                                  <Typography
                                    align="left"
                                    variant="subtitle2"
                                    className="arrowBox"
                                  >
                                    Data
                                    <br />
                                    Preprocess
                                  </Typography>
                                </td>
                              </tr>
                              <tr class="box ">
                                <td class="box-item embeddingsBox">
                                  <Typography
                                    align="left"
                                    variant="subtitle2"
                                    className="arrowBox"
                                  >
                                    Embeddings
                                    <br />
                                    Generation
                                  </Typography>
                                </td>
                              </tr>
                              <tr class="box">
                                <td class="box-item similarityBox">
                                  <Typography
                                    align="left"
                                    variant="subtitle2"
                                    className="arrowBox"
                                  >
                                    Similarity
                                    <br />
                                    Calculation
                                  </Typography>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        {!moreDetail ? (
                          <Flowchart elements={lessDetailFlowchart} />
                        ) : (
                          <Flowchart elements={moreDetailFlowchart} />
                        )}
                      </Grid>
                    </Grid>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Card.Body>
        </Accordion.Collapse>

        {/* What-if visualization */}
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <Seperator Label="What-if I change?" Width="170" />
            <div>----- Visualizations What-if?</div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    // Tannaz end
  );
}
