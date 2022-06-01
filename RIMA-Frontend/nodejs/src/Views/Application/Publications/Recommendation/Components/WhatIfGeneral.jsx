import React, { useState, useEffect } from "react";
import { BarChart } from "./BarChartDrilldown"
import InterestSlider from "./Slider"
import { CircularProgress, Divider, FormControl, Grid, IconButton, InputAdornment, OutlinedInput } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import RestAPI from "Services/api";

import { Slider, Button } from "@material-ui/core";


function valueLabelFormat(value) {
    let scaledValue = value;
    return `${scaledValue}%`;
}
export const WhatIfGeneral = (props) => {
    const [state, setState] = useState({
        interests: props.interests,
        threshold: props.threshold,
        initialItems: props.items,
        items: props.items,
        done: false
    })

    useEffect(() => {
        getRecommendedPapers()
    }, [state.interests.length])

    const handleInterestDelete = (index) => {
        if (index > -1) {
            let interests = state.interests;
            interests.splice(index, 1);
            setState({ ...state, interests })
        }
    }
    const changeInterestWeight = (index, newWeight) => {
        let interests = state.interests;
        interests[index].weight = newWeight
        setState({ ...state, interests })
        getRecommendedPapers()
    }

    const handleInterestsChange = ((e) => {

    })
    const handleChangeThreshold = (event, newValue) => {
        if (typeof newValue === 'number') {
            setState({ ...state, threshold: newValue });
        }
    };

    const getRecommendedPapers = (newTagAdded = false) => {
        setState({ ...state, done: false })
        RestAPI.extractPapersFromTags(state.interests)
            .then((res) => {
                setState({ ...state, items: res.data.data, done: true })
            })
            .catch((err) => console.error("Error Getting Papers:", err));

    };
    const handleNewInterest = ((e) => {
        if ((e.key === 'Enter' || e.type == 'click') && state.interests.length < 10) {
            const interests = state.interests
            const newInterest = document.getElementById("WhatIfGnewInterest").value
            if (newInterest != '') {
                interests.push({
                    id: (state.interests.length).toString(),
                    text: newInterest,
                    color: '#aaa',
                    weight: 2.5,
                })
                setState({ ...state, interests })
            }
        }
    })
    const handleApplyGeneralChanges = () => {
        props.handleApplyGeneralChanges(state.interests)
    }
    function InterestControlPanel() {
        let res = []
        state.interests.map((interest, index) => (
            res.push(
                <Grid
                    item container xs={2} sm={3} md={3}
                    style={{ padding: "3px" }}
                    key={interest.text}
                >
                    <InterestSlider
                        key={interest.text}
                        handleTagsChange={handleInterestsChange}
                        changeTagWeight={changeInterestWeight}
                        handleDelete={handleInterestDelete}
                        name={interest.text}
                        color={interest.color}
                        weight={interest.weight}
                        index={index}
                    />
                </Grid>

            )
        ))
        return (
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {res}
                {(state.interests.length < 10) ?
                    (<Grid item container xs={2} sm={3} md={3}>
                        <Grid item style={{ paddingTop: '3px', paddingLeft: '5px', width: '100%', height: '100%' }}>
                            <FormControl variant="outlined" style={{ paddingRight: '3px', width: '100%' }}>
                                <OutlinedInput
                                    id={'WhatIfGnewInterest'}
                                    className={'outlined-new-interest'}
                                    placeholder='New Interest...'
                                    onKeyDown={handleNewInterest}
                                    endAdornment={<InputAdornment position="end">
                                        <IconButton aria-label="add" color={'primary'} style={{ padding: '0px' }} onClick={handleNewInterest}>
                                            <AddBoxIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>}
                                    labelWidth={0}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>) : null}
            </Grid>
        )
    }

    function chartSeries() {
        let series = {
            old: {
                name: "Already recommended",
                colorByPoint: false,
                data: []
            },
            new: {
                name: 'New recommendations',
                color: 'green',
                data: []
            },
            out: {
                name: 'Out of recommendation',
                color: 'red',
                data: []
            }
        }
        let drilldown = []
        let dataOld = []
        let dataOut = []
        let dataNew = []
        state.items.map((item) => {
            let existence = state.initialItems.find((i) => i.paperId == item.paperId)
            if (existence && item.score > state.threshold && existence.score > props.threshold) {
                dataOld.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                state.interests.forEach((tag) => {
                    dData.push({
                        name: tag.text,
                        y: item.interests_similarity[tag.text],
                        color: tag.color
                    })
                })
                drilldown.push({
                    name: item.title,
                    id: item.paperId,
                    data: dData
                })
            } else if (existence && item.score < state.threshold && existence.score > props.threshold) {
                dataOut.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                state.interests.forEach((tag) => {
                    dData.push({
                        name: tag.text,
                        y: item.interests_similarity[tag.text],
                        color: tag.color
                    })
                })
                drilldown.push({
                    name: item.title,
                    id: item.paperId,
                    data: dData
                })
            } else if (((!existence) || (existence && existence.score < props.threshold)) && item.score > state.threshold) {
                dataNew.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                state.interests.forEach((tag) => {
                    dData.push({
                        name: tag.text,
                        y: item.interests_similarity[tag.text],
                        color: tag.color
                    })
                })
                drilldown.push({
                    name: item.title,
                    id: item.paperId,
                    data: dData
                })
            }
        })
        series.old.data = dataOld
        series.out.data = dataOut
        series.new.data = dataNew
        return { series, drilldown }
    }
    const { series, drilldown } = chartSeries();
    return (
        <Grid>
            <InterestControlPanel />

            <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '40px' }} />
            <Grid container style={{ justifyContent: 'center' }}>
                <Grid item md={3}><span>Similarity Threshold:</span></Grid>
                <Grid container spacing={2} alignItems="center" item md={9}>
                    <Grid item>0%</Grid>
                    <Grid item xs>
                        <Slider
                            md={6}
                            value={state.threshold}
                            defaultValue={state.threshold}
                            min={0}
                            step={5}
                            max={100}
                            marks
                            getAriaValueText={valueLabelFormat}
                            valueLabelFormat={valueLabelFormat}
                            onChange={handleChangeThreshold}
                            valueLabelDisplay="on"
                        />
                    </Grid>
                    <Grid item>100%</Grid>
                </Grid>
            </Grid>
            <Divider style={{ width: '100%', marginTop: '10px' }} />

            {(state.done) ? (
                <BarChart tags={state.interests} threshold={state.threshold} items={series} drilldownData={drilldown} />
            ) : <Grid><CircularProgress size={20} /></Grid>}
            <Grid container justify="flex-end" >
                <Button color="primary" disabled={!state.done} variant='contained' onClick={handleApplyGeneralChanges}>
                    Apply changes
                </Button>
            </Grid>
        </Grid>

    )
}