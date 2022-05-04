import React, { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Grid,
} from "@material-ui/core";
import ActivitiesNew from "./ActivitiesNew";
import InterestOverviewNew from "./InterestOverviewNew";
import RestAPI from "Services/api";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge
} from "react-flow-renderer";
import CloudChart from "Views/Application/ReuseableComponents/Charts/CloudChart/CloudChart";


export default function HowDoesItWork() {
  const [activeStep, setActiveStep] = React.useState(0);

  const [details, setDetails] = useState({
    twitterAccountID: "",
    authorID: "",
  });

  useEffect(() => {
    RestAPI.getUserData()
      .then((res) => {
        setDetails({
          ...details,
          twitterAccountID: res.data.twitter_account_id,
          authorID: res.data.author_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const steps = [
    {
      label: "Provide Source of Data",
      description: (
        <>
          <Typography variant="caption" display="block" gutterBottom>
            Semantic Scholar ID:
          </Typography>
          <Grid container>
            <img
              src={"/images/ss-logo.png"}
              height="25"
              alt="Semantic Scholar Logo"
            />
            <Typography display="block" gutterBottom>
              {details.authorID}
            </Typography>
          </Grid>
          <Typography variant="caption" display="block" gutterBottom>
            Twitter ID:
          </Typography>
          <Grid container>
            <img
              src={"/images/twitter-logo.png"}
              height="20"
              alt="Twitto Logo"
            />
            <Typography display="block" gutterBottom>
              {details.twitterAccountID}
            </Typography>
          </Grid>
        </>
      ),
    },
    {
      label: "Collect Publications and Tweets",
      description: <ActivitiesNew />,
    },
    {
      label: "Extract Keywords",
      description: `Merge and normalize`,
    },
    {
      label: "Generate interest profile",
      description: `Merge and normalize`,
    },
    {
      label: "Visualize Interest Profile",
      description: <CloudChart />,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 4 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            All steps completed - your profile has been generated
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
