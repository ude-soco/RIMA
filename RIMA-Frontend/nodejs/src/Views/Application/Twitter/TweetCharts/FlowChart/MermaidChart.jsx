import React, { useEffect } from "react";
import mermaid from "mermaid";
import  "./style.css"


mermaid.initialize({
  theme: "default",
  themeVariables: {
    fontFamily: "arial",
    fontSize: "10px"

 },
  
  startOnLoad:true,
  flowchart:{
    useMaxWidth:true,
   
  },
  securityLevel:'loose',

});

export default function MermaidChart(props) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  
  return <div className="mermaid">{props.chart}</div>;
}
