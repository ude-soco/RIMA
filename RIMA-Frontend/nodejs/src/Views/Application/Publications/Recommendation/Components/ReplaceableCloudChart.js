import React, {Component, Fragment, useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
// import RestAPI from "Services/api";

import "d3-transition";

import {handleServerErrors} from "Services/utils/errorHandler";

import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import {TwitterTweetEmbed} from "react-twitter-embed";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faTimes} from "@fortawesome/free-solid-svg-icons";


import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import ReactWordcloud from "react-wordcloud";
import {Tab, Tabs} from "react-bootstrap";

const options = {
  colors: ["#aab5f0", "#99ccee", "#a0ddff", "#00ccff", "#00ccff", "#90c5f0"],
  enableTooltip: true,
  deterministic: true,
  fontFamily: "arial",
  fontSizes: [15, 60],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 3,
  rotations: 1,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};


export default class ReplaceableCloudChart extends Component {
  constructor(props) {
    var wordArrayJSON = JSON.stringify(props.tags);
    wordArrayJSON = wordArrayJSON.replace("\"weight\":", "\"value\":");
    console.log(wordArrayJSON)

        

    super(props);
    this.state = {
      mydata: [],
      wordArray: [
        {     
          text: "Learning Analytics",
          value: 5
        },{     
          text: "Personalization",
          value: 3
        },{     
          text: "Machine learning",
          value: 4
        },{     
          text: "Abcdef",
          value: 4
        },
      ],
      isData: true,

    };
  }


  componentDidMount() {
    // this.setState({isLoding: true}, () => {
    //   RestAPI.longTermInterest(this.props.user)
    //     .then((response) => {
    //       let keywordArray = [];
    //       for (let i = 0; i < response.data.length; i++) {
    //         keywordArray.push({
    //           text: response.data[i].keyword,
    //           value: response.data[i].weight,
    //           tweet_ids: response.data[i].tweet_ids,
    //           papers: response.data[i].papers,
    //           source: response.data[i].source,
    //           original_keyword: response.data[i].original_keyword,
    //           original_keywords: response.data[i].original_keywords || [],
    //         });
    //       }
    //       if (response.data.length === 0) {
    //         this.setState({
    //           isData: false,
    //         });
    //       }
    //       this.setState({
    //         isLoding: false,
    //         wordArray: keywordArray,
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({isLoding: false});
    //       handleServerErrors(error, toast.error);
    //     });
    // });


  }

  // getMarkedAbstract = (text, words) => {
  //   if (!words) {
  //     return text;
  //   }
  //   words = JSON.parse(JSON.stringify(words))
  //   words.sort(word => word.length);
  //   words.reverse();
  //   text = text || "";
  //   for (let index = 0; index < words.length; index++) {
  //     let word = words[index];
  //     let regExp = new RegExp(word, "ig");
  //     text = text.replace(regExp, `<mark>${word}</mark>`);
  //   }
  //   return text;
  // };

  // getCallback = (callback) => {
  //   let reactRef = this;
  //   return function (word, event) {
  //     reactRef.setState({
  //       modal: true,
  //       isModalLoader: true,
  //       isManualData: false,
  //     });

  //     if (word.tweet_ids) {
  //       reactRef.setState({
  //         isTweetData: true,
  //         tweetIds: word.tweet_ids,
  //         weight: word.value,
  //         original_keyword_tweet: word.original_keyword,
  //         original_keywords_tweet: word.original_keywords,

  //         /*           original_keyword: word.original_keyword,
  //                    original_keywords: word.original_keywords, */
  //       });
  //       if (word.tweet_ids.length === 0) {
  //         reactRef.setState({
  //           isTweetData: false,
  //         });
  //       }
  //     }
  //     if (word.papers) {
  //       reactRef.setState({
  //         isPaperData: true,
  //         // tabSelection: "publications",
  //         userPageIDs: word.papers,
  //         papercount: word.papers.length,
  //         word: word.text,
  //         weight: word.value,
  //         original_keyword: word.original_keyword,
  //         original_keywords: word.original_keywords,
  //       });

  //       if (word.papers.length === 0) {
  //         reactRef.setState({
  //           isPaperData: false,
  //           // tabSelection: "tweet",
  //         });
  //       }

  //       if (word.source == "Scholar") {
  //         reactRef.setState({
  //           tabSelection: "publications",
  //         })
  //       } else if (word.source == "Twitter") {
  //         reactRef.setState({
  //           tabSelection: "tweet",
  //         });
  //       }
  //     }
  //     if (word.source == "Manual") {
  //       reactRef.setState({
  //         isManualData: true,
  //       });
  //     }
  //     reactRef.setState({
  //       isModalLoader: false,
  //     });
  //     let str = word.papers.abstract;
  //     let res = str;
  //   };

  // };

  // toggle = (id) => {
  //   this.setState({
  //     modal: !this.state.modal,
  //   });
  // };

  // handleTabSelection = (value) => {
  //   this.setState({
  //     tabSelection: value,
  //   })
  // }

  render() {
    return (
      <>
        {this.state.isLoding ? (
          <div className="text-center" style={{padding: "20px"}}>
            <Loader type="Puff" color="#00BFFF" height={100} width={100}/>
          </div>
        ) : this.state.isData ? (
          <>
            <div style={{height: "350px", width: "100%", marginTop:"30px", marginBottom:"10px"}}>
              <ReactWordcloud
                options={options}
                words={this.state.wordArray}
              />
            </div>
          </>
        ) : (
          // <div id="chartdiv" style={{ width: "100%", height: "1000px" }}></div>
          <div style={{textAlign: "center"}}>No Data Found</div>
        )}

      </>
    );
  }
}
