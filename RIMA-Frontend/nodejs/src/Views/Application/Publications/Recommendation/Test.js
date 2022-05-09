import React, { Component } from "react";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";
// import SimplePopover from "./TweetAndPeople/TweetUtilities/SimplePopover";
import { handleServerErrors } from "Services/utils/errorHandler";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  DropdownMenu,
  Form,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import styled from "styled-components";
// import { calculate_percentage } from "../Twitter/TweetAndPeople/TweetUtilities/percentage";
import classnames from "classnames";
import TagSearch from "./TagSearch.js";
// import TwitterUsers from "./TweetAndPeople/TwitterUserCard/TwitterUsers.js";
// import PaperCard from "./PaperCard.js";
import RestAPI from "Services/api";
// import { COUNTRIES } from "./TweetAndPeople/countries";
// import SavedTweetCard from "./TweetAndPeople/TweetCard/SavedTweetCard";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { Spinner } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";

export default class Parent extends React.Component {

  constructor(props) {
    super(props)
        
    /* Mock sections data */
    this.sections = [
    {
      name : "Foo",
      color: "pink",
      ref : React.createRef() /* Ref per section */
    },
    {
      name : "Bar",
      color: "lightblue",
      ref : React.createRef()
    },
    {
      name : "Cat",
      color: "lightgreen",
      ref : React.createRef()
    }];
  }
  
  /* Move into parent/header */
  handleNavigate = section => {
    
    /* 
    Access the "current element" of this sections ref. 
    Treat this as the element of the div for this section.
    */
    let el = section.ref.current;
    
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: el.offsetTop
    });
  };
  
  render() {
    return (
        <div>
        <nav>
        <h2>Menu</h2>
        { 
            this.sections.map(section => 
            <button onClick={() => this.handleNavigate(section)}>
            {section.name}
            </button>)
        }
        </nav>
        <div>
        { this.sections.map(section => <Child section={section} />)}
        </div>
      </div>
    )
  }
}

class Child extends React.Component {
    render() {
    
    const { section } = this.props;
    const style = { 
        padding:"15rem 0", background : section.color 
    };
    
    return <div ref={ section.ref } style={ style }>
        Section for { section.name } 
    </div>
  }
}