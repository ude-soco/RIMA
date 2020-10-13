import React from "react";
import styled from "styled-components";
import { DropdownMenu, DropdownItem } from "reactstrap";
import { MdSave, MdRemoveCircleOutline } from "react-icons/md";

const StyledDropdownMenu = styled(DropdownMenu)`
  transform: translate3d(-140px, 50px, 0px) !important;
  padding: 0px;
  > button {
    background: none;
    width: 100% !important;
    border: none;
    padding: 15px 20px !important;
    display: flex;
    align-items: center;
    cursor: pointer;
    > span {
      font-weight: 600;
    }
    > svg {
      margin-right: 10px;
      font-size: 25px !important;
    }
  }
`;

const OptionDropDown = ({ HideHandler, saveHandler, data, saved }) => {
  return (
    <StyledDropdownMenu>
      {!saved ? (
      <DropdownItem onClick={() => saveHandler(data)}>
        <MdSave /> <span>Save Tweet</span>
      </DropdownItem>
      ) : null}
      <DropdownItem onClick={HideHandler}>
        <MdRemoveCircleOutline /> <span>{saved ? 'Delete ' : 'Hide '} Tweet</span>
      </DropdownItem>
    </StyledDropdownMenu>
  );
};

export default OptionDropDown;
