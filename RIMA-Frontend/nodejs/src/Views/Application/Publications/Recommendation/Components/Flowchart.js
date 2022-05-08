import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const layout = { name: "preset" };
const minZoom = 0.5;
const maxZoom = 1e1;

export default function Flowchart(props) {
  // start Tannaz

  const { elements, height, xStartPoint, yStartPoint } = props;

  return (
    <div style={{ display: "flex", flex: 1, height: height }}>
      <CytoscapeComponent
        cy={(cy) => {
          cy.on("resize", (_evt) => {
            cy.layout({
              name: "preset",
              spacingFactor: 1,
              avoidOverlap: true,
              fit: true,
              padding: 10,
              animate: true,
              animationDuration: 500,
            }).run();
          });
          cy.on("mouseover", "node", function (evt) {
            document.body.style.cursor = "grab";
          });

          cy.on("mouseout", "node", function (evt) {
            document.body.style.cursor = "default";
          });

          cy.on("mousedown", "node", function (evt) {
            document.body.style.cursor = "grabbing";
          });

          cy.on("mouseup", "node", function (evt) {
            document.body.style.cursor = "grab";
          });
        }}
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
        pan={{ x: xStartPoint, y: yStartPoint }}
        minZoom={minZoom}
        maxZoom={maxZoom}
      />
    </div>
    // end Tannaz
  );
}
