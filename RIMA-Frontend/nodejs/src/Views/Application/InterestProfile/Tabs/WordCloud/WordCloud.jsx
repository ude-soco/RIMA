import React from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid } from "@material-ui/core";

const WordCloud = (props) => {
  const { keywords } = props;

  const openModal = (word) => {
    console.log(`Word clicked: ${word}`);
  };

  return (
    <Grid container style={{ width: "800px" }}>
      <ReactWordcloud
        words={keywords}
        options={{
          colors: [
            "#b39ddb",
            "#7e57c2",
            "#4fc3f7",
            "#03a9f4",
            "#0288d1",
            "#01579b",
          ],
          enableTooltip: true,
          deterministic: true,
          fontFamily: "helvetica",
          fontSizes: [14, 64],
          fontStyle: "normal",
          fontWeight: "normal",
          padding: 3,
          rotations: 1,
          rotationAngles: [0, 90],
          scale: "sqrt",
          spiral: "archimedean",
          transitionDuration: 1000,
        }}
        callbacks={{
          onWordClick: (word) => openModal(word.text),
          getWordTooltip: (word) =>
            `${
              word.source === "Scholar"
                ? "Extracted from publications"
                : word.source === "Twitter"
                ? "Extracted from tweets"
                : word.source === "Manual"
                ? "Manually added"
                : "Extracted from publications & tweets"
            }`,
        }}
      />
    </Grid>
  );
};

export default WordCloud;
