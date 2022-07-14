import React, {useState} from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";

import WhyInterest from "../../WhyInterest/WhyInterest";

const WordCloud = (props) => {
    const {keywords} = props;
    return (
        <>
            <Grid container style={{width: "600px"}}>
                <ReactWordcloud
                    words={keywords}
                    options={{
                        colors: [
                            "#b39ddb",
                            "#7e57c2",
                            "#4fc3f7",
                            "#03a9f4",
                            "#0288d1",
                            "#01579b",
                        ],
                        enableTooltip: true,
                        deterministic: true,
                        fontFamily: "helvetica",
                        fontSizes: [14, 64],
                        fontStyle: "normal",
                        fontWeight: "normal",
                        padding: 3,
                        rotations: 1,
                        rotationAngles: [0, 90],
                        scale: "sqrt",
                        spiral: "archimedean",
                        transitionDuration: 1000,

                    }}
                />
            </Grid>


        </>
    );
};

export default WordCloud;
