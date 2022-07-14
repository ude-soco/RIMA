import React from "react";
import {Box, Grid, Typography,} from "@material-ui/core";
import AwesomeSlider from "react-awesome-slider";
import {Loading} from "../Tabs/MyInterests";
import data from "./data"
import WordCloudHow from "./InterestProfileVis/WordCloudHow";
import BarChartHow from "./InterestProfileVis/BarChartHow";
import CirclePackingHow from "./InterestProfileVis/CirclePackingHow";

const HowStep5 = () => {

    return (
        <Grid container style={{width: "750px"}}>
            <Grid item xs={12}>
                <Typography variant="h6" style={{fontWeight: "bold"}}>
                    Step 5: Visualize interest profile
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <AwesomeSlider style={{height: "500px"}}>
                    <Box style={{backgroundColor: "#fff"}}>
                        {data.length !== 0 ?
                            <WordCloudHow keywords={data}/> :
                            <Loading/>}
                    </Box>
                    <Box style={{backgroundColor: "#fff"}}>
                        {data.length !== 0 ?
                            <BarChartHow keywords={data}/> :
                            <Loading/>}
                    </Box>
                    <Box style={{backgroundColor: "#fff"}}>
                        {data.length !== 0 ?
                            <CirclePackingHow keywords={data}/> :
                            <Loading/>}
                    </Box>

                </AwesomeSlider>
            </Grid>
        </Grid>
    )
}
export default HowStep5

