import React, {useEffect} from "react";
import {
  MdErrorOutline,
  MdHighlightOff,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { Spinner } from "reactstrap";
import styled from "styled-components";
import ReactWordcloud from "react-wordcloud";
import RestAPI from "Services/api";
import routes from "Routing/routes";
import { handleServerErrors } from "Services/utils/errorHandler";
import './style.css';
import ReactTooltip from "react-tooltip";

const PopOver = styled.div`
  .popover__title {
    font-size: 24px;
    line-height: 36px;
    text-decoration: none;
    color: rgb(228, 68, 68);
    text-align: center;
    padding: 15px 0;
  }
  .popover__wrapper {
    position: relative;
    margin-top: 1.5rem;
    display: inline-block;
  }
  .popover__content,
  .popover__content--more,
  .popover__content--more1 {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: -340px;
    top: 60px;
    transform: translate(0, 10px);
    background-color: white;
    border: 3px solid #bfbfbf;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    width: 400px;
  }
  .popover__content:before,
  .popover__content--more:before,
  .popover__content--more1:before {
    position: absolute;
    z-index: -1;
    content: "";
    right: calc(50% - 165px);
    top: -12px;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #bfbfbf transparent;
    transition-duration: 0.3s;
    transition-property: transform;
  }
  .popover__content--more {
    z-index: 10;
    opacity: 1;
    visibility: ${(props) => (props.more === true ? "visible" : "hidden")};
    transform: translate(0, -20px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
  }
  .popover__content--more1 {
    z-index: 10;
    opacity: 1;
    visibility: ${(props) => (props.more1 === true ? "visible" : "hidden")};
    transform: translate(0, -20px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
  }
  .popover__content {
    z-index: 10;
    opacity: 1;
    visibility: ${(props) => (props.popeover === true ? "visible" : "hidden")};
    transform: translate(0, -20px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
  }
  .popover__message {
    text-align: center;
  }
  .info__inner--div {
    background: #bfbfbf;
    padding: 10px 20px;
  }
  .color--green {
    color: green;
  }
  .color--blue {
    color: blue;
  }
`;
const StyledSpinner = styled(Spinner)`
  width: 3rem;
  height: 3rem;
  margin: auto;
  display: block;
`;
const StyledTabel = styled.table`
  thead th {
    color: white;
    font-weight: bold;
    font-size: 14px;
    width: 25%;
    border: 2px solid grey;
    text-align: center;
    height: 25px;
  }
  tbody td {
    color: black;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
`;

const TweetInfoOption = (props) => {
  const [popeover, setpopeover] = React.useState(false);
  const [more, setmore] = React.useState(false);
  const [more1, setmore1] = React.useState(false);
  const [state, setState] = React.useState(null);
  const [zoom, setZoom] = React.useState(0);
  const [similarityKeyword, setsimilarityKeyword] = React.useState([]);

  const [similarKeywords, setSimilarKeywords] = React.useState(false);
  const { tags } = props;
  const words = tags.map((item) => ({
    id: item.id,
    text: item.text,
    value: item.weight,
    color: item.color,
    weight: item.weight,
  }));

  // useEffect(() => {
    // Code comes here
  // }, )

  function keywordExtractedfromtweet() {
    let data = {
      num_of_keywords: props.weight,
      // wiki_filter: this.state.wiki,
      text: props.text.trim(),
      algorithm: "TopicRank",
    };
    RestAPI.interestExtract(data)
      .then((response) => {
        let keys = Object.keys(response.data);
        let value = Object.values(response.data);
        let keywordArray = [];

        for (let i = 0; i < keys.length; i++) {
          keywordArray.push({
            text: keys[i],
            value: value[i],
          });
        }
        setState({
          keywordArray,
        });
        // setState({
        //   wordArray: keywordArray,
        // });
      })
      .catch((error) => {
        console.log("err", error);
        // this.setState({ isDemoLoader: false });
        // handleServerErrors(error, toast.error);
      });
  }
  function setkeywordsimilarities(tweetKeyword) {
    let keywords = [];
    let keyword = "";
    let similarKey = [];
    if (state !== null) {
      state.keywordArray.forEach((item, index) => {
        RestAPI.computeSimilarity({
          keywords_1: [tweetKeyword],
          keywords_2: [item.text],
          algorithm: "WordEmbedding",
        })
          .then((response) => {
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
            similarKey.push({
              score: response.data.score,
              text: item.text,
            });
            setsimilarityKeyword(similarKey);
          })
          .catch((error) => {
            console.log("err", error);
            // this.setState({ isDemoLoader: false });
            // handleServerErrors(error, toast.error);
          });
      });
    } else {
      console.log("not Running");
    }
    tags.map((tag) => {
      if (tag["id"] === props.tag) {
        keyword = tag["text"];
      } else keywords.push(tag.text);
    });
    let k2 = [keyword];
    // keywords.map(k => k2.push(keyword));
  }

  function openInfoAboutTweet() {
    // let keyword = props.tags.map((value, index) => {
    //   if (value.id === params) {
    //     return value.text;
    //   }
    // });

    setpopeover(true);
    keywordExtractedfromtweet();
  }

  function clickhandler(params) {
    setpopeover(false);
    setmore(true);
    setmore1(false);
  }
  function clickhandlermore(params) {
    let keyword = props.tags.filter((value) => {
      return value.id === params;
    })[0].text;
    if (state !== null && keyword) {
      setkeywordsimilarities(keyword);
    }
    setpopeover(false);
    setmore(false);
    setmore1(true);
  }
  function crossHandler(params) {
    setpopeover(false);
    setmore(false);
    setmore1(false);
  }
  // function onChangeZoom({ target: { name, value } }) {
  //   console.log(name, value);
  //   this.setState({ [name]: value });
  // }
  const lowercaseText = props.text.toLowerCase();
  const options = {
    // colors,
    enableTooltip: true,
    deterministic: true,
    fontFamily: "times new roman",
    fontSizes: [10, 30],
    fontStyle: "normal",
    fontWeight: "normal",
    textAnchor: 'middle',
    padding: 3,
    rotations: 2,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 3,
  }

  const onChangeZoom = ({ target: { value } }) => {
    setZoom(value);
  }

  const onAddZoom = () => {
    if (zoom >= 20) {
      setZoom(20);
    } else {
      setZoom(Number(zoom) + 5);
    }
  }

  const onRemoveZoom = () => {
    if (zoom <= 0) {
      setZoom(0)
    } else {
      setZoom(Number(zoom) - 5)
    }
  }

  options.fontSizes = [10 + Number(zoom), 35 + Number(zoom)]


  return (
    <PopOver popeover={popeover} more={more} more1={more1}>
      <div className="popover__wrapper">
        <span
          className="cursor--pointer"
          style={{
            fontSize: "18px",
            color: "rgb(17, 137, 239)",
          }}
          onClick={openInfoAboutTweet}
          >
          Why?
        </span>
        
        <div className="popover__content">
          <MdHighlightOff
            style={{
              fontSize: "30px",
            }}
            className="cursor--pointer"
            onClick={crossHandler}
          />

          <h3>Why I get this tweets?</h3>
          <h3>Because this tweet related to your interest</h3>
          <div className="info__inner--div">
            {state !== null ? (
              <>
              <ReactWordcloud
                words={words}
                options={options}
                callbacks = {{
                  getWordTooltip: (word) => `weight: ${word.value}`,
                  getWordColor: word => word.id === props.tag ? word.color : '#000',
                }}
              />
              </>
            ) : (
              <>
                <StyledSpinner color="primary" />
                <h5 className="text-center">Loading...</h5>
              </>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <MdRemoveCircleOutline onClick={onRemoveZoom} />
                <input type="range" min="1" max="20" name="zoom" value={zoom} onChange={onChangeZoom} />
              <MdAddCircleOutline onClick={onAddZoom} />
            </div>
            {state !== null ? (
              <span
                className="cursor--pointer color--blue"
                onClick={() => clickhandlermore(props.tag)}
              >
                More
              </span>
            ) : null}
          </div>
        </div>
        <div className="popover__content--more1">
          <MdHighlightOff
            style={{
              fontSize: "30px",
            }}
            className="cursor--pointer"
            onClick={crossHandler}
          />

          <h3>Why I get this tweets?</h3>
          <h3>Because the extracted keywords from this tweet related to your interest</h3>
          <div className="info__inner--div">
            {state === null ? (
              <h2>No Keyword extract</h2>
            ) : (
              <>
              <ReactWordcloud
              words={state.keywordArray}
              options={options}
              callbacks = {{
                getWordTooltip: (word) => `${word.text}`,
                getWordColor: () => '#000',
              }}
              />
              </>
              // state.keywordArray.map((value, index) => (
              //   <h4
              //     title={`weight : ` + value.value}
              //     style={{
              //       fontSize: `${10 + value.value}px`,
              //     }}
              //   >
              //     {value.text}
              //   </h4>
              // ))
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
            <MdRemoveCircleOutline onClick={onRemoveZoom} />
                <input type="range" min="1" max="20" name="zoom" value={zoom} onChange={onChangeZoom} />
              <MdAddCircleOutline onClick={onAddZoom} />
            </div>
            {similarityKeyword.length !== 0 ? (
              <span
                className="cursor--pointer color--blue"
                onClick={clickhandler}
              >
                More
              </span>
            ) : null}
          </div>
        </div>
        <div className="popover__content--more">
          <MdHighlightOff
            style={{
              fontSize: "30px",
            }}
            className="cursor--pointer"
            onClick={crossHandler}
          />
          <div className="m-2">
            <h3>
              The relationship between the intrest keyword , and the extract
              keyword from tweet
            </h3>
            {tags.map((value, Index) => {
              if (value.id === props.tag) {
                return (
                  <h2>
                    <span>Interest Keyword :</span>
                    <span
                      style={{
                        color: `${value.color}`,
                      }}
                    >
                      {value.text}
                    </span>
                  </h2>
                );
              }
            })}
          </div>

          <div className="m-3"></div>
          <div className="table--div">
            {similarityKeyword.length === state?.keywordArray.length
              ? similarityKeyword.map((value) => (
                <div class="table--div1">
                  <h3>{value.score}{' '}%</h3>
                  <h5>{value.text}</h5>
                </div>
              ))
            : null}
            {/* <StyledTabel border="1" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {similarityKeyword.length === state?.keywordArray.length
                    ? similarityKeyword.map((value, index) => (
                        <th style={{ background: "#203864" }}>{value.score}</th>
                      ))
                    : null}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {similarityKeyword.length === state?.keywordArray.length
                    ? similarityKeyword.map((value, index) => (
                        <td>{value.text}</td>
                      ))
                    : null}
                </tr>
              </tbody>
            </StyledTabel> */}
          </div>
        </div>
      </div>
    </PopOver>
  );
};

export default TweetInfoOption;
