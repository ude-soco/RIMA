import React, {useState} from "react";
import {Divider, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import {
  faBars,
  faBookReader,
  faBrain,
  faChartBar, faChartLine,
  faChartPie,
  faCloud, faCogs, faHandshake,
  faPlus,
  faTasks, faUser, faUserFriends,
  faWaveSquare
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from "react-router-dom";
import {getItem} from "../../../../Services/utils/localStorage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolBar: theme.mixins.toolbar,
  listIcon: {
    paddingLeft: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  divider: {
    backgroundColor: theme.palette.grey[300],
  },
  text: {
    color: theme.palette.grey[700],
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  nestedIndicators: {
    paddingLeft: theme.spacing(6)
  },
  nestedSaved: {
    paddingLeft: theme.spacing(4)
  },
  root: {
    width: '100%',
    maxWidth: drawerWidth,
  },
}));


export default function SideBar({selection, setSelection}) {
  const classes = useStyles();
  const history = useHistory()


  const handleSelect = (e) => {
    setSelection(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "addPublication":
        history.push("/app/add-paper")
        break;
      case "myPublications":
        history.push("/app/view-paper");
        break;
      case "interestOverview":
        history.push("/app/cloud-chart/");
        break;
      case "recentInterest":
        history.push("/app/pie-chart/");
        break;
      case "activities":
        history.push("/app/bar-chart/");
        break;
      case "potentialInterest":
        history.push("/app/concept-chart/");
        break;
      case "interestTrends":
        history.push("/app/stream-chart/");
        break;
      case "tweetsAndPeople":
        history.push("/recommendation/twitter-scanner/" + getItem("userId"))
        break;
      case "publications":
        history.push("/app/topicsrecommend/" + getItem("userId"))
        break;
      case "topicTrends":
        history.push("/app/topicbar/" + getItem("userId"))
        break;
      case "compareConferences":
        history.push("/app/topicsresearch/" + getItem("userId"));
        break;
      case "compareResearchers":
        history.push("/app/topicsauthors/" + getItem("userId"));
        break;
      case "myProfile":
        history.push('/app/user-profile');
        break;
    }
  }

  return (
    <>
      <Grid container justify="center" alignItems="center" className={classes.toolBar}>
        <img src={"/images/rimaLogo.svg"} height='38' alt="Logo"/>
      </Grid>
      <Divider className={classes.divider}/>

      <List className={classes.text}>
        <ListItem button id="addPublication"
                  selected={selection === "addPublication"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faPlus} />
          </ListItemIcon>
          <ListItemText primary="Add Publication" />
        </ListItem>

        <ListItem button id="myPublications"
                  selected={selection === "myPublications"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faTasks}/>
          </ListItemIcon>
          <ListItemText primary="My Publications"/>
        </ListItem>

        <Divider className={classes.divider}/>

        <ListItem button id="interestOverview"
                  selected={selection === "interestOverview"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faCloud}/>
          </ListItemIcon>
          <ListItemText primary="Interest Overview"/>
        </ListItem>

        <ListItem button id="recentInterest"
                  selected={selection === "recentInterest"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faChartPie}/>
          </ListItemIcon>
          <ListItemText primary="Recent Interest"/>
        </ListItem>

        <ListItem button id="activities"
                  selected={selection === "activities"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faChartBar}/>
          </ListItemIcon>
          <ListItemText primary="Activities"/>
        </ListItem>

        <ListItem button id="potentialInterest"
                  selected={selection === "potentialInterest"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faBrain}/>
          </ListItemIcon>
          <ListItemText primary="Potential Interest"/>
        </ListItem>

        <ListItem button id="interestTrends"
                  selected={selection === "interestTrends"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faWaveSquare}/>
          </ListItemIcon>
          <ListItemText primary="Interest Trends"/>
        </ListItem>

        <Divider className={classes.divider}/>

        <ListItem button id="tweetsAndPeople"
                  selected={selection === "tweetsAndPeople"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faBars}/>
          </ListItemIcon>
          <ListItemText primary="Tweets and People"/>
        </ListItem>

        <ListItem button id="publications"
                  selected={selection === "publications"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faBookReader}/>
          </ListItemIcon>
          <ListItemText primary="Publications"/>
        </ListItem>

        <Divider className={classes.divider}/>

        <ListItem button id="topicTrends"
                  selected={selection === "topicTrends"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faChartLine}/>
          </ListItemIcon>
          <ListItemText primary="Topic Trends"/>
        </ListItem>

        <ListItem button id="compareConferences"
                  selected={selection === "compareConferences"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faHandshake}/>
          </ListItemIcon>
          <ListItemText primary="Compare Conferences"/>
        </ListItem>

        <ListItem button id="compareResearchers"
                  selected={selection === "compareResearchers"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faUserFriends}/>
          </ListItemIcon>
          <ListItemText primary="Compare Researchers"/>
        </ListItem>

        <Divider className={classes.divider}/>

        <ListItem button id="myProfile"
                  selected={selection === "myProfile"}
                  onClick={handleSelect}>
          <ListItemIcon className={classes.listIcon}>
            <FontAwesomeIcon icon={faUser}/>
          </ListItemIcon>
          <ListItemText primary="My Profile"/>
        </ListItem>

      </List>

    </>
  );
}
