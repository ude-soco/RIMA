import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const layout = { name: "preset" };
const initialPos = { x: 550, y: 0 };
const minZoom = 0;
const maxZoom = 4;

export default function Flowchart(props) {
  // start Tannaz

  const { elements, height } = props;

  return (
    <div style={{ display: "flex", flex: 1, height: height }}>
      <CytoscapeComponent
        elements={elements}
        style={{
          width: "100%",
          height: "100%",
          border: "0.5px solid #E7E7E7",
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "rgba(255, 255, 255, 0)",

              width: "data(width)",
              height: 40,
              "text-background-opacity": 0,
              "text-background-padding": "2px",
              "border-color": "data(faveColor)",
              "border-style": "solid",
              "border-width": 2,
              "border-opacity": 1,
              shape: "data(shape)",
            },
          },
          {
            selector: "node[label]",
            style: {
              label: "data(label)",
              "font-size": "13",
              color: "data(faveColor)",
              "text-halign": "center",
              "text-valign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              width: 1.5,
            },
          },
          {
            selector: "edge[label]",
            style: {
              label: "data(label)",
              "font-size": "12",

              "text-background-color": "white",
              "text-background-opacity": 1,
              "text-background-padding": "2px",

              // "text-rotation": "autorotate"
            },
          },
        ]}
        layout={layout}
        pan={initialPos}
        minZoom={minZoom}
        maxZoom={maxZoom}
      />
    </div>
    // end Tannaz
  );
}
