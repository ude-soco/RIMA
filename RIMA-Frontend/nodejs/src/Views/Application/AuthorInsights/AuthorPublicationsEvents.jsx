import {
  Grid,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import WhyInterest from "../../Application/InterestProfile/Tabs/WhyInterest/WhyInterest";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";

const AuthorPublicationsEvents = ({ authorNameProps }) => {
  const [allPublicationList, setAllPublicationList] = useState([]);

  useEffect(() => {
    getAllAuthorPublicationList();
  }, []);
  useEffect(() => {
    getAllAuthorPublicationList();
  }, [authorNameProps]);
  const getAllAuthorPublicationList = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "author/" + authorNameProps + "/publications/"
    );
    const response = await request.json();
    setAllPublicationList(response["publicationList"]);
  };

  return (
    <Grid item xs={12} sx={{ margin: "20px" }}>
      {allPublicationList && allPublicationList.length > 0 && (
        <Paper elevation={0}>
          <Grid container>
            <Grid item xs={12}>
              {allPublicationList && (
                <WhyInterest papers={allPublicationList} />
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};
export default AuthorPublicationsEvents;
