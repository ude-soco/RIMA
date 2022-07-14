import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {CircularProgress, Grid, Typography} from "@material-ui/core";

// changed the original Class component to a functional component - Clara
const BarChartHow = (props) => {
    const {keywords} = props;

    const [interests, setInterests] = useState([]);
    const [weights, setWeights] = useState([]);


    useEffect(() => {
        let tempInterests = [];
        let tempWeights = [];
        keywords.forEach((keyword) => {
            tempInterests.push(keyword.text);
            tempWeights.push(keyword.value);
        });
        setInterests(tempInterests);
        setWeights(tempWeights);
    }, []);

    const options = {
        xaxis: {
            title: {text: "Interests"},
            //what are the interests, fetched as keywords from the user model - Clara
            categories: interests,
        },
        yaxis: {title: {text: "Weight of interests"}},
    };
    const series = [
        {
            name: "Interests",
            //the value of the bars, fetched as the weights from the keywords - Clara
            data: weights,
        },
    ];
    return (
        <>
            {!interests ? (
                    <>
                        <Grid container direction="column" justifyContent="center" alignItems="center">
                            <Grid item>
                                <CircularProgress/>
                            </Grid>
                            <Grid item>
                                <Typography variant="overline"> Loading data </Typography>
                            </Grid>
                        </Grid>
                    </>
                ) :
                <Chart options={options} series={series} type="bar" width="600"/>
            }

        </>
    );
};

export default BarChartHow;
