import React, { useEffect, useState } from "react";
import { Card, CardActionArea, Grid, Typography } from "@material-ui/core";
import RestAPI from "../../../../../../Services/api";

const HowStep1 = () => {
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

  return (
    <>
      <Grid container>
        <Grid item xs={12} style={{ paddingBottom: 16 }}>
          <Typography variant="h5">Provide sources of data</Typography>
        </Grid>

        <Grid container>
          {details.authorID ? (
            <Grid
              item
              sm={8}
              md={4}
              style={{
                border: "1px solid #e4e4e4",
                borderRadius: 6,
                margin: 4,
              }}
            >
              <Card elevation={0}>
                <CardActionArea
                  onClick={() =>
                    window.open(
                      `https://www.semanticscholar.org/author/${details.authorID}`,
                      "_blank"
                    )
                  }
                >
                  <Grid container style={{ padding: 24 }}>
                    <Grid item xs>
                      <Typography align="center">Semantic Scholar</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ height: "100px" }}>
                      <Grid container justify="center">
                        <img
                          src="/images/ss-logo.png"
                          height="100"
                          alt="Semantic Scholar Logo"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <Typography align="center">
                        ID: <b>{details.authorID}</b>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
            </Grid>
          ) : (
            <></>
          )}
          {details.twitterAccountID ? (
            <Grid
              item
              sm={8}
              md={4}
              style={{
                border: "1px solid #e4e4e4",
                borderRadius: 6,
                margin: 4,
              }}
            >
              <Card elevation={0}>
                <CardActionArea
                  onClick={() =>
                    window.open(
                      `https://twitter.com/${details.twitterAccountID}`,
                      "_blank"
                    )
                  }
                >
                  <Grid container style={{ padding: 24 }}>
                    <Grid item xs>
                      <Typography align="center">Twitter</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ height: "100px" }}>
                      <Grid
                        container
                        justify="center"
                        style={{ paddingTop: 16 }}
                      >
                        <img
                          src="/images/twitter-logo.png"
                          height="60"
                          alt="Twitter Logo"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <Typography align="center">
                        ID: <b>{details.twitterAccountID}</b>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default HowStep1;
