import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";

const Header = () => {
    return (
        <Box style={{ marginBottom: 8 }}>
            <Paper style={{ padding: 16 }}>
                <Grid container>
                    <Grid item xs={1}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            {" "}
                            Year{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            {" "}
                            Title{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            {" "}
                            Author{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </Paper>
        </Box>
    );
};

export default Header;
