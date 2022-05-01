import React, { useState, useEffect } from "react";
import { BarChart } from "./BarChart"
import InterestSlider from "./Slider"
import { Grid } from "@material-ui/core";
import RestAPI from "Services/api";

import Slider from "@material-ui/core/Slider";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const otherOptions = [
    { title: 'Big data' },
    { title: 'Educational technology' },
    { title: 'Usability' },
    { title: 'User Model'},
    { title: 'Systems' },
    { title: 'Artificial Intelligent' },
    { title: 'LA'},
  ];

function valueLabelFormat(value) {
    let scaledValue = value;
    return `${scaledValue}%`;
}
export const WhatIfGeneral = (props) => {
    // const [initialInterests] = useState(props.interests)
    const [interests, setInterests] = useState(props.interests)

    const [threshold, setThreshold] = useState(props.threshold);

    const [initialItems] = useState(props.items);
    const [items, setItems] = useState(props.items);
    // useEffect(() => {
    //     setItems(props.items);
    // }, [props])

    useEffect(() => {
        getRecommendedPapers()
    }, [interests])

    const handleNewInterest = ((e) => {
        if (e.key === 'Enter' && interests.length < 10) {
            const tempInterests = interests
            const newInterest = document.getElementById("WhatIfGnewInterest").value
            if (newInterest != '') {
                tempInterests.push({
                    _id: interests.length,
                    text: newInterest,
                    color: 'red',
                    weight: 2.5,
                })
                setInterests(tempInterests)
                getRecommendedPapers()
            }
        }
    })
    function InterestControlPanel({ interests }) {
        let res = []
        interests.map((interest, index) => (
            res.push(
                <Grid
                    item container xs={2} sm={3} md={3}
                    style={{ padding: "3px" }}
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
                {(interests.length < 10) ?
                    (<Grid item container xs={2} sm={3} md={3}>
                        <Grid item style={{ padding: '5px', width: '100%',height: '50px' }}>
                            <Autocomplete
                            id="WhatIfGnewInterest"
                            placeholder="Add a New Interest..." 
                            onKeyDown={handleNewInterest} 
                            style={{ borderRadius: "5px" }}
                            options={otherOptions}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} label="Add new interest"  />}
                            />
                            {/* <input id="WhatIfGnewInterest" placeholder="Add a New Interest..." onKeyDown={handleNewInterest} style={{ width: '100%', height: '100%' }} /> */}
                        </Grid>
                    </Grid>) : null}
            </Grid>
        )
    }

    const handleInterestDelete = (index) => {
        if (index > -1) {
            let tempInterests = interests;
            tempInterests.splice(index, 1); 
            setInterests(tempInterests)
        }
    }
    const changeInterestWeight = (index, newWeight) => {
        let tempInterests = interests;
        tempInterests[index].weight = newWeight
        setInterests(tempInterests)
    }

    const handleInterestsChange = ((e) => {
        getRecommendedPapers();
    })
    const handleChangeThreshold = (event, newValue) => {
        if (typeof newValue === 'number') {
            setThreshold(newValue);
        }
    };

    const getRecommendedPapers = (newTagAdded = false) => {

        RestAPI.extractPapersFromTags(interests)
            .then((res) => {
                setItems(res.data.data)
            })
            .catch((err) => console.error("Error Getting Papers:", err));

    };
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
        items.map((item) => {
            let existence = initialItems.find((i) => i.paperId == item.paperId)
            if (existence && item.score > threshold && existence.score > props.threshold) {
                dataOld.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                interests.forEach((tag) => {
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
            } else if (existence && item.score < threshold && existence.score > props.threshold) {
                dataOut.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                interests.forEach((tag) => {
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
            } else if (((!existence) || (existence && existence.score < props.threshold)) && item.score > threshold) {
                dataNew.push({
                    name: item.title,
                    y: item.score,
                    drilldown: item.paperId
                })
                let dData = []
                interests.forEach((tag) => {
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
        // }
        return { series, drilldown }
    }
    const { series, drilldown } = chartSeries();
    return (
        <Grid>
            <InterestControlPanel interests={interests} />

            <hr style={{ marginTop: '1rem' }} />
            <Grid container sx={{ justifyContent: 'center' }}>
                <Grid item md={3}><span>Similarity Threshold:</span></Grid>
                <Grid container spacing={2} alignItems="center" item md={9}>
                    <Grid item>0%</Grid>
                    <Grid item xs>
                        <Slider
                            md={6}
                            value={threshold}
                            defaultValue={threshold}
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
            <hr style={{ marginTop: '1rem' }} />
            <BarChart tags={interests} threshold={threshold} items={series} drilldownData={drilldown} />
        </Grid>
    )
}