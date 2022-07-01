import {ResponsiveCirclePacking} from "@nivo/circle-packing";
import React from "react";

const MyResponsiveCirclePacking = (props) => {
    const {data, handleWordClicked} = props;
    return (
    <ResponsiveCirclePacking
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="loc"
        colors={{ scheme: "nivo" }}
        colorBy="id"
        childColor={{
            from: "color",
            modifiers: [["brighter", 0.4]],
        }}
        padding={4}
        enableLabels={true}
        labelsSkipRadius={10}
        labelTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
        }}
        borderWidth={1}
        borderColor={{
            from: "color",
            modifiers: [["darker", 0.5]],
        }}
        defs={[
            {
                id: "lines",
                background: "none",
                color: "inherit",
                rotation: -45,
                lineWidth: 5,
                spacing: 8,
            },
        ]}
        fill={[
            {
                match: {
                    depth: 1,
                },
                id: "lines",
            },
        ]}
        onClick={handleWordClicked}
    />
)};

export default MyResponsiveCirclePacking