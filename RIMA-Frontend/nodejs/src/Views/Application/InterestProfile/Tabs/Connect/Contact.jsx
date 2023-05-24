import React from "react"
import  { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";

const useStyles = makeStyles((theme) => ({
  form: {
    width: 500,
    margin: "0 auto",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  button: {
    marginTop: theme.spacing(2),
    alignSelf: "flex-end",
    color: "green"
  },
  h1: {
    marginBottom: "50px"
  },
  icon: { paddingLeft: "10px" }
}));

function Contact() {
  const classes = useStyles();
  let from = "from@gmail.com"
  let to = "to@gmail.com"

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let data = {
      to: formData.get("to"),
      subject: formData.get("subject"),
      message: formData.get("message")
    };
    console.log(data);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit} >
      <Typography variant="h3" className={classes.h1}>
        Contact
      </Typography>
      <TextField name="to" label={from} fullWidth />
      <TextField name="to" label={to} fullWidth />
      <TextField name="subject" label="Subject" fullWidth />
      <TextField name="message" label="Message" fullWidth multiline rows={6} />

      <Button
        className={classes.button}
        variant="contained"
        color="success"
        type="submit"
      >
        Send
        <SendIcon className={classes.icon} />
      </Button>
    </form>
  );
}
export default Contact;
