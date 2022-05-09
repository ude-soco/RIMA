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
import CircularProgress from "@mui/material/CircularProgress";
import { Grid } from "@material-ui/core";
import ExpansionPanel from './Components/ExpansionPanel';


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

function Title({ paper, similarityScore }) {
    return <Grid container style={{ paddingLeft: '15px' }}>
        <Grid item md={10}>
            <Grid className="paper-title">
                {paper.title}
            </Grid>
            <Grid className="paper-subtitle"><Authors authorsList={paper.authors} /></Grid>
        </Grid>
        <Grid item md={2} style={{ justifyContent: 'flex-end' }}>
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
    const [error, setError] = useState("");
    useEffect(() => {
        let modified_text = state.paper.abstract;
        let merged = [];

        setState(() => ({
            ...state,
            paperModiText: modified_text,
            done: true,
        }));
    }, [state.done]);


    const { paper } = props;
    const paperDetails = paper;


    return (
        <Grid container className="card mt-4" style={{ position: "relative", border: "1px solid", }}>

            {state.done ? (
                <>
                    <ColoredBand interests_similarity={paper.interests_similarity} tags={state.interests} />
                    <Grid container className="card-body">
                        <Title paper={paperDetails} similarityScore={paper.score} />

                        <Grid item md={12} style={{ padding: '10px', textAlign: 'justify' }}>
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
                        <ExpansionPanel paper={paper} interests={state.interests} index={state.index} threshold={state.threshold} handleApplyWhatIfChanges={props.handleApplyWhatIfChanges} />
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
