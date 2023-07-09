import {
  Grid,
  Typography,
  Link,
  Card,
  CardContent,
  Avatar,
  Box,
  Paper,
} from "@mui/material";

import React from "react";

const AuthorDetails = ({ authorDataProp }) => {
  const {
    author_name = "",
    publication_counts,
    Author_publications,
    semantic_scolar_author_id,
    author_url,
    author_keywords,
    author_interests,
  } = authorDataProp;
  const firstLetter = author_name ? author_name.charAt(0) : "";

  return (
    <Grid container justify="center" xs={12}>
      <Card
        variant="outlined"
        sx={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        <Box m={5}>
          <Avatar color="primary" sx={{ fontSize: 40, width: 80, height: 80 }}>
            {firstLetter}
          </Avatar>
        </Box>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {`Author Name: ${author_name}`}
          </Typography>
          <Typography variant="body2">
            {`Author ID: ${semantic_scolar_author_id}`}
          </Typography>
          <Typography variant="body2">
            {`Author Profile URL: `}
            <Link href={author_url} target="_blank" rel="noopener noreferrer">
              {author_url}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AuthorDetails;
