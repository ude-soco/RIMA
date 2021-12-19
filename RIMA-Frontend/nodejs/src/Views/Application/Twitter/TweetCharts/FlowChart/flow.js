import React, { useEffect, useState } from "react";
import MermaidChart from "./MermaidChart";
import "./style.css";
export default function App(props) {
  const [state, setState] = useState({
    xkeywords: [],
    noWeightXKeywords: [],
    ykeywords: [],
    nospaceYKeywords: [],
    score: null,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      score: props.score,
      xkeywords: props.series
        ? props.series.map((xkwrd) => xkwrd.name + ": " + xkwrd.weight)
        : null,
      noWeightXKeywords: props.series
        ? props.series.map((xkwrd) => xkwrd.name)
        : null,

      ykeywords: props.series
        ? props.series[0].data.map((ykwrd) => ykwrd.x)
        : null,
      nospaceYKeywords: props.series
        ? props.series[0].data.map((ykwrd) => ykwrd.x)
        : null,
      score: props.score ? props.score : null,
    }));
  }, [props]);

  function newLineBytwoSteps(newArray) {
    if (newArray.length > 1) {
      for (let i = 1; i < newArray.length; i += 3) {
        newArray[i] = newArray[i] + "<br />";
      }
    }
    return newArray;
  }

  function findkeyphrases(dataArray) {
    let keys = [];

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].includes(" ")) {
        keys.push(dataArray[i]);
      }
    }
    if (keys.length > 1) {
      for (let i = 0; i < keys.length; i += 2) {
        keys[i] = keys[i] + "<br />";
      }
    }
    console.log(keys, "kind keyphrase");
    return keys;
  }

  function findkeywords(dataArray) {
    let keys = [];
    for (let i = 0; i < dataArray.length; i++) {
      if (!dataArray[i].includes(" ")) {
        keys.push(dataArray[i]);
      }
    }
    if (keys.length > 1) {
      for (let i = 0; i < keys.length; i += 2) {
        keys[i] = keys[i] + "<br />";
      }
    }
    return keys;
  }

  return (
    <div className="App">
      {state.xkeywords.length ? (
        <>
          {state.xkeywords.length ? (
            <MermaidChart
              chart={`graph TD;
              
              A[${
                newLineBytwoSteps(state.xkeywords).length
                  ? newLineBytwoSteps(state.xkeywords)
                  : "none"
              }] -->|Weighted Interest| B{Interest}
              
              style A fill:#d5e8d4, stroke:#bee4bc,stroke-width:1px
              style B fill:#d5e8d4, stroke:#bee4bc,stroke-width:1px 
              B-->|Keyword| D[${
                findkeywords(state.noWeightXKeywords).length
                  ? findkeywords(state.noWeightXKeywords)
                  : "none"
              }]
              style D fill:#ffe6cc, stroke:#f4d0aa,stroke-width:1px
              B-->|Keyphrase| E[${
                findkeyphrases(state.noWeightXKeywords).length
                  ? findkeyphrases(state.noWeightXKeywords)
                  : "none"
              }]
              style E fill:#ffe6cc, stroke:#f4d0aa,stroke-width:1px
              D--> |Word Embedding| F[Interest Embedding]
              style F fill:#d5e8d4, stroke:#bee4bc,stroke-width:1px
              E--> |Word Embedding| F[Interest Embedding]
              
              F--> |Interest Model Embedding| G[Similarity score: ${
                state.score
              }%]
              style F fill:#d5e8d4, stroke:#bee4bc,stroke-width:4px
              AA[${
                state.ykeywords.length
                  ? newLineBytwoSteps(state.ykeywords)
                  : "none"
              }] -->|Weighted Keyword| BB{Tweet </br>keyword}
              style BB fill:#dae8fc, stroke:#c5dcfc,stroke-width:1px
              style AA fill:#dae8fc, stroke:#c5dcfc,stroke-width:1px
              BB-->|Keyword| DD[${
                findkeywords(state.nospaceYKeywords).length
                  ? findkeywords(state.nospaceYKeywords)
                  : "none"
              }]
              style DD fill:#ffe6cc, stroke:#f4d0aa,stroke-width:1px
              BB-->|Keyphrase| EE[${
                findkeyphrases(state.nospaceYKeywords).length
                  ? findkeyphrases(state.nospaceYKeywords)
                  : "none"
              }]
              style EE fill:#ffe6cc, stroke:#f4d0aa,stroke-width:1px
              DD--> |Word Embedding| FF[Tweet Embedding]
              
              EE--> |Word Embedding| FF[Tweet Embedding]
              style FF fill:#dae8fc, stroke:#c5dcfc,stroke-width:1px
              FF--> |Tweet Embedding| G[Similarity score: ${state.score} %];
              style G fill:#ffe186, stroke:#f9d25b,stroke-width:1px
            `}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
