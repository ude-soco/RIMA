import React, { Component } from "react";
import ReactTags from "../react-tags/ReactTags.js";
import "./styles.css";

class TagSearch extends React.Component {
  constructor(props) {
    super(props);

    this.delimiters = this.props.delimiters;
    this.handleDelete = this.props.handleDelete.bind(this);
    this.handleAddition = this.props.handleAddition.bind(this);
    this.handleDrag = this.props.handleDrag.bind(this);
    this.handleTagSettingsChange = this.props.handleTagSettingsChange.bind(this);
  }

  render() {
    const { tags, suggestions, newTags } = this.props;
    console.log('tags 222222222222 ', tags)

    return (
      <div>
        <ReactTags
          tags={newTags && newTags.length ? newTags : tags}
          suggestions={suggestions}
          delimiters={this.delimiters}
          maxTags={10}
          readOnly={false}
          editable={true}
          allowUnique={false}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          handleTagSettingsChange={this.handleTagSettingsChange}
        />
      </div>
    );
  }
}

export default TagSearch;
