import React, { Component } from "react";
import ReactTags from "../../../components/react-tags/ReactTags.js";
import "./assets/styles.css";
import { Grid } from "@material-ui/core";



class TagSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delimiters: [
        188, //Comma
        13, //Enter
      ],
    }
  }

  render() {
    const { tags,  newTags } = this.props;
    return (
      <Grid>
        
        <ReactTags
          tags={newTags && newTags.length ? newTags : tags}
          delimiters={this.delimiters}
          maxTags={10}
          readOnly={true}
          editable={false}
          allowUnique={false}
          outline={true}
        />
      </Grid>
    );
  }
}

export default TagSearch;
