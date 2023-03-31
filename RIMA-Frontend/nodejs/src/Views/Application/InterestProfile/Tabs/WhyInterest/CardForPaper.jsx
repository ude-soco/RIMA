import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    ButtonGroup, Card, CardHeader, Collapse, Avatar, CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Grid, IconButton,
    Typography,
    Popover

} from "@material-ui/core";
import SchoolIcon from '@material-ui/icons/School';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import {indigo} from "@material-ui/core/colors";


function highlighter(
    keyword,
    originalText,
) {
    let color = indigo[300]
    return `<a  style="color:${color}">${originalText}</a>`;
}
function modifyText(text, keywords){
    let modifiedText = text;
    let replaceList = [];
    console.log("test funtion", keywords)
    for (let i in keywords){
        let keyword = keywords[i]
        let regEx = new RegExp(keyword,"ig" )
        let matches = regEx.exec(modifiedText)

        console.log(matches, "test regEx before break", keyword)
        if (matches === null){
            continue
        }
        let originalText = matches[0]
        let replaceKey=btoa(unescape(encodeURIComponent(keyword)))
        const replaceText = highlighter(keyword,originalText)
        replaceKey = `<-${replaceKey}->`
        replaceList.push({ replaceKey, replaceText })
        modifiedText = modifiedText.replace(regEx, replaceKey);

        console.log(btoa(unescape(encodeURIComponent(keyword))), "test regEx")

    }
    replaceList.forEach(({ replaceKey, replaceText }) => modifiedText = modifiedText.replaceAll(replaceKey, replaceText))
    return(modifiedText)

}

function ModifiedAbstract ({paper, originalKeywords})  {
    let modifiedAbstract = modifyText(paper.abstract, originalKeywords)
    console.log(modifiedAbstract, "test abstract")
    return(
        <Typography
            variant="body1"
            align="justify" sx={{ padding: '0px 15px' }}
            dangerouslySetInnerHTML={{ __html: modifiedAbstract }}
        />
    )
}

function ModifiedTitle ({paper, originalKeywords})  {
    let modifiedTitle = modifyText(paper.title, originalKeywords)

    return(
        <Typography
            variant="h5"
            align="justify" sx={{ padding: '0px 15px' }}
            dangerouslySetInnerHTML={{ __html: modifiedTitle }}
        />
    )
}

const CardForPaper = (props) => {
    const {paper, originalKeywords} = props;
    const listAuthors=paper.authors.split(",");
    const [expanded, setExpanded] = useState(false);


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };



    return (
        <Card style={{ width: 500 }}>
            <CardHeader
                title={
                    <Grid container spacing={1} direction="row">
                        <Grid item xs={2}>
                            <Typography> {paper.year}  </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography> {paper.title} </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography> {paper.authors} </Typography>
                        </Grid>
                    </Grid>
                }
                action={
                    <IconButton
                        style={{
                            transform: expanded ? "rotate(180deg)" : "",
                            marginTop: 8
                        }}
                        onClick={handleExpandClick}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                }
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent style={{ padding: 24 }}>
                    <Grid container direction="column">
                        <ModifiedTitle paper={paper} originalKeywords={originalKeywords}/>


                        <Grid container style={{ paddingBottom: 16 }}>

                            <Grid container alignItems="center" style={{ paddingBottom: 32 }} item xs={8}>
                                <Avatar style={{ marginRight: 16, backgroundColor: "orange" }}>
                                    {listAuthors[0].split(" ")[0][0]}{listAuthors[0].split(" ")[1][0]}
                                </Avatar>
                                <Typography variant="h6">{paper.authors.split(",")[0]}</Typography>
                            </Grid>
                            <Grid container alignItems="center" style={{ paddingBottom: 32 }} item xs={4}>
                                <Typography >
                                    published in: {paper.year}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{ fontWeight: "bold" }}>Abstract </Typography>
                                {paper.original_keywords?<ModifiedAbstract paper={paper}
                                                                           originalKeywords={originalKeywords}/>:
                                    <ModifiedAbstract paper={paper} originalKeywords={originalKeywords}/>}


                            </Grid>


                        </Grid>
                        <Grid item xs={12} >
                            <Button startIcon={<SchoolIcon />} style={{ color: "orange" }} target="_blank" href={paper.url}>Semantic scholar</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default CardForPaper
