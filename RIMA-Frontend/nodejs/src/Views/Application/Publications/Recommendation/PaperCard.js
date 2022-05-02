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
import { Container,Col,Row } from 'reactstrap';
import ExpansionPanel from './Components/ExpansionPanel';
import PaperContent from './PaperContent.js';
import { Typography } from "@material-ui/core";

function ColoredBand({ interests_similarity, tags }) {
    const totalValues = Math.round(Object.values(interests_similarity).reduce((a, b) => a + b));
    let res = []
    tags.forEach((tag) => {
        let height = 0;
        if (Math.round(interests_similarity[tag.text]) != 0) {
            height = (Math.round(interests_similarity[tag.text] * 100) / totalValues)
            res.push(<Row className="align-items-center" style={{ backgroundColor: tag.color, height: height + '%' }}>{Math.round(interests_similarity[tag.text])}%</Row>)
        }
    })
    return (
        <Container className="align-items-center vline">{res}</Container>
    )

}
export default function PaperCard(props) {
    const [state, setState] = useState({
        timer: null,

        // seriesData: props.keyword_tags,
        mainKewords: props.paper_keywords,
        paper: props.paper,
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
                ...value,color:value.color||props.keyword_tags.find(x=> x.text.toLowerCase()===p2.toLowerCase()).color
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
    const [hide, setHide] = useState(false);
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
        
        setState((prevState) => ({
            ...prevState,
            done: true,
        }));
    }, [state.done]);

    const setSeriesData = (data) => {
        setState((prevState) => ({
            ...prevState,
            seriesData: [...data],
            done: true,
        }));
    };

    //Added by Yasmin for this component
    //   To highlight the similar exteracted keywords
    // const calculateSimilarity = async () => {
    // const keyword_tags = this.keyword_tags.filter((i) => i.text == props.paper.abstract);
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
    //     for (const userInterest of keyword_tags1) {
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

    const { paper, keyword_tags } = props;
    
    // const tweet_url = `https://twitter.com/${screenName}/status/${id_str}`;


    return (
        <div md={{ boxShadow: 1 }}
            className="card mt-4"
            style={{
                width: "100%",
                position: "relative",
                border: "1px solid",
            }}
        >
            {state.done ? (
                <>

                    <ColoredBand interests_similarity={paper.interests_similarity} tags={keyword_tags} />
                    <div className="card-body">
                    {/*---------------Hoda Start-----------------*/}
                        <PaperContent paper={paper} /> 
                    {/*---------------Hoda End-----------------*/}
                        <ExpansionPanel  tags={keyword_tags}/>
                    </div>
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
        </div >
    );
}
