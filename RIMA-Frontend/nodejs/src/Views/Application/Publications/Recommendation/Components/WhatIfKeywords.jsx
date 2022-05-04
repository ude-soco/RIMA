import React, { useEffect, useState } from 'react';
import { Grid, FormControl, Chip, makeStyles, InputLabel, Select } from "@material-ui/core";
import RestAPI from 'Services/api';
import Slider from "@material-ui/core/Slider";
import Divider from '@material-ui/core/Divider';
import {BarChart} from './BarChartKeywords'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));
export const WhatIfKeywords = (props) => {
    const classes = useStyles();
    const [state, setState] = useState({
        paper: props.paper,
        keywords: Object.entries(props.paper.paper_keywords),
        potentialKeywords: [['real-time', 2], ['interest', 1.8], ['Significance analysis', 1.6], ['prediction', 1.1], ['tag sparsity', 1],],
        interests: props.interests,
        index: props.index,
        threshold: props.threshold
    })

    useEffect(()=>{
        handleKeywordsChange()
    },[state.keywords.length])

    //Method:

    const handleDelete = (keywordToDelete) => () => {
        const keywords = state.keywords.filter((chip) => chip !== keywordToDelete)
        state.potentialKeywords.push(keywordToDelete)
        setState({ ...state, keywords })
    };
    const handleChange = (event) => {
        if (!event.target.value) {
            return null
        }
        const selectedKeyword = state.potentialKeywords[event.target.value]
        state.keywords.push(selectedKeyword)
        const potentialKeywords = state.potentialKeywords.filter((keyword) => keyword !== selectedKeyword)
        setState({ ...state, potentialKeywords })
    };
    const handleKeywordDelete = (index) => {
        if (index > -1) {
            let interests = state.interests;
            delete state.paper.interests_similarity[interests[index].text];
            interests.splice(index, 1);
            setState({ ...state, interests })
        }
    }

    const handleNewKeyword = ((e) => {
        if ((e.key === 'Enter' || e.type == 'click') && state.interests.length < 10) {
            const interests = state.interests
            const newInterest = document.getElementById(`newInterest_${state.index}`).value
            interests.push({
                _id: interests.length,
                text: newInterest,
                color: '#303F9F',
                weight: 2.5,
            })
            setState({
                ...state,
                interests
            })
        }
    })
    const handleKeywordsChange = () => {
        const params = {
            "interests": state.interests,
            "keywords": state.keywords.reduce((a, v) => ({ ...a, [v[0]]: v[1]}), {})
        }
        const paper = state.paper
        RestAPI.getKeywordsSimilarities(params)
            .then((res) => {
                console.log(res)
                paper.new_score = res.data.data.score
                paper.keywords_similarity = res.data.data.keywords_similarity
                setState({
                    ...state,
                    paper: paper,
                })
            })
            .catch((err) => console.error("Error Getting Papers:", err));
    }
    const handleChangeThreshold = (event, threshold) => {
        if (typeof threshold === 'number') {
            setState({ ...state, threshold });
        }
    };

    function valueLabelFormat(value) {
        let scaledValue = value;
        return `${scaledValue}%`;
    }


    let key = 0
    return (
        <Grid container>
            <Grid container>
                <Grid component="ul" className={classes.root} >
                    {state.keywords.map((data) => {
                        return (
                            <li key={key++}>
                                <Chip
                                    label={data[0]}
                                    onDelete={handleDelete(data)}
                                    className={classes.chip}
                                />
                            </li>
                        );
                    })}

                </Grid>
                <Grid container>
                    <FormControl variant="outlined" >
                        <InputLabel>Select another Keyword</InputLabel>
                        <Select
                            native
                            onChange={handleChange}
                            label="Keyword"
                            inputProps={{
                                name: 'potentialKeywords',
                                id: 'outlined-potential-keywords',
                            }}
                        >
                            <option aria-label="None" value="" />
                            {state.potentialKeywords.map((keyword, index) => {
                                return (
                                    <option key={index} value={index}>{keyword[0]}</option>
                                )
                            })}

                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Divider style={{ width: '100%', marginTop: '10px' }} />
            <Grid container style={{ justifyContent: 'center', marginTop: '40px' }}>
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
            <Grid item container md={12}>
                <BarChart paper={state.paper} interests={state.interests} threshold={state.threshold} />
            </Grid>
        </Grid>
    )

}

