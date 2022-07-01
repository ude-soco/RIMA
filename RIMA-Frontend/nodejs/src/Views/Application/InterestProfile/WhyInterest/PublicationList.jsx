import {
    Avatar,
    Box,
    Button,
    Collapse,
    Grid,
    IconButton,
    Paper,
    Typography
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SchoolIcon from '@material-ui/icons/School';

const PublicationList = (props) => {
    const { publication } = props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen((prevState) => !prevState);
    };

    const getRandomColor = () => {
        const colors = [
            "#303F9F",
            "#453187",
            "#A52885",
            "#F4888B",
            "#F39617",
            "#2EB2A5"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Box style={{ marginBottom: 8 }}>
            <Paper style={{ padding: 16 }}>
                <Grid container>
                    <Grid item xs={1}>
                        <Typography variant="body2" color="textSecondary">
                            {" "}
                            {publication.year}{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography
                            variant="body2"
                            style={{ fontWeight: "bold" }}
                            color="textSecondary"
                        >
                            {" "}
                            {publication.title}{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="body2" color="textSecondary">
                            {" "}
                            {publication.authors}{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton
                            onClick={handleOpen}
                            style={{ transform: open ? "rotate(180deg)" : "" }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <Collapse in={open}>
                    <Grid container style={{ paddingBottom: 16 }}>
                        <Grid item xs={12} style={{ paddingTop: 24, paddingBottom: 24 }}>
                            <Typography variant="h6"> {publication.title}</Typography>
                        </Grid>
                        {publication.authors.split(",").map((author) => {
                            return (
                                <>
                                    <Grid item style={{ marginBottom: 16 }} xs={3}>
                                        <Grid container alignItems="center">
                                            <Grid item xs={3}>
                                                <Avatar style={{ backgroundColor: getRandomColor()}}>
                                                    {author.split(" ")[0].charAt(0)}
                                                </Avatar>
                                            </Grid>
                                            <Grid item xs={9} style={{paddingLeft:16}}>
                                                <Typography variant="body2"> {author}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            );
                        })}
                        <Grid item xs={12} style={{ marginTop: 16 }}>
                            <Typography style={{ fontWeight: "bold" }}>Abstract</Typography>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: 8 }}>
                            <Typography> {publication.abstract} </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: 32 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => window.open(publication.url, "_blank")}
                                startIcon={<SchoolIcon/>}
                            >
                                Semantic Scholar{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default PublicationList;
