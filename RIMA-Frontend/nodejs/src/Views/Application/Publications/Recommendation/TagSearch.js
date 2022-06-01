import React, { useState } from "react";
import ReactTags from "../../../components/react-tags/ReactTags.js";
import "./assets/styles.css";
import { Grid } from "@material-ui/core";

export default function TagSearch(props) {
  const [state, setState] = useState({
    delimiters: [
      188, //Comma
      13, //Enter
    ],
  });
  return (
    <Grid>
      <ReactTags
        tags={props.tags}
        delimiters={state.delimiters}
        maxTags={10}
        readOnly={true}
        editable={false}
        allowUnique={false}
        outline={true}
      />
    </Grid>
  );
}
