/**
 * TagSearch.js - The component interests with their colors
 */
import React from "react";
import ReactTags from "../../../components/react-tags/ReactTags.js";
import "./assets/styles.css";
import { Grid } from "@material-ui/core";

/**
 * @function TagSearch
 * The component interests with their colors
 * @param {Object} props tags - the interests model
 * @returns A list of colored interests
 */
export const TagSearch = (props) => {
  const delimiters = [
    188, //Comma
    13, //Enter
  ];
  return (
    <Grid>
      <ReactTags
        tags={props.tags}
        delimiters={delimiters}
        maxTags={10}
        readOnly={true}
        editable={false}
        allowUnique={false}
        outline={true}
      />
    </Grid>
  );
};
