import React from "react";
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import {
  faBars,
  faBookReader,
  faBrain,
  faChartBar,
  faChartLine,
  faChartPie,
  faCloud,
  faHandshake,
  faPlus,
  faTasks,
  faUserFriends,
  faWaveSquare
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Container, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {getItem} from "../../../../Services/utils/localStorage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    marginTop: 32,
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#172B4D",
    color: theme.palette.common.white
  },
  icons: {
    marginLeft: 16,
    color: theme.palette.common.white
  },
  divider: {
    backgroundColor: '#fff',
    margin: theme.spacing(1, 0, 1, 0)
  },
  logo: {
    margin: theme.spacing(3, 0, 2, 0)
  },
  text: {
    textAlign: "center",
    color: '#fff'
  }
}));


export default function SideBar(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.open}
        onClose={props.toggleOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div
          role="presentation"
          onKeyDown={props.toggleOpen}
        >
          <Container className={classes.logo}>
            <Row className="align-items-center">
              <Col>
                <h1 className={classes.text}><b>RIMA</b></h1>
              </Col>
            </Row>
          </Container>

          <Divider className={classes.divider}/>

          <List>
            <ListItem button onClick={() => history.push("/app/add-paper")}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faPlus} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Add Publication"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/view-paper")}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faTasks} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="My Publication"/>
            </ListItem>

            <Divider className={classes.divider}/>

            <ListItem button onClick={() => history.push("/app/cloud-chart/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faCloud} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Interest Overview"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/pie-chart/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faChartPie} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Recent Interest"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/bar-chart/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faChartBar} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Activities"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/concept-chart/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBrain} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Potential Interest"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/stream-chart/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faWaveSquare} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Interest Trends"/>
            </ListItem>

            <Divider className={classes.divider}/>

            <ListItem button onClick={() => history.push("/recommendation/twitter-scanner/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBars} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Tweets & People"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/topicsrecommend/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBookReader} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Publications"/>
            </ListItem>

            <Divider className={classes.divider}/>

            <ListItem button onClick={() => history.push("/app/topicbar/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faChartLine} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Topic Trends"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/topicsresearch/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faHandshake} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Compare Conference"/>
            </ListItem>

            <ListItem button onClick={() => history.push("/app/topicsauthors/" + getItem("userId"))}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faUserFriends} className={classes.icons}/>
              </ListItemIcon>
              <ListItemText primary="Compare Researcher"/>
            </ListItem>

          </List>
        </div>
      </Drawer>
    </>
  );
}
