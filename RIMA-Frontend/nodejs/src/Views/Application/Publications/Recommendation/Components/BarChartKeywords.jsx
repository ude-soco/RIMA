import React, { useEffect, useState } from 'react'
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Grid } from "@material-ui/core";
import blueGrey from '@material-ui/core/colors/blueGrey';

drilldown(Highcharts)
export const BarChart = (props) => {
    if (!props.paper.keywords_similarity) {
        return null
    }
    const paper = props.paper
    const interests = props.interests
    const keywords_similarity = Object.entries(props.paper.keywords_similarity).map((data) => Object.assign({ 'name': data[0], 'y': data[1] }))
    const threshold = props.threshold || 40
    const scorePrev = paper.score
    const score = paper.new_score
    const scoreColor = (score > threshold) ? 'green' : 'red'
    const status = (score > threshold) ? 'Recommended' : 'Not Recommended'
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'The relevance of the paper keywords to your interests model'
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category',
        },
        yAxis: {
            title: {
                text: 'Relevance Scores'
            },
        },

        plotOptions: {
            column: {
                grouping: false,
                pointWidth: 15,
            },
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                },
                color: blueGrey[500]

            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">Similarity Scores</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
        },

        series: [
            {
                data: keywords_similarity || []
            }

        ],

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
            <Grid item md={8}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Grid>
            <Grid item md={4}>
                <HighchartsReact highcharts={Highcharts} options={scoreOptions} />
            </Grid>
        </Grid>
    );
}