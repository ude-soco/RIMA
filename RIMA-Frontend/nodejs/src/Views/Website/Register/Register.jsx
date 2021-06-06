import React, {useState} from "react";
import RestAPI from "../../../Services/api";
import {handleServerErrors} from "../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import {Link, useHistory} from "react-router-dom";
import {
  Avatar,
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Popover,
  TextField,
  Typography
} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.spacing(60),
  },
  paper: {
    margin: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    textTransform: "none",
    backgroundColor: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.common.white
    }
  },
  popover: {
    padding: theme.spacing(2)
  },
  close: {
    marginLeft: theme.spacing(2)
  }
}));

export default function Register() {
  const classes = useStyles();
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    twitterID: '',
    authorID: '',
  })
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState({
    semanticScholar: null,
    twitter: null
  });

  const handleHelper = (e) => {
    setAnchorEl({
      ...anchorEl,
      [e.currentTarget.name]: e.currentTarget
    })
  }
  const handleClose = (e) => {
    setAnchorEl({
      ...anchorEl,
      [e.currentTarget.name]: null
    })
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setDetails(() => ({
      ...details,
      [name]: value
    }))
  };


  const handleSubmit = e => {
    e.preventDefault();
    let data = {
      first_name: details.firstName,
      last_name: details.lastName,
      email: details.email,
      password: details.password,
      twitter_account_id: details.twitterID,
      author_id: details.authorID,
    };

    setIsLoading(true);

    RestAPI.userSignup(data).then(() => {
        setIsLoading(false);
        history.push("/auth/login");
      }
    ).catch(err => {
        setIsLoading(false);
        handleServerErrors(err, toast.error)
      }
    )
  };


  return (
    <>
      <Grid container component={Paper} xs={12} sm={6} md={6} lg={4} className={classes.root}>
        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  // error={formFields.firstnameError.error}
                  // helperText={formFields.firstnameError.message}
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={details.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  // error={formFields.lastnameError.error}
                  // helperText={formFields.lastnameError.message}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={details.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  // error={formFields.emailError.error}
                  // helperText={formFields.emailError.message}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={details.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  // error={formFields.passwordError.error}
                  // helperText={formFields.passwordError.message}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={details.password}
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  // error={formFields.lastnameError.error}
                  // helperText={formFields.lastnameError.message}
                  fullWidth
                  id="authorID"
                  label="Scholar Scholar ID"
                  name="authorID"
                  autoComplete="sID"
                  value={details.authorID}
                  onChange={handleChange}
                />
                <Grid container justify="flex-end">
                  <Button size="small" color="primary" className={classes.button}
                          name="semanticScholar" onClick={handleHelper}>
                    <Typography variant="body2">
                      Semantic Scholar ID?
                    </Typography>
                  </Button>
                </Grid>
                <Popover
                  open={Boolean(anchorEl.semanticScholar)}
                  anchorEl={anchorEl.semanticScholar}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Grid container alignItems="center" className={classes.popover}>
                    <Grid item xs>
                      <Typography>
                        Semantic Scholar ID is used to get your paper information.<br/>
                        You can find your ID at the end of URL in
                        <a href='https://www.semanticscholar.org' target="_blank"> Semantic Scholar</a>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton size="small" name="semanticScholar"
                                  className={classes.close} onClick={handleClose}>
                        <CloseIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Popover>
              </Grid>
              <Grid item xs={12} sm={6}>

                <TextField
                  autoComplete="tID"
                  // error={formFields.firstnameError.error}
                  // helperText={formFields.firstnameError.message}
                  name="twitterID"
                  variant="outlined"
                  fullWidth
                  id="twitterID"
                  label="Twitter ID"
                  autoFocus
                  value={details.twitterID}
                  onChange={handleChange}
                />
                <Grid container justify="flex-end">
                  <Button size="small" color="primary" className={classes.button}
                          name="twitter" onClick={handleHelper}>
                    <Typography variant="body2">
                      Twitter ID?
                    </Typography>
                  </Button>
                </Grid>
                <Popover
                  open={Boolean(anchorEl.twitter)}
                  anchorEl={anchorEl.twitter}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Grid container alignItems="center" className={classes.popover}>
                    <Grid item xs>
                      <Typography>
                        Twitter username is used to get your tweets information.<br/>
                        Open<a href='https://twitter.com/' target="_blank"> Twitter</a> and get your username
                        'e.g. @username'.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton size="small" name="twitter"
                                  className={classes.close} onClick={handleClose}>
                        <CloseIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
            {/*{errorRegisterMessage ? (*/}
            {/*  <Grid container style={{marginTop: 24}} spacing={1}>*/}
            {/*    <Grid item> <ErrorIcon color="secondary"/> </Grid>*/}
            {/*    <Grid item> <Typography>{errorRegisterMessage}!</Typography> </Grid>*/}
            {/*  </Grid>*/}
            {/*) : <></>}*/}
            {isLoading ?
              <Grid container justify="center" className={classes.submit}>
                <CircularProgress/>
              </Grid>
              :
              <>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2"
                          onClick={() => history.push('/auth/login')}>
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </>

            }


          </form>
        </div>

      </Grid>
    </>
  );
}
