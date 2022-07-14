import React from "react";
import {Grid, Typography,} from "@material-ui/core";
import Chart from "react-apexcharts";
import data from "./data"

const HowStep2 = () => {

    return (
        <>
            <Grid container style={{width: "750px"}}>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{fontWeight: "bold"}}>
                        Step 2: Collect publications and tweets from the last five years
                    </Typography>
                </Grid>
                <Grid item xs={6} style={{paddingRight: 8}}>
                    <Typography variant="body2" style={{padding: 8}}>
                        Publications
                    </Typography>
                    <HowManyChart data={data}/>
                </Grid>
                <Grid item xs={6} style={{paddingRight: 8}}>
                    <Typography variant="body2" style={{padding: 8}}>
                        Tweets
                    </Typography>
                    <HowManyChart data={data}/>
                </Grid>
            </Grid>

        </>
    );
}

export default HowStep2

export const HowManyChart = (props) => {
    const {data} = props;

    const papers = [];
    const paperids = [];
    data.map((d) => {
        let papersHere = d.papers;
        papersHere.map((p) => {
            if (!paperids.includes(p.id)) {
                papers.push(p);
                paperids.push(p.id);
            }
        });
    });
    let years = [];
    let publications = [];
    let allYears = {};

    papers.map((d) => {
        allYears[d.year] = allYears[d.year] ? allYears[d.year] + 1 : 1;
    });

    Object.keys(allYears).map((year) => {
        years.push(year);
        publications.push(allYears[year]);
    });

    const options = {
        xaxis: {
            title: {text: "Year"},
            categories: years
        },
        yaxis: {title: {text: "Number of Publications"}}
    };

    const series = [
        {
            name: "Publications published this year",
            //the value of the bars, fetched as the weights from the keywords - Clara
            data: publications
        }
    ];

    return (
        <>
            <Chart options={options} series={series} type="bar" width="350px"/>
        </>
    );

}