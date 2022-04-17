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
import { UncontrolledDropdown, DropdownToggle } from "reactstrap";
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
    const {
      connectDragSource,
      isDragging,
      connectDropTarget,
      readOnly,
      tag,
      classNames,
      outline = false
    } = props;
    const tagId = this.props.tag.id;
    const { className = "" } = tag;
    const tagIcon = !readOnly ? <i className="fas fa-grip-vertical" style={{ color: "#FFF" }} /> : '';
    const tagComponent = outline?
    <span
        className={ClassNames("tag-wrapper", classNames.tag, className)}
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: canDrag(props) ? "move" : "auto",
          padding: "5px 10px",
          backgroundColor: 'white',
          borderRadius: "10px",
          borderColor:tag.color,
          color:tag.color
        }}
        onClick={props.onTagClicked}
        onKeyDown={props.onTagClicked}
        onTouchStart={props.onTagClicked}
      >
        {tagIcon} {label}

      </span>
    :
    (
      <span
        className={ClassNames("tag-wrapper", classNames.tag, className)}
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: canDrag(props) ? "move" : "auto",
          padding: "5px 10px",
          backgroundColor: tag.color,
          borderRadius: "4px",
        }}
        onClick={props.onTagClicked}
        onKeyDown={props.onTagClicked}
        onTouchStart={props.onTagClicked}
      >
        {tagIcon} {label}

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
