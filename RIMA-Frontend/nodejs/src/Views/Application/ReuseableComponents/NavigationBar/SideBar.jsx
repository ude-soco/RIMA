import React, {useState} from "react";
import {Collapse, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {getItem} from "../../../../Services/utils/localStorage";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CloudIcon from '@material-ui/icons/Cloud';
import PieChartIcon from '@material-ui/icons/PieChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import TimelineIcon from '@material-ui/icons/Timeline';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import TwitterIcon from '@material-ui/icons/Twitter';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import GroupIcon from '@material-ui/icons/Group';
import BusinessIcon from '@material-ui/icons/Business';
import BookIcon from '@material-ui/icons/Book';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import SettingsIcon from '@material-ui/icons/Settings';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolBar: theme.mixins.toolbar,
  listIcon: {
    paddingLeft: theme.spacing(2),
  },
  listIconNested: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(3),
  },
  selectedList: {
    color: theme.palette.primary.dark,
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
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openSettings, setOpenSettings] = useState(true);
  const [openRecommendation, setOpenRecommendation] = useState(true);
  const [openConference, setOpenConference] = useState(true);


  const handleSelect = (e) => {
    setSelection(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "dashboard":
        history.push("/app/dashboard")
        break;
      case "addPublication":
        history.push("/app/add-paper")
        break;
      case "myPublications":
        history.push("/app/view-paper");
        break;
      // case "interestOverview":
      //   history.push("/app/cloud-chart/");
      //   break;
      // case "recentInterest":
      //   history.push("/app/pie-chart/");
      //   break;
      // case "activities":
      //   history.push("/app/bar-chart/");
      //   break;
      // case "potentialInterest":
      //   history.push("/app/concept-chart/");
      //   break;
      // case "interestTrends":
      //   history.push("/app/stream-chart/");
      //   break;
      case "tweetsAndPeople":
        history.push("/recommendation/twitter-scanner/" + getItem("userId"))
        break;
      case "topicRecommendation":
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

  const selectedList = (name) => {
    if (selection === name)
      return classes.selectedList
    else return "";
  }

  return (
    <>
      <Grid container justify="center" alignItems="center" className={classes.toolBar}>
        <img src={"/images/rimaLogo.svg"} height='38' alt="Logo"/>
      </Grid>
      <Divider className={classes.divider}/>


      {/* DASHBOARD */}
      <List className={classes.text}>
        <ListItem button id="dashboard"
                  selected={selectedList("dashboard")}
                  onClick={handleSelect}
                  className={selectedList("dashboard")}>
          <ListItemIcon className={classes.listIcon}>
            <DashboardIcon className={selectedList("dashboard")}/>
          </ListItemIcon>
          <ListItemText primary="Dashboard"/>
        </ListItem>

        {/* TODO: To be removed */}
        {/*<ListItem button id="interestOverview"*/}
        {/*          selected={selectedList("interestOverview")}*/}
        {/*          onClick={handleSelect}*/}
        {/*          className={selectedList("interestOverview")}>*/}
        {/*  <ListItemIcon className={classes.listIconNested}>*/}
        {/*    <CloudIcon className={selectedList("interestOverview")}/>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Interest Overview"/>*/}
        {/*</ListItem>*/}

        {/*<ListItem button id="recentInterest"*/}
        {/*          selected={selectedList("recentInterest")}*/}
        {/*          onClick={handleSelect}*/}
        {/*          className={selectedList("recentInterest")}>*/}
        {/*  <ListItemIcon className={classes.listIconNested}>*/}
        {/*    <PieChartIcon className={selectedList("recentInterest")}/>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Recent Interest" className={selectedList("recentInterest")}/>*/}
        {/*</ListItem>*/}

        {/*<ListItem button id="activities"*/}
        {/*          selected={selectedList("activities")}*/}
        {/*          onClick={handleSelect}*/}
        {/*          className={selectedList("activities")}>*/}
        {/*  <ListItemIcon className={classes.listIconNested}>*/}
        {/*    <BarChartIcon className={selectedList("activities")}/>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Activities"/>*/}
        {/*</ListItem>*/}

        {/*<ListItem button id="potentialInterest"*/}
        {/*          selected={selectedList("potentialInterest")}*/}
        {/*          onClick={handleSelect}*/}
        {/*          className={selectedList("potentialInterest")}>*/}
        {/*  <ListItemIcon className={classes.listIconNested}>*/}
        {/*    <TimelineIcon className={selectedList("potentialInterest")}/>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Potential Interest"/>*/}
        {/*</ListItem>*/}

        {/*<ListItem button id="interestTrends"*/}
        {/*          selected={selectedList("interestTrends")}*/}
        {/*          onClick={handleSelect}*/}
        {/*          className={selectedList("interestTrends")}>*/}
        {/*  <ListItemIcon className={classes.listIconNested}>*/}
        {/*    <TrendingUpIcon className={selectedList("interestTrends")}/>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Interest Trends"/>*/}
        {/*</ListItem>*/}


        {/* RECOMMENDATION */}
        <ListItem button onClick={() => setOpenRecommendation(!openRecommendation)}>
          <ListItemIcon className={classes.listIcon}>
            <ThumbsUpDownIcon/>
          </ListItemIcon>
          <ListItemText primary="Recommendation"/>
          {openRecommendation ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={openRecommendation} unmountOnExit>
          <ListItem button id="tweetsAndPeople"
                    selected={selectedList("tweetsAndPeople")}
                    onClick={handleSelect}
                    className={selectedList("tweetsAndPeople")}>
            <ListItemIcon className={classes.listIconNested}>
              <TwitterIcon className={selectedList("tweetsAndPeople")}/>
            </ListItemIcon>
            <ListItemText primary="Tweets and People"/>
          </ListItem>

          <ListItem button id="topicRecommendation"
                    selected={selectedList("topicRecommendation")}
                    onClick={handleSelect}
                    className={selectedList("topicRecommendation")}>
            <ListItemIcon className={classes.listIconNested}>
              <BookIcon className={selectedList("topicRecommendation")}/>
            </ListItemIcon>
            <ListItemText primary="Topic Recommendation"/>
          </ListItem>

          <ListItem button id="topicTrends"
                    selected={selectedList("topicTrends")}
                    onClick={handleSelect}
                    className={selectedList("topicTrends")}>
            <ListItemIcon className={classes.listIconNested}>
              <MultilineChartIcon className={selectedList("topicTrends")}/>
            </ListItemIcon>
            <ListItemText primary="Topic Trends"/>
          </ListItem>
        </Collapse>


        {/* CONFERENCES */}
        <ListItem button onClick={() => setOpenConference(!openConference)}>
          <ListItemIcon className={classes.listIcon}>
            <BusinessIcon/>
          </ListItemIcon>
          <ListItemText primary="Conferences"/>
          {openConference ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={openConference} unmountOnExit>
          <ListItem button id="compareConferences"
                    selected={selectedList("compareConferences")}
                    onClick={handleSelect}
                    className={selectedList("compareConferences")}>
            <ListItemIcon className={classes.listIconNested}>
              <BusinessIcon className={selectedList("compareConferences")}/>
            </ListItemIcon>
            <ListItemText primary="Compare Conferences"/>
          </ListItem>

          <ListItem button id="compareResearchers"
                    selected={selectedList("compareResearchers")}
                    onClick={handleSelect}
                    className={selectedList("compareResearchers")}>
            <ListItemIcon className={classes.listIconNested}>
              <GroupIcon className={selectedList("compareResearchers")}/>
            </ListItemIcon>
            <ListItemText primary="Compare Researchers"/>
          </ListItem>
        </Collapse>


        {/* SETTINGS */}
        <ListItem button onClick={() => setOpenSettings(!openSettings)}>
          <ListItemIcon className={classes.listIcon}>
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText primary="Settings"/>
          {openSettings ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={openSettings} unmountOnExit>
          <ListItem button id="myProfile"
                    selected={selectedList("myProfile")}
                    onClick={handleSelect}
                    className={selectedList("myProfile")}>
            <ListItemIcon className={classes.listIconNested}>
              <PersonIcon className={selectedList("myProfile")}/>
            </ListItemIcon>
            <ListItemText primary="My Profile"/>
          </ListItem>

          <ListItem button id="addPublication"
                    selected={selectedList("addPublication")}
                    onClick={handleSelect}
                    className={selectedList("addPublication")}>
            <ListItemIcon className={classes.listIconNested}>
              <AddIcon className={selectedList("addPublication")}/>
            </ListItemIcon>
            <ListItemText primary="Add Publication"/>
          </ListItem>

          <ListItem button id="myPublications"
                    selected={selectedList("myPublications")}
                    onClick={handleSelect}
                    className={selectedList("myPublications")}>
            <ListItemIcon className={classes.listIconNested}>
              <LocalLibraryIcon className={selectedList("myPublications")}/>
            </ListItemIcon>
            <ListItemText primary="My Publications"/>
          </ListItem>
        </Collapse>

      </List>

    </>
  );
}
