import React from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import popper from "cytoscape-popper";
import { getMaxWidthHeight, getHeight, getWidth } from "./FlowChartUtil";
cytoscape.use(popper);

const minZoom = 0.3;
const maxZoom = 1e1;

// Hoda start
//
let activeTimeout = {};
/**
 * Refresh layout after 300ms and ignore the previous call during this time
 * @param {string} key a unique name of a flowchart componet
 * @param {CytoscapeComponent} cy Flowchart component
 * @param {object} layout  layout object
 */
function refreshLayout(key, cy, layout) {
  if (!!activeTimeout[key]) {
    // Clear previous task, if it didn't run during 300ms
    clearTimeout(activeTimeout[key]);
    activeTimeout[key] = undefined;
  }
  //Run the refresh layout after 300ms
  activeTimeout[key] = setTimeout(() => {
    cy.layout(layout).run();
  }, 300);
}
// Hoda end
{
  /*-----Tannaz-start---*/
}
export default function Flowchart(props) {
  // defining the default layout
  const { keyChart, elements, height, xStartPoint, yStartPoint, style } = props;
  const layout = props.layout || {
    name: "preset",
    spacingFactor: 1,
    avoidOverlap: true,
    fit: true,
    padding: 10,
    animate: true,
    animationDuration: 500,
  };
  return (
    <div
      style={{ display: "flex", flex: 1, height: height, maxWidth: "1000px" }}
    >
      <CytoscapeComponent
        cy={(cy) => {
          cy.on("resize", (_evt) => {
            refreshLayout(keyChart, cy, layout);
          });
          // Tooltip start
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
                },
              });
            }
          });

          cy.elements().unbind("mouseout");
          cy.elements().bind("mouseout", (event) => {
            if (event.target._private.data.tooltip != undefined) {
              if (event.target.popper) {
                event.target.popperRefObj.state.elements.popper.remove();
                event.target.popperRefObj.destroy();
              }
            }
          });
          // Tooltip end
          // Event handler for the mouse curser start
          cy.on("mouseover", function (evt) {
            let evtTarget = evt.target;

            if (evtTarget === cy) {
              document.body.style.cursor = "move";
            } else {
              document.body.style.cursor = "default";
            }
          });
          cy.on("mousemove", function (evt) {
            let evtTarget = evt.target;

            if (evtTarget === cy) {
              document.body.style.cursor = "move";
            } else {
              document.body.style.cursor = "default";
            }
          });
          cy.on("mouseout", function (evt) {
            document.body.style.cursor = "default";
          });

          cy.on("mousedown", function (evt) {
            let evtTarget = evt.target;

            if (evtTarget === cy) {
              document.body.style.cursor = "move";
            } else {
              document.body.style.cursor = "not-allowed";
            }
          });

          cy.on("mouseup", function (evt) {
            let evtTarget = evt.target;

            if (evtTarget === cy) {
              document.body.style.cursor = "move";
            } else {
              document.body.style.cursor = "default";
            }
          });
          // Event handler for the mouse curser end

          cy.on("add remove", () => {
            //Refresh layout, when a node was added or removed
            refreshLayout(keyChart, cy, layout);
          });
        }}
        elements={elements}
        style={{
          width: "100%",
          height: "100%",
          ...style,
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "rgba(255, 255, 255, 0)",
              "text-wrap": "wrap",
              "text-max-width": getWidth(5, 1.3),
              width: getWidth(5, 1.5, true),
              height: 70,
              "text-background-opacity": 0,
              "text-background-padding": "2px",
              "border-color": "data(faveColor)",
              "border-style": "data(borderStyle)",
              "border-width": 2,
              "border-opacity": 1,
              shape: "data(shape)",
              "shape-polygon-points": [-0.75, -1, 1, -1, 0.75, 1, -1, 1],
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
          // Hoda start
          {
            selector: "node.polygonnode",
            style: {
              label: "data(label)",
              color: "data(faveColorLabel)",
              "background-color": "rgba(255, 255, 255, 0)",
              "text-wrap": "wrap",
              //Set the size the shapes based on the maximun node size
              "text-max-width": getWidth(10, 1.5, true),
              width: getWidth(50, 1.5, true),
              height: getHeight(5, 1, true),
              shape: "polygon",
              "background-image": "data(backgroundImage)",
              "background-fit": "data(backgroundSize)",
              "text-background-opacity": 0,
              "text-background-padding": "2px",
              "border-color": "data(faveColor)",
              "border-style": "solid",
              "border-width": 2,
              "border-opacity": 1,
            },
          },
          {
            selector: "node.recnode",
            style: {
              label: "data(label)",
              color: "data(faveColorLabel)",
              "background-color": "rgba(255, 255, 255, 0)",
              "text-wrap": "wrap",
              "text-max-width": getWidth(5),
              width: getWidth(5, 1.4, true),
              height: getHeight(15, 1, true),
              shape: "round-rectangle",
              "background-image": "data(backgroundImage)",
              "background-fit": "data(backgroundSize)",
              "text-background-opacity": 0,
              "text-background-padding": "2px",
              "border-color": "data(faveColor)",
              "border-style": "solid",
              "border-width": 2,
              "border-opacity": 1,
            },
          },
          // Hoda end
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "data(faveColor)",
              "line-style": "data(lineStyle)",
              "line-color": "data(faveColor)",
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
            },
          },
          {
            selector: ".etc",
            style: {
              "background-image": "https://i.ibb.co/G5F9KMT/etc.png",
              "background-fit": "cover cover",
              "border-color": "white",
              width: 40,
              height: 40,
            },
          },
          {
            selector: ".iIcon",
            style: {
              "background-image": "https://i.ibb.co/f9p8h0Q/info.png",
              "background-fit": "cover cover",
              "border-color": "white",
              width: 20,
              height: 20,
            },
          },
          {
            selector: ".withTooltip",
            style: {
              "background-image": "https://i.ibb.co/Jkck6R5/info-2-48.png",
              "background-fit": "cover",
              "background-position": "right top",
              "background-image-opacity": 0.7,
            },
          },
        ]}
        layout={layout} //Hoda
        pan={{ x: xStartPoint, y: yStartPoint }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        motionBlur="true"
        wheelSensitivity="0.05"
      />
    </div>
    // /*-----Tannaz-end---*/
  );
}
