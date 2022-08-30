import * as React from "react";
import ConnectedGraph from "./ConnectedGraph"
import {Grid} from "@material-ui/core";

export default function Connect () {
    return (
        <>
            <Grid container>

                <Grid item xs ={12} style={{padding:"8px"}}>
                    <ConnectedGraph/>

                </Grid>

            </Grid>
        </>
        )
};