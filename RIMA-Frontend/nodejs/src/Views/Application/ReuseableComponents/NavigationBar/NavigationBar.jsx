import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {getItem} from "../../../../Services/utils/localStorage";
import axios from "axios";
import {BASE_URL} from "../../../../Services/constants";
import {logout} from "../../../../Services/helper";
import SideBar from "./SideBar";
import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Popper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from '@material-ui/icons/Person';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MenuIcon from "@material-ui/icons/Menu";
import {getRandomColor, toFirstLetter} from "../../../../assets/functions/functions";



const drawerWidth = 300;
let avatarColor = getRandomColor();
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0
    },
  },
  appBar: {
    backgroundColor: "#172B4D",
    zIndex: 7,
  },
  menuButton: {
    [theme.breakpoints.up("lg")]: {
      display: "none"
    },
    color: theme.palette.common.white,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    // backgroundColor: "#172B4D",
    width: drawerWidth,
    zIndex: 6
  },
  buttonSettings: {
    color: theme.palette.common.white,
  },
  avatarName: {
    cursor: "pointer",
    backgroundColor: avatarColor,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3)
  },
  avatarProfile: {
    backgroundColor: avatarColor,
    color: theme.palette.common.white,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  popper: {
    zIndex: 9,
    width: 220
  }
}));


export default function NavigationBar() {
  const [suggestions, setSuggestions] = useState([]);
  const [openAuthors, setOpenAuthors] = useState(null);
  const [openHelp, setOpenHelp] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [openLeftDrawer, setOpenLeftDrawer] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [selection, setSelection] = useState("interestOverview");
  const firstname = localStorage.getItem('name');
  const lastname = localStorage.getItem('lastname');
  const userName = toFirstLetter(firstname) + toFirstLetter(lastname);
  const welcome = firstname + " " + lastname;
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();


  const toggleDrawer = () => {
    setOpenLeftDrawer(!openLeftDrawer);
  }

  const toggleHelpList = (e) => {
    setOpenHelp(e.currentTarget);
  }

  const toggleProfileList = (e) => {
    setOpenProfile(e.currentTarget);
  }

  const openSettings = () => {
    setOpenProfile(null);
    setSelection("myProfile")
    history.push('/app/user-profile');
  }

  const handleLogout = () => {
    setOpenProfile(null);
    setLoggingOut(!loggingOut);
    logout();
  }


  const handleSearchAuthors = (event) => {
    setOpenAuthors(event.currentTarget)
    let {value} = event.target;
    if (value.replace(/\s+/g, '').length > 1) {
      getInfo(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectAuthorComparison = (author) => {
    setSelection(null)
    setSuggestions([]);
    history.push(`/app/profile/${author}`)
  }


  const getInfo = (v) => {
    const TOKEN = getItem("accessToken");
    axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${v}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then(({data}) => {
      setSuggestions(data);
    });
  };

  return (
    <>
      <CssBaseline/>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>

          <Grid container alignItems="center">

            {/* Logo */}
            <Grid item xs>
              <img src={"/images/rimaLogo.svg"} height='38' alt="Logo"/>
            </Grid>


            <Grid item component={Paper} style={{marginRight: 24}}>
              <TextField
                label="Compare with authors"
                variant="filled"
                size="small"
                onChange={handleSearchAuthors}


              />

              <Popper open={suggestions.length} anchorEl={openAuthors} className={classes.popper}>
                <Paper>
                  <List>
                    {suggestions.map((suggestion, index) => {
                      localStorage.setItem("userId", suggestion.id);
                      return (
                        <>
                          <ListItem key={index} button onClick={() => handleSelectAuthorComparison(suggestion.id)}>
                            <ListItemText primary={`${suggestion.first_name} ${suggestion.last_name}`}/>
                          </ListItem>
                          {index !== suggestions.length - 1 ? <Divider/> : <></>}
                        </>
                      )
                    })}
                  </List>
                </Paper>
              </Popper>

            </Grid>

            {/* Help button */}
            <Grid item>
              <Tooltip arrow title="Support">
                <IconButton className={classes.buttonSettings}
                            onClick={toggleHelpList}>
                  <HelpOutlineIcon/>
                </IconButton>
              </Tooltip>

              <Menu
                id="simple-menu"
                anchorEl={openHelp}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
                open={Boolean(openHelp)}
                onClose={() => setOpenHelp(null)}
              >
                <MenuItem>
                  <ListItemText primary='Tour' secondary="Start here for a quick overview of RIMA"/>
                </MenuItem>
                <MenuItem>
                  <ListItemText primary='FAQ' secondary="Frequently Asked Questions"/>
                </MenuItem>
                <Divider/>
                <MenuItem>
                  <ListItemText primary='Feedback' secondary="Send your opinions about our platform"/>
                </MenuItem>
              </Menu>
            </Grid>


            {/* Avatar to show username*/}
            <Grid item>
              <Avatar className={classes.avatarName} onClick={toggleProfileList}>
                {userName}
              </Avatar>

              <Menu
                id="simple-menu"
                anchorEl={openProfile}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
                open={Boolean(openProfile)}
                onClose={() => setOpenProfile(null)}
              >
                <ListItem>
                  <ListItemIcon>
                    <Avatar className={classes.avatarProfile}>
                      {userName}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={<b>{welcome}</b>}/>
                </ListItem>

                <Divider/>

                <MenuItem onClick={openSettings}>
                  <ListItemIcon> <PersonIcon color="primary"/> </ListItemIcon>
                  <ListItemText primary='My Profile'/>
                </MenuItem>

                <Divider/>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon> <ExitToAppIcon color="primary"/> </ListItemIcon>
                  <ListItemText primary='Sign-out'/>
                </MenuItem>
              </Menu>
            </Grid>

          </Grid>

        </Toolbar>

      </AppBar>


      <Box className={classes.drawer} aria-label="side panel">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={openLeftDrawer}
            onClose={toggleDrawer}
            classes={{paper: classes.drawerPaper}}
            ModalProps={{keepMounted: true}}
          >
            <SideBar selection={selection} setSelection={setSelection}/>
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <SideBar selection={selection} setSelection={setSelection}/>
          </Drawer>
        </Hidden>
      </Box>

      {/*Animation for logging out*/}
      <Backdrop className={classes.backdrop} open={loggingOut}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <CircularProgress color="inherit"/>
          </Grid>
          <Grid item>
            <Typography>Logging out</Typography>
          </Grid>
        </Grid>
      </Backdrop>
    </>
  );
}
