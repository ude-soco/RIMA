import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
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
import WhyInterest from "../../../WhyInterest/WhyInterest";
import {ResponsiveCirclePacking} from "@nivo/circle-packing";


const CirclePackingHow = (props) => {
    const {keywords} = props;

    const [interests, setInterests] = useState([]);


    useEffect(() => {
        let tempInterests = [];
        keywords.forEach((keyword) => {
            tempInterests.push({
                ...keyword,
                name: keyword.text,
                loc: keyword.value,
            });
        });
        setInterests(tempInterests);
    }, []);


    return (
        <>
            {!interests ? (
                <>
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <CircularProgress/>
                        </Grid>
                        <Grid item>
                            <Typography variant="overline"> Loading data </Typography>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <div style={{width: 500, height: 500, margin: "auto"}}>
                        <ResponsiveCirclePacking
                            data={{children: interests}}
                            margin={{top: 20, right: 20, bottom: 20, left: 20}}
                            id="name"
                            value="loc"
                            colors={{scheme: "blues"}}
                            colorBy="id"
                            childColor={{from: "color", modifiers: [["brighter", 3]]}}
                            padding={4}
                            enableLabels={true}
                            labelsSkipRadius={10}
                            labelTextColor={{from: "color", modifiers: [["darker", 2]]}}
                            borderWidth={1}
                            borderColor={{from: "color", modifiers: [["darker", 0.5]]}}
                            defs={[{id: "lines", background: "none", color: "inherit", rotation: -45, lineWidth: 5, spacing: 8}]}
                            fill={[{match: {depth: 1,}, id: "lines"}]}

                        />
                    </div>
                </>
            )}


        </>
    );
}

export default CirclePackingHow;
