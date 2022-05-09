import React, { useEffect, useState } from "react";
import "./assets/paper_card.css";
import { Typography } from '@mui/material';
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
import TopSimilarityChart from './TopSimilarityChart';

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
//---------------Hoda Start-----------------
function highlighter(paperId, keyword, max_score, max_interest_color, originalText) {
    let lookupkey = btoa(unescape(encodeURIComponent(keyword)));
    return `<a data-tip="${lookupkey}" data-for="${paperId}" data-event="click" title="Similarity Score: ${Math.round(max_score * 100) / 100}" className="highlight-keyword" style="color:${max_interest_color}">${originalText}</a>`
}
function KeywordSimObjToArray(keywords_similarity) {
    let items = []
    let i = 0;
    for (let p2 in keywords_similarity) {

        let value = keywords_similarity[p2];
        items.push({
            keyword: p2,
            max_score: value.max_score,
            max_interest_color: value.max_interest_color,
            numberOfWord: p2.split(" ").length
        });
    }
    return items.sort((a, b) => a.numberOfWord < b.numberOfWord ? 1 : a.numberOfWord == b.numberOfWord ? 0 : -1);
}
function HighlightText(paperId, keywords_similarity, text) {
    keywords_similarity = KeywordSimObjToArray(keywords_similarity)
    let modified_text = text;
    for (let index in keywords_similarity) {
        let value = keywords_similarity[index];
        let regEx = new RegExp(value.keyword, "ig");
        let matches = regEx.exec(modified_text)
        if (matches === null) continue;
        let originalText = matches[0].split(" ").map(x => "<x>" + x[0] + "</x>" + x.substring(1)).join("&nbsp;");

        modified_text = modified_text.replace(regEx, highlighter(paperId, value.keyword, value.max_score, value.max_interest_color, originalText));
    }
    return modified_text;
}


function Title({ paper, similarityScore }) {
    //highlight title
    let modified_title = HighlightText(paper.paperId, paper.keywords_similarity, paper.title);
    //---------------Hoda end-----------------
    return <Grid className="d-flex justify-content-between">
        <Grid md={10}>
            <div className="paper-title" dangerouslySetInnerHTML={{ __html: modified_title }}>

            </div>
            <div className="paper-subtitle"><Authors authorsList={paper.authors} /></div>
        </Grid>
        <Grid md={{ justifyContent: 'flex-end' }}>
            <span className="paper-badge">
                Similarity Score: {similarityScore} %
            </span>
            {paper.modified ? <span className="paper-badge">Modified</span> : null}

        </Grid>
    </Grid>
}
function Authors({ authorsList }) {
    const res = []
    authorsList.forEach(element => {
        res.push(element.name)
    });
    return <span>{res.join(' , ')}</span>
}
function PaperContent({ text }) {
    //---------------Hoda Start-----------------
    useEffect(() => {
        ReactTooltip.rebuild();
    });
    //---------------Hoda end-----------------
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
}
export default function PaperCard(props) {
    const [state, setState] = useState({
        timer: null,
        interests: props.interests,
        paper: props.paper,
        index: props.index,
        threshold: props.threshold,
        paperModiText: "",
        done: false,
    });
    //---------------Hoda Start-----------------
    for (let p1 in props.paper.keywords_similarity) {
        let interests = props.paper.keywords_similarity[p1];
        let max_score = 0
        let max_interest = ""
        let max_interest_color = ""
        for (let p2 in interests) {
            if (p2.toLowerCase().indexOf("max_") >= 0) {
                continue;
            }
            let value = interests[p2];
            interests[p2] = {
                ...value, color: value.color || props.keyword_tags.find(x => x.text.toLowerCase() === p2.toLowerCase()).color
            };
            if (max_score < value.score) {
                max_score = value.score
                max_interest_color = value.color
                max_interest = p2
            }
        }
        if (max_score > 0) {
            props.paper.keywords_similarity[p1] = { ...interests, max_score, max_interest, max_interest_color }
        }
    }
    //---------------Hoda end-----------------
    const [hide, setHide] = useState(false);
    // Modified text changed by Yasmin, calculatingSimilarity for one related Keyword added by yasmin
    const [error, setError] = useState("");
    useEffect(() => {
        // calculateSimilarity();
        // let modified_text = convertUnicode(text);
        //---------------Hoda Start-----------------
        //highlight abstract
        let modified_text = HighlightText(state.paper.paperId, state.paper.keywords_similarity, state.paper.abstract);
        //---------------Hoda end-----------------

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
            paperModiText: modified_text,
            done: true,
        }));
    }, [state.done]);


    const { paper } = props;
    const paperDetails = paper;

    // const tweet_url = `https://twitter.com/${screenName}/status/${id_str}`;


    return (
        <Grid container className="card mt-4" style={{ position: "relative", border: "1px solid", }}>

            {state.done ? (
                <>
                    <ColoredBand interests_similarity={paper.interests_similarity} tags={state.interests} />
                    <Grid container className="card-body">
                        <Grid className="card-body">
                            {/*---------------Hoda Start-----------------*/}
                            <ReactTooltip id={paperDetails.paperId}
                                event={'click'}
                                globalEventOff={'click'} border={true}
                                type={'light'} place={'bottom'}
                                effect={'solid'} clickable={true} getContent={(dataTip) => {
                                    if (!dataTip) return <>No Data!</>;
                                    let keyword = decodeURIComponent(escape(atob(dataTip)));
                                    let interests = paper.keywords_similarity[keyword];
                                    return <TopSimilarityChart onClick={e => e.stopPropagation()} interests={interests} keyword={keyword} />;
                                }} />
                            {/*---------------Hoda End-----------------*/}

                            <Title paper={paperDetails} similarityScore={paper.score} />

                            <Grid md={12}>
                                {/* <a
                                href="PAPER_URL"
                                target="_blank"
                                style={{ textDecoration: "none", color: "inherit" }}
                                rel="noopener noreferrer"
                            > */}
                                <Typography align="justify" style={{ padding: '0px 15px' }}>
                                    <PaperContent text={state.paperModiText} />
                                </Typography>

                                {/* </a> */}

                            </Grid>
                            <ExpansionPanel tags={keyword_tags} paper={paper} interests={state.interests} index={state.index} threshold={state.threshold} handleApplyWhatIfChanges={props.handleApplyWhatIfChanges} />
                        </Grid>
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
