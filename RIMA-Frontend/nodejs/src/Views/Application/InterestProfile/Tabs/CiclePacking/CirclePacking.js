import React from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";


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

export default function CirclePackingExample(props) {
    // interests & weights are passed down as props, see InterestOverviewNew - Clara
    const interestsWeights = props.interestsWeights
    const interests = Object.keys(interestsWeights)
    let weights = []
    interests.map((interest) =>
        weights.push(interestsWeights[interest]["weight"]))
    //For each interest create a new object and put them in an array - Clara
    let dataArray=[];
    for (let i = 0; i < interests.length; i++){
        //name = title inside circle, loc = size circle, depending on weight of keywords - Clara
        dataArray.push({name:interests[i],
            loc: weights[i]})
    };
    const data ={
        //name: "Your Interest Profile",
            //color: "hsl(0, 0%, 93%)",
        // the inside circles
        children: dataArray,
    }

  return (
    <div style={{ width: 500, height: 500, margin: "auto" }}>
      <MyResponsiveCirclePacking data={data} />
    </div>
  );
}