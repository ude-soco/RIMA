import React, { useEffect, useState } from "react";
import "./assets/paper_card.css";
import { Button, CircularProgress, Grid } from '@material-ui/core';
import ExpansionPanel from './Components/ExpansionPanel';
import PaperContent from "./Components/PaperContent";

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
            if (p2.toLowerCase().indexOf("data_") >= 0) {
                continue;
            }
            let value = interests[p2];
            interests[p2] = {
                ...value, color: value.color || props.interests.find(x => x.text.toLowerCase() === p2.toLowerCase()).color
            };
            if (max_score < value.score) {
                max_score = value.score
                max_interest_color = value.color
                max_interest = p2
            }
        }
        if (max_score > 0) {
            props.paper.keywords_similarity[p1] = { ...interests, data_max_score: max_score, data_max_interest: max_interest, data_max_interest_color: max_interest_color }
        }
    }
    //---------------Hoda end-----------------
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
                        <Grid
                            item
                            md={12}
                            sm={12}
                            style={{ padding: "10px", textAlign: "justify" }}
                        >
                            <PaperContent paper={paper} />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            sm={12}
                            style={{ padding: "10px", textAlign: "justify" }}
                        >
                            <ExpansionPanel paper={paper} interests={state.interests} index={state.index} threshold={state.threshold} handleApplyWhatIfChanges={props.handleApplyWhatIfChanges} />
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
