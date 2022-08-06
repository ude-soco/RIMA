import React from "react";
import Flowchart from "./Flowchart";
import { Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { wordElementProviderWithCoordinate } from "./FlowChartUtil";
import ReactTooltip from "react-tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles((theme) => ({
  paperCustom: {
    width: "100%",
  },
  typographyCustom: {
    padding: "15px 0px",
    textAlign: "center",
    "& span": {
      fontSize: "1.2rem",
    },
  },
  dividerCustom: {
    marginTop: "2rem",
  },
  tooltipText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
}));

/**
 * Render of word list in a flowchart
 * @param {object} props Component props
 * @param {Array<string>} props.words list of words must be show in the flowchart
 * @param {string} props.prefix It's used in the generated ids
 * @param {string} props.title Titel of the flowcharts
 * @param {boolean} props.inclEmbedding  If True, add Weighted average and Embedding nodes
 * @param {string} props.modelLabel  The label of Embedding node. It is used when incEmbedding is True
 * @param {string} props.tooltipContent Content of tooltip
 */
function WordList({
  words,
  prefix,
  title,
  inclEmbedding,
  modelLabel,
  tooltipContent,
}) {
  const classes = useStyles();

  const wordElements = wordElementProviderWithCoordinate(
    words,
    prefix + (inclEmbedding ? "E" : "D"),
    inclEmbedding,
    modelLabel
  );
  const tooltipId = prefix + "tooltip";
  return (
    <Grid container direction="column">
      <Grid item container direction="row">
        <Grid item xs={12}>
          {tooltipContent ? (
            <ReactTooltip
              className={classes.tooltipText}
              place="bottom"
              id={tooltipId}
              effect={"solid"}
            >
              {tooltipContent}
            </ReactTooltip>
          ) : (
            ""
          )}
          <Typography variant="subtitle2" className={classes.typographyCustom}>
            <span className={""}>
              {title}{" "}
              {tooltipContent ? (
                <span data-tip data-for={tooltipId}>
                  <sup>
                    <InfoOutlinedIcon fontSize="small" color="disabled" />
                  </sup>
                </span>
              ) : (
                ""
              )}
            </span>
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs>
        <Paper className={classes.paperCustom} evaluate={0}>
          <Flowchart
            keyChart={prefix}
            elements={wordElements}
            height={400}
            xStartPoint={0}
            yStartPoint={0}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

/**
 * Drawing Get user interest and Generate embeddings steps of the How
 * @param {object} props Component props
 * @param {Array<string>} props.interests list of interets must be show in the flowchart
 * @param {Array<string>} props.keywords list of publication keywords must be show in the flowchart
 * @param {boolean} props.inclEmbedding  If True, add Weighted average and Embedding nodes
 */
export default function HowStep({ interests, keywords, inclEmbedding }) {
  const firstCol = {
    title: "Interest Model",
    prefix: "Interest",
    titleBorderColor: "blue",
    modelLabel: "INTEREST MODEL EMBEDDING",
    tooltipContent: (
      <>
        Consists of
        <Typography
          style={{ fontStyle: "italic" }}
          variant="xx"
          component="span"
        >
          &nbsp;Your Interests
        </Typography>
        &nbsp;and respective weights
      </>
    ),
    words: interests,
  };
  const secondCol = {
    title: "Publication",
    prefix: "Publication",
    titleBorderColor: "orange",
    modelLabel: "PUBLICATION EMBEDDING",
    tooltipContent: (
      <>
        Consists of extracted publication keywords and their respective weights.
        Color is based on the most relevant interest in
        <Typography
          style={{ fontStyle: "italic" }}
          variant="xx"
          component="span"
        >
          &nbsp;Your Interests
        </Typography>
      </>
    ),
    words: keywords,
  };
  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} sm={6}>
        <WordList
          inclEmbedding={inclEmbedding}
          words={firstCol.words}
          modelLabel={firstCol.modelLabel}
          prefix={firstCol.prefix}
          title={firstCol.title}
          tooltipContent={firstCol.tooltipContent}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <WordList
          inclEmbedding={inclEmbedding}
          words={secondCol.words}
          modelLabel={secondCol.modelLabel}
          prefix={secondCol.prefix}
          title={secondCol.title}
          tooltipContent={secondCol.tooltipContent}
        />
      </Grid>
    </Grid>
  );
}
