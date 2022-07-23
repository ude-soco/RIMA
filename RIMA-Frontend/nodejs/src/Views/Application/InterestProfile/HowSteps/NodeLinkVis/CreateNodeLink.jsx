import React from "react";

import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import "./styles.css";
import {Box} from "@material-ui/core";


function getNodesReal(data, x, y, step4) {
  //data = data.slice(0,5)
  let elements = [];
  let idSource = 1;
  let idTarget = -1;
  let yTarget = y;
  let xTarget = x + 550;
  let element = {
    data: {id: idSource, label: "Extracted Keywords"},
    classes: ["target", "header"],
    position: {x: x, y: y}
  };

  elements.push(element);

  if (step4) {
    element = {
      data: {id: idTarget, label: "Finalized Keywords"},
      classes: ["source", "header"],
      position: {x: xTarget, y: yTarget}
    };
    elements.push(element);

    idTarget = idTarget - 1;
    yTarget = yTarget + 75;
  }

  idSource = idSource + 1;
  y = y + 75;
  let numKeywords = 0

  data.map((d) => {

    let label = d.text;
    let tooltipSource =
      "This keyword was extracted using the following papers: ";
    let tooltipTarget =
      "";
    label = label.concat(" (", d.value, ")");
    d.papers.map((p) => {
      tooltipSource = tooltipSource.concat(" </br> </br> ", p.title);
    });

    if (d.source !== "Manual" && numKeywords < 5) {
      numKeywords = numKeywords + 1
      let numOriginalKeywords = 0;

      d.originalKeywordsWithWeights.map((k) => {
        numOriginalKeywords = numOriginalKeywords + 1;
        let labelSource = Object.keys(k)[0];
        tooltipTarget = tooltipTarget.concat("</br>", labelSource);
        labelSource = labelSource.concat(" (", k[labelSource], ")");

        let source = {
          data: {id: idSource, label: labelSource, tooltip: tooltipSource},
          classes: ["multiline", "source"],
          position: {x: x, y: y}
        };
        let edge = {
          data: {target: idTarget, source: idSource},
          classes: ["edge"]
        };
        if (numOriginalKeywords > 1) {
          yTarget = yTarget + 35;
        }

        y = y + 75;
        if (step4) {
          elements.push(edge);
        }
        elements.push(source);

        idSource = idSource + 1;
      });
      let tooltipFinalTarget = ""
      if (numOriginalKeywords > 1) {
        tooltipFinalTarget = "This interest is created by merging the following keywords due to a high similarity:"
        tooltipFinalTarget = tooltipFinalTarget.concat(tooltipTarget)
      } else {
        tooltipFinalTarget =
          tooltipFinalTarget = tooltipFinalTarget.concat("This interest is created by keeping the original interest:", tooltipTarget)

      }

      let target = {
        data: {id: idTarget, label: label, tooltip: tooltipFinalTarget},
        classes: ["multiline", "target"],
        position: {x: xTarget, y: yTarget}
      };
      if (step4) {
        elements.push(target);
      }
      if (numOriginalKeywords > 1) {
        yTarget = yTarget + 40;
      }
      yTarget = yTarget + 75;
      idTarget = idTarget - 1;

    }


  });
  return elements;
}

const CreateNodeLink = (props) => {
  const {data, step4} = props;
  const elements = getNodesReal(data, 25, 75, step4);

  return (
    <Box>
      <CytoscapeComponent
        elements={elements}
        style={{width: "100%", height: "58vh"}}
        layout={{name: "preset"}}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              shape: "round-rectangle",
              "background-color": "rgba(255, 255, 255, 0)",
              "border-color": "#a4a4a4",
              "border-width": 2,
              width: getWidth,
              height: "50px",
              "text-valign": "center",
              "text-halign": "center"
            }
          },
          {
            selector: ".header",
            style: {
              "border-width": 0,
              "font-weight": "bold"
            }
          },
          {
            selector: "edge",
            style: {
              width: 3,
              // label: "data(label)",
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier"
            }
          }
        ]}
        cy={(cy) => {
          // cy.userZoomingEnabled(false);
          cytoscape.use(popper);
          cy.fit();
          cy.elements().unbind("mouseover");
          cy.elements().bind("mouseover", (event) => {
            if (event.target._private.data.tooltip != undefined) {
              event.target.popperRefObj = event.target.popper({
                content: () => {
                  let content = document.createElement("div");

                  content.classList.add("popper-div");

                  content.innerHTML = event.target._private.data.tooltip;

                  document.body.appendChild(content);
                  return content;
                }
              });
            }
          });

          cy.elements().unbind("mouseout");
          cy.elements().bind("mouseout", (event) => {
            if (event.target._private.data.tooltip != undefined) {
              if (event.target.popper) {
                event.target.popperRefObj.state.elements.popper.remove();
                event.target.popperRefObj.destroy();
                // document.body.appendChild(content);
              }
            }
          });
        }}
      />
    </Box>
  );
};

function getWidth(node) {
  const ctx = document.createElement("canvas").getContext("2d");
  const fStyle = node.pstyle("font-style").strValue;
  const size = node.pstyle("font-size").pfValue + "px";
  const family = node.pstyle("font-family").strValue;
  const weight = node.pstyle("font-weight").strValue;
  ctx.font = fStyle + " " + weight + " " + size + " " + family;

  // For multiple lines, evaluate the width of the largest line
  const lines = node.data("label").split("\n");
  const lengths = lines.map((a) => a.length);
  const max_line = lengths.indexOf(Math.max(...lengths));

  // User-defined padding
  const padding = 20;

  return ctx.measureText(lines[max_line]).width + padding;
}

export default CreateNodeLink;
