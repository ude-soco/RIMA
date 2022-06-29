import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    Typography
} from "@material-ui/core";
import CardForPaper from "./CardForPaper";

const WhyInterest = (props) =>{
    const {keywords, currInterest} =props;
    const [keyword, setKeyword] = useState({})
    const [papers, setPapers] = useState([])
    const [originalKeywords, setOriginalKeywords] = useState([])


    console.log(keywords,"test")

    useEffect(()=>{
        keywords.map((k) => {
            if (k.text===currInterest){
                console.log(k, "test set keywords")
                setKeyword(k)
                setPapers(k.papers)
                setOriginalKeywords(k.originalKeywords)

            }


        }
        )

    },[])

    return(<>
        {(keyword.source === "Manual") ?
            <Typography component='div' variant="body1">
                Your interest {currInterest} has been manually added
            </Typography>

        : <> <Typography component='div' variant="body1">
            Your interest {currInterest} has been extracted from the following papers
        </Typography>
            <Grid container direction="column">
            <Grid container direction="row" justify="space-between">
            <Grid item xs={12}>
                {(papers.length != 0) ?
                    papers.map((paper)=>{
                        console.log(paper, "test Paper ")
                        return(<CardForPaper paper={paper} originalKeywords={originalKeywords}/>)
                    }):
                    <></>}


        {/* Here should all the components come */}
            </Grid>
            <Grid item xs={false} md={2} />
            </Grid>
            </Grid>
                </>}
    </>)
}

export default WhyInterest