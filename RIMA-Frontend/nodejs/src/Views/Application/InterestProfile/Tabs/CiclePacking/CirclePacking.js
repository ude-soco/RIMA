import React from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";

const data = {
  name: "Your Interest Profile",
  color: "hsl(290, 70%, 50%)",
  children: [
    {
      name: "learning environment",
      color: "hsl(358, 70%, 50%)",
      loc: 181262
    },
    {
      name: "personalized learning",
      color: "hsl(84, 70%, 50%)",
      loc: 141262
    },
    {
      name: "recommender system",
      color: "hsl(87, 70%, 50%)",
      loc: 151262
      
    },

    {
      name: "user model",
      color: "hsl(49, 70%, 50%)",
      loc: 121262
    },

    {
      name: "peer assessment",
      color: "hsl(296, 70%, 50%)",
      loc: 111262
   },
   {
    name: "theory",
    color: "hsl(296, 70%, 50%)",
    loc: 111262
 },
  {
    name: "visual analytics",
    color: "hsl(296, 70%, 50%)",
    loc: 111262
  },
  {
    name: "ola",
    color: "hsl(250, 20%, 50%)",
    loc: 111262
  },
  {
    name: "end user",
    color: "hsl(170, 30%, 50%)",
    loc: 111262
  },
  {
    name: "open assessment",
    color: "hsl(296, 70%, 50%)",
    loc: 111262
  },
  {
    name: "analytics",
    color: "hsl(296, 70%, 50%)",
    loc: 111262
  },

       ]
};

const MyResponsiveCirclePacking = ({ data }) => (
  <ResponsiveCirclePacking
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    id="name"
    value="loc" 
    colors={{ scheme: "nivo" }}
    colorBy="id"
    childColor={{
      from: "color",
      modifiers: [["brighter", 0.4]]
    }}
    padding={4}
    enableLabels={true}

    labelsSkipRadius={10}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 2]]
    }}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.5]]
    }}
    defs={[
      {
        id: "lines",
        background: "none",
        color: "inherit",
        rotation: -45,
        lineWidth: 5,
        spacing: 8
      }
    ]}
    fill={[
      {
        match: {
          depth: 1
        },
        id: "lines"
      }
    ]}
  />
);

export default function CirclePackingExample() {
  return (
    <div style={{ width: 500, height: 500, margin: "auto" }}>
      <MyResponsiveCirclePacking data={data} />
    </div>
  );
}