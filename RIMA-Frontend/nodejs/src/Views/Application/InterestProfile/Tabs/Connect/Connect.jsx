import * as React from "react";
import ConnectedGraph from "./ConnectedGraph"
import {CircularProgress, Grid, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import RestAPI from "../../../../../Services/api";
import Help from "./Help"

export default function Connect (props) {
    const {data} = props
    console.log(data, "data connect")

    const [dataCollected, setDataCollected]=useState(false)
    const [myInterests, setMyInterests]=useState([])
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));


    useEffect(()=>{

        if(data.length===0){
            setDataCollected(false)
        }
        else{
            RestAPI.longTermInterest(currentUser).then(res=>{
                const {data} =res
                let interests = []
                data.map((d)=>{
                    interests.push(d.keyword)
                })
                setMyInterests(interests)
            })
            setDataCollected(true)
        }


    },[data])

    console.log(data, "data connect")
    return (
        <>
            <Help/>
            <Grid container>

                <Grid item xs ={12} style={{padding:"8px"}}>
                    {dataCollected?
                        <ConnectedGraph data={data} myInterests={myInterests}/>:<Loading/>
                    }


                </Grid>

            </Grid>
        </>
        )
};

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