import React, { useState } from "react";
import {
  Button as ButtonMUI,
  Paper,
  Grid,
  Hidden,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Flowchart from "./Flowchart";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const useStyles = makeStyles((theme) => ({
  paperCustom: {
    width:"100%",
    padding: "1rem",
    fontFamily: "roboto",
  },
  typographyCustom: {
    padding:"15px 0px",
    textAlign: "center",
    "& span":{
        fontSize:"1.2rem"
    }
  },
  dividerCustom: {
    marginTop: "2rem"
  },  
  collapseButton: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    },
  itemBox: {
    margin: 0,
    padding: 10
  }
}));




export default function HowOverview({ paper }) {
  const classes = useStyles();
  const [moreDetail, setMoreDetail] = useState(false);

// Data
    var lessDetailFlowchart = [
    // nodes
    {
        data: {
        id: "oneLess",
        label: "INTEREST MODEL",
        faveColor: "#303F9F",
        shape: "polygon",
        borderStyle: "solid ",
        },
        position: { x: 100, y: 50 },
        locked: true
    },
    {
        data: {
        id: "twoLess",
        label: "PUBLICATION",
        faveColor: "#F39617",
        shape: "polygon",
        borderStyle: "solid ",
        },
        position: { x: 500, y: 50 },
        locked: true
    },
    {
        data: {
        id: "threLess",
        label: "INTERESTS",
        faveColor: "#303F9F",
        shape: "polygon",
        borderStyle: "solid ",
        tooltip:"<p>Interests from your<br />current interest<br />model</p>"
        },
        classes: "withTooltip",
        position: { x: 100, y: 200 },
        locked: true
    },
    {
        data: {
        id: "fourLess",
        label: "KEYWORDS",
        faveColor: "#F39617",
        shape: "polygon",
        borderStyle: "solid ",
        tooltip:"<p>Publication keywords extracted<br />from the current publication</p>"
        },
        classes: "withTooltip",
        position: { x: 500, y: 200 },
        locked: true
    },
    {
        data: {
        id: "fiveLess",
        label: "INTEREST MODEL EMBEDDING",
        faveColor: "#303F9F",
        shape: "polygon",
        borderStyle: "dashed ",
        tooltip:"<p>An interest model embedding<br />is a vector representation of<br />an interest model</p>"
        },
        classes: "withTooltip",
        position: { x: 100, y: 350 },
        locked: true
    },
    {
        data: {
        id: "sixLess",
        label: "PUBLICATION EMBEDDING",
        faveColor: "#F39617",
        shape: "polygon",
        borderStyle: "dashed ",
        tooltip:"<p>A publication embedding<br />is a vector representation<br />of a publication</p>"
        },
        classes: "withTooltip",
        position: { x: 500, y: 350 },
        locked: true
    },
    {
        data: {
        id: "sevenLess",
        label: "SIMILARITY SCORE:  "+paper.score+"%",
        faveColor: "#000000",
        shape: "polygon",
        borderStyle: "solid ",
        tooltip:"<p>Similarity score for this publication</p>"

        },
        classes: "withTooltip",
        position: { x: 300, y: 500 },
        locked: true
    },
    // edges
    { data: { source: "oneLess", target: "threLess", label: "" ,faveColor: "#303F9F", lineStyle: "solid "} },
    { data: { source: "twoLess", target: "fourLess", label: "" ,faveColor: "#F39617", lineStyle: "solid "} },
    { data: { source: "threLess", target: "fiveLess", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
    { data: { source: "fourLess", target: "sixLess", label: "" ,faveColor: "#F39617", lineStyle: "solid"} },
    { data: { source: "sixLess", target: "sevenLess", label: "" ,faveColor: "#F39617", lineStyle: "dashed "} },
    { data: { source: "fiveLess", target: "sevenLess", label: "" ,faveColor: "#303F9F", lineStyle: "dashed "} },
    ];

    var moreDetailFlowchart = [
      // nodes

      {
        data: {
          id: "oneMore",
          label: "INTEREST MODEL",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "solid ",
        },
        position: { x: 80, y: 50 },
        locked: true
      },
      {
        data: {
          id: "twoMore",
          label: "PUBLICATION",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "solid ",
        },
        position: { x: 680, y: 50 },
        locked: true
      },
      {
        data: {
          id: "threeMore",
          label: "INTEREST",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "solid",
          tooltip:"<p>An interest from your<br />current interest model</p>"
        },
        classes: "withTooltip",
        position: { x: -100, y: 150 },
        locked: true
      },
      { data: { id: 'etc1',label: "" } ,
      classes:"etc",
      position: { x: 80, y: 150 },
      locked: true},
      {
        data: {
          id: "fourMore",
          label: "INTEREST",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "solid",
          tooltip:"<p>An interest from your<br />current interest model</p>"

        },
        classes: "withTooltip",
        position: { x: 250, y: 150 },
        locked: true
      },
      {
        data: {
          id: "fiveMore",
          label: "PUBLICATION KEYWORD",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "solid",
          tooltip:"<p>A publication keyword<br />extracted from the<br />current publication</p>"

        },
        classes: "withTooltip",
        position: { x: 500, y: 150 },
        locked: true
      },
      { data: { id: 'etc2',label: "" } ,
      classes:"etc",
      position: { x: 680, y: 150 },
      locked: true},
      {
        data: {
          id: "sixMore",
          label: "PUBLICATION KEYWORD",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "solid",
          tooltip:"<p>A publication keyword<br />extracted from the<br />current publication</p>"
        },
        classes: "withTooltip",
        position: { x: 850, y: 150 },
        locked: true
      },
      {
        data: {
          id: "sevenMore",
          label: "EMBEDDING ",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Compution of the interest<br />embedding using SIFrank<br />algorithm</p>"

        },
        classes: "withTooltip",
        position: { x: -100, y: 250 },
        locked: true
      },
      { data: { id: 'etc3',label: "" } ,
      classes:"etc",
      position: { x: 80, y: 250 },
      locked: true},
      {
        data: {
          id: "eightMore",
          label: "EMBEDDING",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Compution of the interest<br />embedding using SIFrank<br />algorithm</p>"
        },
        classes: "withTooltip",
        position: { x: 250, y: 250 },
        locked: true
      },
      ,
      {
        data: {
          id: "nineMore",
          label: "EMBEDDING ",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Computation of the<br />publication keyword<br />embedding using SIFrank<br />algorithm</p>"

        },
        classes: "withTooltip",
        position: { x: 500, y: 250 },
        locked: true
      },
      { data: { id: 'etc4',label: "" } ,
      classes:"etc",
      position: { x: 680, y: 250 },
      locked: true},
      {
        data: {
          id: "tenMore",
          label: "EMBEDDING",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Computation of the<br />publication keyword<br />embedding using SIFrank<br />algorithm</p>"
        },
        classes: "withTooltip",
        position: { x: 850, y: 250 },
        locked: true
      },
      {
        data: {
          id: "elevenMore",
          label: "INTEREST EMBEDDING",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>An interest embedding is<br />a vector representation<br />of an interest</p>"
        },
        classes: "withTooltip",
        position: { x: -100, y: 350 },
        locked: true
      },
      { data: { id: 'etc5',label: "" } ,
      classes:"etc",
      position: { x: 80, y: 350 },
      locked: true},
      {
        data: {
          id: "twelveMore",
          label: "INTEREST EMBEDDING",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>An interest embedding is<br />a vector representation<br />of an interest</p>"
        },
        classes: "withTooltip",
        position: { x: 250, y: 350 },
        locked: true
      },
      {
        data: {
          id: "thirteenMore",
          label: "PUBLICATION KEYWORD EMBEDDING",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>A publication keyword<br />embedding is a vector<br />representation of a<br />publication keyword</p>"
        },
        classes: "withTooltip",
        position: { x: 500, y: 350 },
        locked: true
      },
      { data: { id: 'etc6',label: "" } ,
      classes:"etc",
      position: { x: 680, y: 350 },
      locked: true},
      {
        data: {
          id: "fourteenMore",
          label: "PUBLICATION KEYWORD EMBEDDING",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>A publication keyword<br />embedding is a vector<br />representation of a<br />publication keyword</p>"
        },
        classes: "withTooltip",
        position: { x: 850, y: 350 },
        locked: true
      },
      {
        data: {
          id: "fifteenMore",
          label: "WEIGHTED AVERAGE",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Computation of the<br />weighted average of all<br />interest embeddings </p>"
        },
        classes: "withTooltip",
        position: { x: 80, y: 450 },
        locked: true
      },
      {
        data: {
          id: "sixteenMore",
          label: "WEIGHTED AVERAGE",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Computation of the weighted<br />average of all publication<br />keyword embeddings </p>"
        },
        classes: "withTooltip",
        position: { x: 680, y: 450 },
        locked: true
      },
      {
        data: {
          id: "seventeenMore",
          label: "INTEREST MODEL EMBEDDING",
          faveColor: "#303F9F",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>An interest model<br />embedding is a vector<br />represenation of an<br />interest model</p>"
        },
        classes: "withTooltip",
        position: { x: 80, y: 550 },
        locked: true
      },
      {
        data: {
          id: "eighteenMore",
          label: "PUBLICATION EMBEDDING",
          faveColor: "#F39617",
          shape: "polygon",
          borderStyle: "dashed ",
          tooltip:"<p>A publication embedding<br />is a vector represenation<br />of a publication</p>"
        },
        classes: "withTooltip",
        position: { x: 680, y: 550 },
        locked: true
      },
      {
        data: {
          id: "nineteenMore",
          label: "COSINE SIMILARITY",
          faveColor: "black",
          shape: "rectangle",
          borderStyle: "solid",
          tooltip:"<p>Similarity is calculated<br />using cosine similarity<br />between the embeddings</p>"
        },
        classes: "withTooltip",
        position: { x: 380, y: 650 },
        locked: true
      },
      ,
      {
        data: {
          id: "twentyMore",
          label: "SIMILARITY SCORE:"+paper.score+"%",
          faveColor: "black",
          shape: "polygon",
          borderStyle: "solid",
          tooltip:"<p>Similarity score for this publication</p>"
        },
        classes: "withTooltip",
        position: { x: 380, y: 750 },
        locked: true
      },
      // edges
      { data: { source: "oneMore", target: "threeMore", label: "" ,faveColor: "#303F9F", lineStyle: "solid " } },
      { data: { source: "oneMore", target: "fourMore", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
      { data: { source: "twoMore", target: "fiveMore", label: "", faveColor: "#F39617",lineStyle: "solid " } },
      { data: { source: "twoMore", target: "sixMore", label: "",faveColor: "#F39617", lineStyle: "solid " } },
      { data: { source: "threeMore", target: "sevenMore", label: "", faveColor: "#303F9F",lineStyle: "solid " } },
      { data: { source: "fourMore", target: "eightMore", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
      { data: { source: "fiveMore", target: "nineMore", label: "", faveColor: "#F39617",lineStyle: "solid " } },
      { data: { source: "sixMore", target: "tenMore", label: "",faveColor: "#F39617", lineStyle: "solid " } },
      { data: { source: "sevenMore", target: "elevenMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "eightMore", target: "twelveMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "nineMore", target: "thirteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "tenMore", target: "fourteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "elevenMore", target: "fifteenMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "twelveMore", target: "fifteenMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "thirteenMore", target: "sixteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "fourteenMore", target: "sixteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "fifteenMore", target: "seventeenMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "sixteenMore", target: "eighteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "seventeenMore", target: "nineteenMore", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
      { data: { source: "eighteenMore", target: "nineteenMore", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
      { data: { source: "nineteenMore", target: "twentyMore", label: "",faveColor: "black", lineStyle: "solid " } },
    ];

  const moreDetailFlowchartBox = <Flowchart elements={moreDetailFlowchart} height={400} xStartPoint={50}  yStartPoint={10} style={{border: "0.5px solid #E7E7E7",borderRadius: 8}} layout={{
    name: "preset",
    spacingFactor: 1,
    avoidOverlap: true,
    fit: true,
    padding: 10,
    animate: true,
    animationDuration: 500,
  }}/>;
  const lessDetailFlowchartBox = <Flowchart elements={lessDetailFlowchart} height={400} xStartPoint={170}  yStartPoint={0} style={{border: "0.5px solid #E7E7E7",borderRadius: 8}} layout={{
    name: "preset",
    spacingFactor: 1,
    avoidOverlap: true,
    fit: true,
    padding: 10,
    animate: true,
    animationDuration: 500,
  }}/>

  return (
    <Paper  className={classes.paperCustom} elevation={0}>

       <Grid container direction="row" spacing={0}>
        <Grid item sx={12} sm={12}>
            {!moreDetail ?
                <ButtonMUI
                  variant="string"
                  size="small"
                  className={classes.collapseButton}
                  onClick={() => {
                    setMoreDetail(true);
                  }}
                >
                  <AddCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    More
                  </Typography>
                </ButtonMUI>
                :
                <ButtonMUI
                  variant="string"
                  size="small"
                  className={classes.collapseButton}
                  onClick={() => {
                    setMoreDetail(false);
                  }}
                >
                  <RemoveCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    Less
                  </Typography>
                </ButtonMUI>
              }
        </Grid>
      </Grid> 
      <Grid container direction="row" justify="space-between">
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
        <Grid
          item
          xs={11}
          sm={12}
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          style={{ maxHeight: "400px", height: "400px" }}
        >
          {moreDetail ? moreDetailFlowchartBox : lessDetailFlowchartBox}
        </Grid>
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
      </Grid>
    </Paper>
  );
}
