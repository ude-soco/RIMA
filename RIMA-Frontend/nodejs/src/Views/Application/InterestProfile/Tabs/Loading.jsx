import {CircularProgress, Grid, Typography} from "@material-ui/core";
import React from "react";

export const Loading = () => {
    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <CircularProgress/>
                </Grid>
                <Grid item>
                    <Typography variant="overline"> Loading data </Typography>
                </Grid>
            </Grid>
        </>
    )
}