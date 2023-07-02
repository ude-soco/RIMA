import React, { useEffect, useState } from "react";
import "./assets/paper_card.css";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import ExpansionPanel from "./components/ExpansionPanel";
import PaperContent from "./components/PaperContent";
import { CalcMaxkeyword, getKeywordScore } from "./components/FlowChartUtil";

function ColoredBand({ interests_similarity, tags }) {
  const totalValues = Math.round(
    Object.values(interests_similarity).reduce((a, b) => a + b)
  );
  let res = [];
  for (const [int, sim] of Object.entries(interests_similarity)) {
    let height = 0;
    if (Math.round(sim) != 0) {
      height = Math.round(sim * 100) / totalValues;
      res.push(
        <Grid
          container
          className="align-items-center"
          key={int}
          style={{
            backgroundColor: tags.find((t) => t.text == int).color,
            height: height + "%",
          }}
        >
          {Math.round(sim)}%
        </Grid>
      );
      // res.push(<Row className="align-items-center" key={int} style={{  height: height + '%' }}>{Math.round(sim)}%</Row>)
    }
  }
  return (
    <Grid container className="align-items-center vline">
      {res}
    </Grid>
  );
}
export default function PaperCard(props) {
  const [state, setState] = useState({
    timer: null,
    interests: props.interests,
    // mainKewords: props.paper_keywords,
    paper: props.paper,
    index: props.index,
    threshold: props.threshold,
    paperModiText: "",
    done: false,
  });
  // Hoda Start-Calculate maximum keyword
  CalcMaxkeyword(state.paper, state.interests);
  state.paper["keyword"] = getKeywordScore(state.paper.keywords_similarity);
  // Hoda end
  useEffect(() => {
    // calculateSimilarity();
    // let modified_text = convertUnicode(text);
    let modified_text = state.paper.abstract;
    let merged = [];

    setState(() => ({
      ...state,
      paperModiText: modified_text,
      done: true,
    }));
  }, [state.done]);

  const { paper } = props;
  return (
    <Grid
      container
      className="card mt-4"
      style={{ position: "relative", border: "1px solid" }}
    >
      {state.done ? (
        <>
          {/* <ColoredBand
            interests_similarity={paper.interests_similarity}
            tags={state.interests}
          /> */}
          <Grid container className="card-body">
            <Grid
              item
              md={12}
              sm={12}
              style={{ padding: "10px", textAlign: "justify" }}
            >
              <PaperContent paper={paper} />
            </Grid>
            <Grid
              item
              md={12}
              sm={12}
              style={{ padding: "10px", textAlign: "justify" }}
            >
              <ExpansionPanel
                paper={paper}
                interests={state.interests}
                index={state.index}
                threshold={state.threshold}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <Button
          disabled
          style={{
            fontWeight: "bold",
            textTransform: "none",
            marginLeft: "5px",
            fontSize: "16px",
          }}
        >
          <CircularProgress
            style={{
              marginRight: "5px",
            }}
          />
          Calculating similarity...
        </Button>
      )}
    </Grid>
  );
}
