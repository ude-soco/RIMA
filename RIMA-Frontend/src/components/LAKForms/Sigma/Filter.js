/* eslint indent: "off", no-mixed-spaces-and-tabs: "off"*/

import React from "react";
import * as d3 from "d3";

class Filter extends React.Component {
  constructor(props) {
    super(props);
   
    this.addNeighbors = this.addNeighbors.bind(this);
  }
  componentDidMount() {
    this.filter = new window.sigma.plugins.filter(this.props.sigma);
    this._apply(this.props);
    this.addNeighbors()
  }

  componentWillUpdate(props) {
    if (props.nodesBy !== this.props.nodesBy || props.neighborsOf !== this.props.neighborsOf)
      this._apply(props);
  }
  addNeighbors() {

    if(!window.sigma.classes.graph.hasMethod("neighbors")){
      window.sigma.classes.graph.addMethod("neighbors", function(nodeId) {
        var k,
          neighbors = {},
          index = this.allNeighborsIndex[nodeId] || {};

        for (k in index) neighbors[k] = this.nodesIndex[k];

        return neighbors;
      });
    }
    
    
    var myGraph = new window.sigma.classes.graph();
    myGraph.read({
      nodes:this.props.sigma.graph.nodes(),
      edges:this.props.sigma.graph.edges()});
    

    let tooltip = d3.select(this.refs.drmtool);

    this.props.sigma.bind("overNode", (e) => {
      let renderKey = "renderer1";
      Object.keys(e.data.node).forEach((key)=>{
        if(key.includes("renderer")){
          let keyArr =key.split(":")
          renderKey= keyArr[0];
        }
      });

      let xPos = `${renderKey}:x`;
      let yPos = `${renderKey}:y`;
     
      tooltip
      .transition()
      .duration(100)
      .style("opacity", 2)
      .style("top", e.data.node[yPos]-20 + "px")
      .style("left", e.data.node[xPos]+20 + "px");
       tooltip.html(`<p>${e.data.node.tooltip}</p>`);

      
      if(window.sigma.classes.graph.hasMethod("neighbors")){
        
      var nodeId = e.data.node.id,
        toKeep = myGraph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

      this.props.sigma.graph.nodes().forEach(function(n) {
        if (toKeep[n.id]) n.color = n.originalColor;
        else n.color = "#eee";
      });

      this.props.sigma.graph.edges().forEach(function(e) { 
        if (toKeep[e.source] && toKeep[e.target]) e.color = e.originalColor;
        else e.color = "#eee";
      });

      // Since the data has been modified, we need to
      // call the refresh method to make the colors
      // update effective.
      this.props.sigma.refresh();
    }

    });
    this.props.sigma.bind("outNode", (e)=> {

      tooltip
      .transition()
      .duration(1100)
      .style("opacity", 0);
      
      this.props.sigma.graph.nodes().forEach(function(n) {
        n.color = n.originalColor;
      });

      this.props.sigma.graph.edges().forEach(function(e) {
        e.color = e.originalColor;
      });

      // Same as in the previous event:
      this.props.sigma.refresh();
    });
  }

  render = () => <div className="drmTooltip" ref="drmtool"></div>;

  _apply(props) {
    // this.filter.undo("node-category").nodesBy(function(n) {
    //   console.log("n", n);
    // }, "node-category");

    this.filter.undo(["neighborsOf", "nodesBy"]);
    if (props.neighborsOf) {
      this.filter.neighborsOf(props.neighborsOf, "neighborsOf");
    }
    if (props.nodesBy) this.filter.nodesBy(props.nodesBy, "nodesBy");
    this.filter.apply();
    if (this.props.sigma) this.props.sigma.refresh();
  }
}

export default Filter;
