import React, { useEffect, useState } from "react";
import "./assets/paper_card.css";
import {
    convertUnicode,
    keywordHighlighter,
} from "../../../../Services/utils/unicodeCharacterEngine.js";
import OptionDropDown from "../../../components/OptionDropDown";
import styled from "styled-components";
import Button from "@mui/material/Button";
import RestAPI from "Services/api";
import ReactTooltip from "react-tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid } from "@material-ui/core";
import ExpansionPanel from './Components/ExpansionPanel';
import PaperContent from './Components/PaperContent';
import { Typography } from "@material-ui/core";

function ColoredBand({ interests_similarity, tags }) {
    const totalValues = Math.round(Object.values(interests_similarity).reduce((a, b) => a + b));
    let res = []
    for (const [int, sim] of Object.entries(interests_similarity)) {
        let height = 0;
        if (Math.round(sim) != 0) {
            height = (Math.round(sim * 100) / totalValues)
            res.push(<Grid container className="align-items-center" key={int} style={{ backgroundColor: tags.find(t => t.text == int).color, height: height + '%' }}>{Math.round(sim)}%</Grid>)
            // res.push(<Row className="align-items-center" key={int} style={{  height: height + '%' }}>{Math.round(sim)}%</Row>)
        }
    }
    return (
        <Grid container className="align-items-center vline">{res}</Grid>
    )

}
export default function PaperCard(props) {
    const [state, setState] = useState({
        timer: null,
        interests: props.interests,
        // mainKewords: props.paper_keywords,
        paper: props.paper,
        index: props.index,
        threshold: props.threshold,
        paperModiText: "",
        done: false,
    });
    //---------------Hoda Start-----------------
    for(let p1 in props.paper.keywords_similarity)
    {
        let interests=props.paper.keywords_similarity[p1];
        let max_score=0
        let max_interest=""
        let max_interest_color=""
        for(let p2 in interests)
        {
            if(p2.toLowerCase().indexOf("max_")>=0)
            {
                continue;
            }
            let value=interests[p2];
            interests[p2]={
                ...value,color:value.color||props.interests.find(x=> x.text.toLowerCase()===p2.toLowerCase()).color
                };   
            if(max_score<value.score)
            {
                max_score=value.score
                max_interest_color=value.color
                max_interest=p2
            }
        }
        if(max_score>0)
        {
            props.paper.keywords_similarity[p1]={...interests,max_score,max_interest,max_interest_color}
        }
    }
    //---------------Hoda end-----------------
    // Modified text changed by Yasmin, calculatingSimilarity for one related Keyword added by yasmin
    const [error, setError] = useState("");
    useEffect(() => {
        // calculateSimilarity();
        // let modified_text = convertUnicode(text);

        // for (const item of state.seriesData) {
        //     if (item.name == paper.related_interest) {
        //         for (const data of item.data) {
        //             if (data.y > 40) {
        //                 if (data.x.indexOf(" ") >= 0) {
        //                     merged.push({
        //                         name: data.x,
        //                         percentage: data.y,
        //                         compare: item.name,
        //                     });
        //                 } else {
        //                     merged.unshift({
        //                         name: data.x,
        //                         percentage: data.y,
        //                         compare: item.name,
        //                     });
        //                 }
        //             }
        //         }
        //         if (item.name.indexOf(" ") >= 0) {
        //             merged.push({
        //                 name: item.name,
        //                 percentage: 100,
        //                 compare: item.name,
        //             });
        //         } else {
        //             merged.unshift({
        //                 name: item.name,
        //                 percentage: 100,
        //                 compare: item.name,
        //             });
        //         }
        //     }
        // }
        ////similarity of each keyword
        // state.mainKewords.forEach((keyword) => {
        //     merged.push({
        //         name: keyword,
        //         percentage: 1,
        //         compare: state.relatedInterest,
        //     });
        // })
        // merged.forEach((element) => {
        //     modified_text = keywordHighlighter(
        //         element.name,
        //         modified_text,
        //         element.percentage,
        //         element.compare
        //     );
        // });

        setState(() => ({
            ...state,
            done: true,
        }));
    }, [state.done]);

    const setSeriesData = (data) => {
        setState(() => ({
            ...state,
            seriesData: [...data],
            done: true,
        }));
    };

    //Added by Yasmin for this component
    //   To highlight the similar exteracted keywords
    // const calculateSimilarity = async () => {
    // const interests = this.interests.filter((i) => i.text == props.paper.abstract);
    // const data = {
    //     text: paper.abstrcat.trim(),
    //     algorithm: "Yake",
    // };
    // const keywordArray = [];
    // try {
    //     let response = await RestAPI.interestExtract(data);
    //     const keys = Object.keys(response.data);
    //     const value = Object.values(response.data);

    //     for (let i = 0; i < keys.length; i++) {
    //         keywordArray.push({
    //             text: keys[i],
    //             value: value[i],
    //         });
    //     }
    // } catch (error) {
    //     setError("Loading error, close and try again.");
    //     console.log(error);
    // }
    // let seriesData = [];
    // if (keywordArray.length !== 0) {
    //     for (const userInterest of interests1) {
    //         let data = [];
    //         for (const tweetKeyword of keywordArray) {
    //             let requestData = {
    //                 keywords_1: [userInterest.text],
    //                 keywords_2: [tweetKeyword.text],
    //                 algorithm: "WordEmbedding",
    //             };
    //             try {
    //                 let response = await RestAPI.computeSimilarity(requestData);
    //                 data.push({
    //                     x: tweetKeyword.text,
    //                     y: response.data.score,
    //                 });
    //             } catch (e) {
    //                 setError("Loading error, close and try again.");
    //                 console.log(error);
    //             }
    //         }
    //         seriesData.push({
    //             name: userInterest.text,
    //             weight: userInterest.weight,
    //             data: data,
    //         });
    //     }
    //     setSeriesData(seriesData);
    // }
    // setSeriesData([{ name: "learning", weight: 5, data: [{ x: "Day", y: 27.33 }] }]);

    // };

    const { paper } = props;
    const paperDetails = paper;
    const text = paper.title + ' ' + paper.abstrcat;
    // const tweet_url = `https://twitter.com/${screenName}/status/${id_str}`;


    return (
        <Grid container className="card mt-4" style={{ position: "relative", border: "1px solid", }}>

            {state.done ? (
                <>
                    <ColoredBand interests_similarity={paper.interests_similarity} tags={state.interests} />
                    <Grid container className="card-body">
                        
                        <PaperContent paper={paper} /> 
                        
                        <ExpansionPanel paper={paper} interests={state.interests} index={state.index} threshold={state.threshold} />
                    
                    </Grid>
                </>
            ) : (
                <Button
                    disabled
                    style={{
                        fontWeight: "bold",
                        textTransform: "none",
                        marginLeft: "5px",
                        fontSize: "16px",
                    }}
                >
                    <CircularProgress
                        style={{
                            marginRight: "5px",
                        }}
                    />
                    Calculating similarity...
                </Button>
            )
            }
        </Grid >

    );
}
