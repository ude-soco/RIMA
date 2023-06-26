import React, { useEffect, useState } from 'react'
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Grid } from "@material-ui/core";

drilldown(Highcharts)
export const ComapaerableBarChart = (props) => {
    const paper = props.paper
    const interests = props.interests
    const threshold = props.threshold || 40
    const dataPrev = Object.entries(paper.interests_similarity);
    const data = (paper.new_interests_similarity) ? Object.entries(paper.new_interests_similarity) : dataPrev;
    const scorePrev = paper.score
    const score = (paper.new_score) ? paper.new_score : paper.score
    const scoreColor = (score > threshold) ? 'green' : 'red'
    const status = (score > threshold) ? 'Recommended' : 'Not Recommended'
    const getData = data => data.map((interest, i) => {
        if (interests[i]) {
            return ({
                name: interest[0],
                y: interest[1],
                color: interests[i].color
            })
        }
    });
    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Compare Relevance Score by Changing the Interests',
            align: 'center'
        },

        plotOptions: {
            column: {
                pointWidth: 20
            },
            series: {
                grouping: false,
                borderWidth: 0,
                style: { margin: '20px' }
            },
            softThreshold: true
        },
        legend: {
            enabled: true
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/>'
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Your Interests',
            },
        },
        yAxis: [{
            title: {
                text: 'Relevance Score',
            },
            showFirstLabel: false,
        }],
        series: [{
            color: 'rgb(158, 159, 163)',
            pointPlacement: -0.08,
            data: dataPrev.slice(),
            name: 'Before changing',

        }, {
            name: 'After changing',

            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: getData(data).slice()
        }]
    }
    const scoreOptions = {
        chart: {
            type: 'column',

        },
        title: {
            text: 'Compare Similarity Score',
            align: 'center',
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: `The paper will be ${status}`,
            align: 'center',
            style: {
                color: scoreColor,
                fontWeight: 'bold'
            }
        },
        plotOptions: {
            column: {
                pointWidth: 20
            },
            series: {
                grouping: false,
                borderWidth: 0,
                style: { margin: '20px' }
            },
            softThreshold: true
        },
        legend: {
            enabled: true
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/>'
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Current Paper',
                style: { fontWeight: 'bold' }
            },
        },
        yAxis: [{
            showFirstLabel: false,
            title: {
                text: 'Similarity Score',
                style: {
                    fontWeight: 'bold'
                }
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dash',
                width: 2,
                value: threshold,
                label: {
                    align: 'left',
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Threshold',
                    x: -10
                },
                zIndex: 8
            }],
        }],
        series: [{
            color: 'rgb(158, 159, 163)',
            pointPlacement: -0.05,
            data: [['', scorePrev]],
            name: 'Before changing',

        }, {
            name: 'After changing',
            color: scoreColor,
            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: [['', score]]
        }]
    }
    return (
        <Grid item container spacing={8} style={{ paddingTop: '30px' }}>
            <Grid item md={4}>
                <HighchartsReact highcharts={Highcharts} options={scoreOptions} />
            </Grid>
            <Grid item md={8}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Grid>
        </Grid>
    );
}