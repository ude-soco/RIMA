import React, { Component } from "react";
import { DragSource, DropTarget } from "react-dnd";
import PropTypes from "prop-types";
import flow from "lodash/flow";
import ClassNames from "classnames";
import styled from "styled-components";
import TestFilter from "../Filter/TestFilter";
import {
  tagSource,
  tagTarget,
  dragSource,
  dropCollect,
} from "./DragAndDropHelper";
import { canDrag } from "./utils";
import RemoveComponent from "./RemoveComponent";
import {
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import { MdSettings } from "react-icons/md";

const ItemTypes = { TAG: "tag" };
const Toggle = styled(DropdownToggle)`
  margin: 0;
  padding: 0;
  :after {
    display: none;
  }
`;

class Tag extends Component {
  render() {
    const { props } = this;
    const label = props.tag[props.labelField];
    this.handleTagSettingsChange=this.props.handleTagSettingsChange.bind(this);
    const {
      connectDragSource,
      isDragging,
      connectDropTarget,
      readOnly,
      tag,
      classNames,
    } = props;
    // console.log({wwwwwwwwwwwwwwwwwww: this.props})
    const tagId = this.props.tag.id;
    const { className = "" } = tag;
    const tagComponent = (
      <span
        className={ClassNames("tag-wrapper", classNames.tag, className)}
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: canDrag(props) ? "move" : "auto",
          padding: "0 10px",
          paddingBottom: "5px",
          backgroundColor: tag.color
        }}
        onClick={props.onTagClicked}
        onKeyDown={props.onTagClicked}
        onTouchStart={props.onTagClicked}
      >
        <i className="fas fa-grip-vertical" style={{ color: '#FFF' }} />
        {' '}
        {label}
        <UncontrolledDropdown direction="down" setActiveFromChild>
          <Toggle
            tag="a"
            className="nav-link text-primary"
            caret
            style={{
              paddingBottom: "0px",
              marginTop: "2px",
              fontSize: "20px",
            }}
          >
            <MdSettings style={{ cursor: "pointer" }}></MdSettings>
          </Toggle>
          <TestFilter
            tagId={tagId}
            mode="tags"
            state={this.props.tag}
            changeHandler={this.handleTagSettingsChange}
            children={
              <div className="px-4">
                <div className="form-group row mb-1">
                  <label className="col col-form-label" htmlFor="n_tweets">
                    Number of tweets
                  </label>
                  <div className="col-4">
                    <input
                      type="number"
                      className="form-control "
                      onChange={(e) => this.handleTagSettingsChange(tagId, e.target.name, e.target.value)}
                      value={tag.n_tweets}
                      name="n_tweets"
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col col-form-label" htmlFor="color">
                    Color
                  </label>
                  <div className="col-4">
                    <input
                      type="color"
                      className="form-control px-0 py-0 border-0 form-control-plaintext input-nTweets "
                      onChange={(e) => this.handleTagSettingsChange(tagId, e.target.name, e.target.value)}
                      value={tag.color}
                      name="color"
                    />
                  </div>
                </div>
              </div>
            }
          /> 
        </UncontrolledDropdown>
       
        <RemoveComponent
          tag={props.tag}
          className={classNames.remove}
          removeComponent={props.removeComponent}
          onClick={props.onDelete}
          readOnly={readOnly}
        />
      </span>
    );
    return connectDragSource(connectDropTarget(tagComponent));
  }
}

Tag.propTypes = {
  labelField: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  tag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    key: PropTypes.string,
  }),
  moveTag: PropTypes.func,
  removeComponent: PropTypes.func,
  onTagClicked: PropTypes.func,
  classNames: PropTypes.object,
  readOnly: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

Tag.defaultProps = {
  labelField: "text",
  readOnly: false,
};

export default flow(
  DragSource(ItemTypes.TAG, tagSource, dragSource),
  DropTarget(ItemTypes.TAG, tagTarget, dropCollect)
)(Tag);
