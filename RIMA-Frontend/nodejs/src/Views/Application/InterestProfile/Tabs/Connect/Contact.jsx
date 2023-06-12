import React, {useEffect} from "react"
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

function Contact(props) {
  const {authorId} = props;
  let linkStr = ("https://www.semanticscholar.org/author/"+authorId);

  return (
    <form>
      <h1>Visit this website to contact this user</h1>
      <a href={linkStr}>Click me</a>
    </form>
  );
}
export default Contact;
