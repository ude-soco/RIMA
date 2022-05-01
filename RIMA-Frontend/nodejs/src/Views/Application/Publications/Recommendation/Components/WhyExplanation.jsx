import React, { useState } from 'react';
import {
  Button as ButtonMUI,
  Collapse,
  Grid,
  makeStyles,
  Typography,
  CssBaseline,
} from "@material-ui/core";

export default function WhyExplanation(props) {
    // start Tannaz

    const [state, setState] = useState({
        paper: props.paper,
        interests: props.interests,
        index: props.index,
    })


    //Method:


        return (
            <>
              <Grid item md={8}>
                <Grid style={{ width: "90%" }}>
                  Wordcloud
                  {/* <ReplaceableCloudChart tags={props} /> */}
                </Grid>
              </Grid>
              <Grid item md={4}>
                Barchart
              </Grid>
            </>
        )
    }



