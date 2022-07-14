import React from "react";
import {Grid, Typography,} from "@material-ui/core";
import CreateNodeLink from "./NodeLinkVis/CreateNodeLink";
import data from "./data"

const HowStep4 = () => {
    //const { data } = props;

    return (
        <>
            <Grid container style={{width: "750px"}}>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{fontWeight: "bold"}}>
                        Step 4: Generate interest profile
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{padding: 8}}>
                    <Typography variant="body2" style={{padding: 8}}>
                        The final interest profile is generated using similarities between
                        keywords. Only the data from your top 5 keywords is shown.
                    </Typography>
                </Grid>
                <Grid item xs={2} style={{padding: 8}}>
                </Grid>
                <Grid item xs={8} style={{padding: 8}}>
                    <CreateNodeLink data={data} step4={true}/>
                </Grid>
                <Grid item xs={2} style={{padding: 8}}>
                </Grid>
            </Grid>

        </>
    );
}

export default HowStep4