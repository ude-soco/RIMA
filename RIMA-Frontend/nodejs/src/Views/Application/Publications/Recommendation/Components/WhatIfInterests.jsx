import React, { useEffect, useState } from 'react';
import { Grid } from "@material-ui/core";
import InterestSlider from "./Slider";
import { ComapaerableBarChart } from "./ComparableBarChart"
import RestAPI from 'Services/api';

export const WhatIfInterests = (props) => {
    const [state, setState] = useState({
        paper: props.paper,
        interests: props.interests,
        index: props.index
    })

    //Method:

    const changeInterestWeight = (index, newWeight) => {
        let myTags = state.interests;
        myTags[index].weight = newWeight
        setState({
            ...state,
            interests: myTags
        })
    }
    const handleInterestsChange = () => {
        const params = {
            "interests": state.interests,
            "paper_keywords":state.paper.paper_keywords
        }
        RestAPI.getInterestsSimilarities(params)
            .then((res) => {
                console.log(res.data.data)
            })
            .catch((err) => console.error("Error Getting Papers:", err));
    }
    const handleNewInterest = ((e) => {
        if (e.key === 'Enter' && state.interests.length < 10) {
            const interests = state.interests
            const newInterest = document.getElementById(`newInterest_${state.index}`).value
            interests.push({
                _id: interests.length,
                text: newInterest,
                color: 'red',
                weight: 2.5,
            })
            setState({
                ...state,
                interests
            })
        }
    })
    function InterestControlPanel({ interests }) {
        let res = []
        interests.map((tag, index) => (
            res.push(
                <Grid
                    item container xs={2} sm={3} md={3}
                    style={{ padding: "3px" }}
                    key={tag.text}
                ><InterestSlider
                        key={tag.text}
                        handleTagsChange={handleInterestsChange}
                        changeTagWeight={changeInterestWeight}
                        handleDelete='{props.handleDelete}'
                        name={tag.text}
                        color={tag.color}
                        weight={tag.weight}
                        index={index}
                    />
                </Grid>
            )
        ))

        return (
            <Grid container>
                {res}
                <Grid item xs={2} sm={3} md={3}>
                    <Grid item style={{ padding: '5px', width: '100%', height: '100%' }}>
                        <input id={`newInterest_${state.index}`} placeholder="Add a New Interest..." onKeyDown={handleNewInterest} style={{ width: '100%', height: '100%' }} />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    return (
        <Grid container >
            <InterestControlPanel interests={state.interests} />
            <Grid item container md={12}>
                <ComapaerableBarChart paper={state.paper} interests={state.interests} />
            </Grid>
        </Grid>
    )

}

