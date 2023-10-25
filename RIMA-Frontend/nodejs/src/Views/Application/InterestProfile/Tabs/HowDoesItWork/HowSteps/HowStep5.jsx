import React from "react";
import {Box, Grid, Typography,} from "@material-ui/core";
import AwesomeSlider from "react-awesome-slider";
import {Loading} from "../../MyInterests/MyInterests";
import WordCloudHow from "./InterestProfileVis/WordCloudHow";
import BarChartHow from "./InterestProfileVis/BarChartHow";
import CirclePackingHow from "./InterestProfileVis/CirclePackingHow";
import 'react-awesome-slider/src/styles.js';

const HowStep5 = (props) => {
  const {keywords} = props;

  return (
    <>
      <Grid container style={{width: window.innerWidth / 2 + 50}}>
        <Grid item xs style={{paddingBottom: 16}}>
          <Typography variant="h5">
            Visualize interest profile
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <AwesomeSlider style={{height: "430px",}}>
            <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ?
                <WordCloudHow keywords={keywords}/> :
                <Loading/>}
            </Box>
            <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ?
                <BarChartHow keywords={keywords}/> :
                <Loading/>}
            </Box>
            {/*<Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ?
                <CirclePackingHow keywords={keywords}/> :
                <Loading/>}
            </Box>*/}
          </AwesomeSlider>

        </Grid>
      </Grid>
    </>
  )
}
export default HowStep5

