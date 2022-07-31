/**
 * PaperCard.js - The component to display publications as a card
 * contains:
 * 1. Paper card
 * 2. Similarity Score
 * 3. Colored band (left side)
 * 4. Expansion panel for what-if local explanations and why explanation
 */
import React from "react";
import "./assets/paper_card.css";
import { Grid } from "@material-ui/core";
import ExpansionPanel from "./components/ExpansionPanel";
import PaperContent from "./components/PaperContent";

/**
 * To generate the colored band of paper card
 * @param {Object} params interests_similarity tags
 * @returns
 */
const ColoredBand = ({ interests_similarity, tags }) => {
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
            backgroundColor: (
              tags.find((t) => t.text == int) || { color: "#303F9F" }
            ).color,
            height: height + "%",
          }}
        >
          {Math.round(sim)}%
        </Grid>
      );
    }
  }
  return (
    <Grid container className="align-items-center vline">
      {res}
    </Grid>
  );
};
/**
 * @function PaperCard
 * The component to display publications as a card
 * @param {Object} props interests(Object), paper(Object), index(String), threshold(Number)
 * @returns publication card
 */
export const PaperCard = (props) => {
  const { interests: interestsTags, paper, index, threshold } = props;
  //---------------Hoda Start-----------------
  for (let p1 in paper.keywords_similarity) {
    //Foreach inseat for
    let interests = paper.keywords_similarity[p1];
    let max_score = 0;
    let max_interest = "";
    let max_interest_color = "";
    for (let p2 in interests) {
      if (p2.toLowerCase().indexOf("data_") >= 0) {
        continue;
      }
      let value = interests[p2];
      interests[p2] = {
        ...value,
        color:
          value.color ||
          props.interests.find((x) => x.text.toLowerCase() === p2.toLowerCase())
            .color,
      };
      if (max_score < value.score) {
        max_score = value.score;
        max_interest_color = value.color;
        max_interest = p2;
      }
    }
    if (max_score > 0) {
      paper.keywords_similarity[p1] = {
        ...interests,
        data_max_score: max_score,
        data_max_interest: max_interest,
        data_max_interest_color: max_interest_color,
      };
    }
  }
  //---------------Hoda end-----------------

  return (
    <Grid
      container
      className="card mt-4"
      style={{ position: "relative", border: "1px solid" }}
    >
      <>
        <ColoredBand
          interests_similarity={paper.interests_similarity}
          tags={interestsTags}
        />
        <Grid container className="card-body">
          <Grid item sm={12} style={{ padding: 10, textAlign: "justify" }}>
            <PaperContent paper={paper} />
          </Grid>
          <Grid item sm={12} style={{ padding: 20, textAlign: "justify" }}>
            <ExpansionPanel
              paper={paper}
              interests={interestsTags}
              index={index}
              threshold={threshold}
              handleApplyWhatIfChanges={props.handleApplyWhatIfChanges}
            />
          </Grid>
        </Grid>
      </>
    </Grid>
  );
};
