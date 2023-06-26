import React from "react";
import "../assets/styles.css";
import ReactWordcloud from "react-wordcloud";
import "./TopSimilarityChart";
import { select } from "d3-selection";
import { getKeywordScore } from "./FlowChartUtil";

/**
 * Display Word cloud in the Why explanation
 * @param {object} props Component props
 * @param {object} props.keywords keywords object
 * @param {Function} props.onSelectedItem When the user select a keyword from the tag cloud, this function will be called and notify the parent component
 */
function KeywordCloud({ keywords, onSelectedItem }) {
  const simKeywords = keywords;
  keywords = getKeywordScore(simKeywords);
  const words = keywords.map((x) => ({ text: x.keyword, value: x.score }));
  const colors = keywords.map((x) => x.color);

  const options = {
    colors: colors,
    enableTooltip: false,
    deterministic: true,
    fontFamily: "Arial",
    fontSizes: [10, 30],
    fontStyle: "oblique",
    fontWeight: "normal",
    padding: 3,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  function getCallback(callback) {
    return function (word, event) {
      const isActive = callback !== "onWordMouseOut";
      const element = event.target;
      const text = select(element);
      let defaultFontSize = text.attr("data-default-font-size");
      if (!defaultFontSize) {
        defaultFontSize = text.attr("font-size");
        text.attr("data-default-font-size", defaultFontSize);
      }
      const hoverFontSize =
        (Number.parseInt(defaultFontSize.replace("px", "")) * 1.5).toString() +
        "px";
      const actualFontSize = isActive ? hoverFontSize : defaultFontSize;
      text.transition().attr("font-size", actualFontSize);

      if (isActive) {
        if (!!onSelectedItem) onSelectedItem(word.text, simKeywords[word.text]);
      } else {
        if (!!onSelectedItem) onSelectedItem(null, null);
      }
    };
  }

  const callbacks = {
    getWordColor: (word) => keywords.find((x) => x.keyword === word.text).color,
    getWordTooltip: (word) =>
      `Similarity Score: ${Math.round(word.value * 100) / 100}`,
    onWordMouseOut: getCallback("onWordMouseOut"),
    onWordMouseOver: getCallback("onWordMouseOver"),
  };

  return (
    <ReactWordcloud callbacks={callbacks} options={options} words={words} />
  );
}

export default KeywordCloud;
