import React, {useEffect, useState} from "react";
import {CircularProgress, Grid, Typography,} from "@material-ui/core";
import RestAPI from "../../../../Services/api";

const HowStep1 = () => {

    const [details, setDetails] = useState({
        twitterAccountID: "",
        authorID: "",
    });

    useEffect(() => {
        RestAPI.getUserData()
            .then((res) => {
                setDetails({
                    ...details,
                    twitterAccountID: res.data.twitter_account_id,
                    authorID: res.data.author_id,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (<>{
        ((details.twitterAccountID != "") | details.authorID != "") ? <DataSources details={details}/> : <Loading/>
    }</>)
}

export default HowStep1

export const Loading = () => {
    return (
        <>
            <Grid item>
                <CircularProgress/>
            </Grid>
            <Grid item>
                <Typography variant="overline"> Loading data </Typography>
            </Grid>
        </>
    )
}

export const DataSources = (props) => {
    const {details} = props
    return (
        <>
            <Grid container style={{width: "750px"}}>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{fontWeight: "bold"}}>
                        Step 1: Provide source of data
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{padding: 8}}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Semantic Scholar ID:
                    </Typography>
                </Grid>
                <Grid item xs={1} justifyContent="flex-end">
                    <img
                        src={"/images/ss-logo.png"}
                        height="25"
                        alt="Semantic Scholar Logo"
                    />
                </Grid>
                <Grid item xs={11}>
                    <Typography display="block" gutterBottom>
                        {details.authorID}
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{padding: 8}}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Twitter ID:
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <img
                        src={"/images/twitter-logo.png"}
                        height="20"
                        alt="Twitter Logo"
                    />
                </Grid>
                <Grid item xs={11}/>
                <Typography display="block" gutterBottom>
                    {details.twitterAccountID}
                </Typography>
            </Grid>

        </>
    )
}