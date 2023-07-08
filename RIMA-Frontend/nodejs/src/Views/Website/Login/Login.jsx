import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import RestAPI from "../../../Services/api";
import { handleServerErrors } from "../../../Services/utils/errorHandler";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <a href="https://www.uni-due.de/soco" target="_blank">
        Social Computing Group{" "}
      </a>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.spacing(60),
  },
  paper: {
    margin: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const [details, setDetails] = useState({
    email: "",
    password: "",
    function: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(() => ({
      ...details,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      email: details.email,
      password: details.password,
    };
    setIsLoading(true);

    RestAPI.userSignIn(data)
      .then((res) => {
        setIsLoading(false);
        // console.log(res.data);
        // console.log(res.data.is_staff);
        if (res.status === 200) {
          localStorage.setItem("rimaUser", JSON.stringify(res.data));
          localStorage.setItem("accessToken", res.data.token);
          localStorage.setItem("name", res.data.first_name);
          localStorage.setItem("lastname", res.data.last_name);
          localStorage.setItem("userId", res.data.id);
          localStorage.setItem("mId", res.data.id);
          localStorage.setItem("isStaff", res.data.is_staff); //Basem Abughallya::15.09.2021::Check if staff
          localStorage.setItem("rima-function", details.function);
          const {
            data: { data_being_loaded },
          } = res;
          if (data_being_loaded) {
            window.location.href = "/app/redirect";
          } else {
            if (details.function === "Option 1") {
              history.push("/app/interest-profile");
            } else {
              history.push("/recommendation/publication/");
            }
          }
        }
      })
      .catch((error) => {
        console.log("Login Api Response", error);
        setIsLoading(false);
        handleServerErrors(error, toast.error);
      });
  };

  const functions = ["Option 1", "Option 2", "Option 3"];

  return (
    <>
      <Grid container justify="center">
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          component={Paper}
          className={classes.root}
        >
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                select
                label="Select"
                helperText="Please select your function"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="function"
                name="function"
                value={details.function}
                autoComplete="function"
                autoFocus
                onChange={handleChange}
              >
                {functions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={details.email}
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              {isLoading ? (
                <Grid
                  container
                  justifyContent="center"
                  className={classes.submit}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={
                      details.function === "" ||
                      details.email === "" ||
                      details.password === ""
                    }
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link
                        href="#"
                        variant="body2"
                        onClick={() => history.push("/auth/register")}
                      >
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </>
              )}

              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
