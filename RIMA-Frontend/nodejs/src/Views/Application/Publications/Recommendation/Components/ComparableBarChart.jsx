import React, { useEffect,useState } from 'react'
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Grid } from "@material-ui/core";

drilldown(Highcharts)
export const ComapaerableBarChart = (props) => {
    const paper = props.paper
    const interests = props.interests
    const dataPrev = Object.entries(paper.interests_similarity);
    const data = dataPrev;


    const getData = data => data.map((interest, i) => ({
        name: interest[0],
        y: interest[1],
        color: interests[i].color
    }));
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
            //categories:['Recommender System','Personalization','Learning','Analytics','Learning Analytics'],
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
            pointPlacement: -0.18,
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
            style:{
                fontSize:'14px'
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
                style:{fontWeight: 'bold'}
            },
        },
        yAxis: [{
            showFirstLabel: false,
            title:{
                text:'Similarity Score',
                style:{
                    fontWeight: 'bold'
                }
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dash',
                width: 2,
                value: 30,
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
            pointPlacement: -0.08,
            data: [['', paper.score]],
            name: 'Before changing',

        }, {
            name: 'After changing',
            color: 'green',
            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: [['', paper.score]]
        }]
    }
    return (
        <Grid item container spacing={8} style={{paddingTop:'30px'}}>
            <Grid item md={4}>
                <HighchartsReact highcharts={Highcharts} options={scoreOptions} />
            </Grid>
            <Grid item md={8}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Grid>
        </Grid>
    );
}