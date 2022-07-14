import React from "react";

import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import "./styles.css";


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

        if (d.source != "Manual" & numKeywords < 5) {
            numKeywords = numKeywords + 1
            let numOriginalKeywords = 0;

            d.originalKeywords.map((k) => {
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
    const elements = getNodesReal(data, 100, 75, step4);

    const layout = {name: "preset"};
    const stylesheet = [
        {
            selector: "node",
            style: {
                shape: "round-rectangle",
                label: "data(label)",
                width: "350px",
                height: "50px",
                "text-halign": "center",
                "text-valign": "center",
                "background-color": "rgba(255, 255, 255, 0)",
                "border-width": 2,
                "font-size": 20
            }
        },
        {
            selector: ".multiline",
            style: {
                "text-wrap": "wrap",
                "text-max-width": "130px"
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
                "target-arrow-shape": "triangle",
                "target-arrow-color": "black",
                "source-arrow-color": "black",
                "line-color": "#333",
                width: 1.5,
                "curve-style": "straight"
            }
        }
    ];

    return (
        <div>
            <CytoscapeComponent
                elements={elements}
                style={{width: "550px", height: "300px"}}
                layout={layout}
                stylesheet={stylesheet}
                cy={(cy) => {
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
        </div>
    );
};

export default CreateNodeLink;
