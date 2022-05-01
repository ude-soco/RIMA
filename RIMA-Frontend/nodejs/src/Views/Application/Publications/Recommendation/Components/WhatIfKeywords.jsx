import React, { useState, useEffect } from "react";
import { BarChart } from "./BarChart"
import { Grid } from "@material-ui/core";
import RestAPI from "Services/api";

export const WhatIfKeywords = (props) => {
    const [state, setState] = useState({
        Keywords_relevance: [],
        tags: props.tags,
        paper : props.paper,
        paper_keywords:props.paper.paper_keywords
    })
    useEffect(() => {
        RestAPI.keywordSimilarities({keywords:state.paper_keywords, interests:state.tags}).then((res,err) => {
            console.log('res',res)
            console.log('err',err)
        })
    }
    )

    // const getRecommendedPapers = (newTagAdded = false) => {

    //     RestAPI.extractPapersFromTags(state.tags)
    //         .then((res) => {
    //             setItems(res.data.data)

    //         })
    //         .catch((err) => console.error("Error Getting Papers:", err));

    // };
    // function chartSeries() {
    //     let series = {
    //         old: {
    //             name: "Already recommended",
    //             colorByPoint: false,
    //             data: []
    //         },
    //         new: {
    //             name: 'New recommendations',
    //             color: 'green',
    //             data: []
    //         },
    //         out: {
    //             name: 'Out of recommendation',
    //             color: 'red',
    //             data: []
    //         }
    //     }
    //     let drilldown = []
    //     if (initialItems == items) {
    //         let dataOld = []
    //         let dataOut = []
    //         let dataNew = []
    //         initialItems.map((item) => {
    //             if (item.score > threshold && item.score > props.threshold) {
    //                 dataOld.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.id
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.id,
    //                     data: dData
    //                 })
    //             }
    //             else if (props.threshold < item.score && item.score < threshold && threshold != props.threshold) {
    //                 dataOut.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.id
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.id,
    //                     data: dData
    //                 })
    //             }
    //             else if (item.score > threshold && item.score < props.threshold) {
    //                 dataNew.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.id
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.id,
    //                     data: dData
    //                 })
    //             }
    //         })

    //         series.old.data = dataOld
    //         series.out.data = dataOut
    //         series.new.data = dataNew

    //     } else {

    //         let dataOld = []
    //         let dataOut = []
    //         let dataNew = []
    //         items.map((item) => {
    //             let existence = initialItems.find((i) => i.id == item.paperId)
    //             if (existence && item.score > threshold && existence.score > props.threshold) {
    //                 dataOld.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.paperId
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.paperId,
    //                     data: dData
    //                 })
    //             } else if (existence && item.score < threshold && existence.score > props.threshold) {
    //                 dataOut.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.paperId
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.paperId,
    //                     data: dData
    //                 })
    //             } else if (((!existence) || (existence && existence.score < props.threshold)) && item.score > threshold) {
    //                 dataNew.push({
    //                     name: item.title,
    //                     y: item.score,
    //                     drilldown: item.paperId
    //                 })
    //                 let dData = []
    //                 tags.forEach((tag) => {
    //                     dData.push({
    //                         name: tag.text,
    //                         y: item.interests_similarity[tag.text],
    //                         color: tag.color
    //                     })
    //                 })
    //                 drilldown.push({
    //                     name: item.title,
    //                     id: item.paperId,
    //                     data: dData
    //                 })
    //             }
    //         })
    //         series.old.data = dataOld
    //         series.out.data = dataOut
    //         series.new.data = dataNew
    //     }
    //     return { series, drilldown }
    // }
    // const { series, drilldown } = chartSeries();
    return (
        <Grid>
            New keywords should come here
            {/* <hr style={{ marginTop: '1rem' }} /> */}
            {/* <BarChart tags={tags} threshold={threshold} items={series} drilldownData={drilldown} /> */}
        </Grid>
    )
}