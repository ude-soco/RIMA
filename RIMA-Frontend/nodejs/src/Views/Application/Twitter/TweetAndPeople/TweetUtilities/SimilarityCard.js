import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    margin: " 20 20px",
    Width: 175,
  },
  title: {
    fontSize: 12,
  },
  pos: {
    marginBottom: 5,
  },
});

export default function SimpleCard(props) {
  let similarityNew = [];
  for (let tweet of props.newTweets) {
    similarityNew.push(tweet.score);
  }
  const max = Math.max.apply(null, similarityNew);
  const min = Math.min.apply(null, similarityNew);
  const classes = useStyles();

  return (
    <Box style={{ marginLeft: 350, fontWeight: "bold" }}>
      <Typography
        color="textSecondary"
        gutterBottom
        component="h2"
        variant="button"
        style={{ fontWeight: "bold" }}
      >
        After changes:
      </Typography>

      <Typography variant="p" component="h5">
        Max Similarity: {max}%
      </Typography>

      <Typography variant="p" component="h5">
        Min Similarity: {min}%
      </Typography>
    </Box>
  );
}
