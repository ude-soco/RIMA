import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import RestAPI from "Services/api";
import { makeStyles } from "@material-ui/core/styles";
import { handleServerErrors } from "Services/utils/errorHandler";
import { toast } from 'react-toastify';
const textStyles = makeStyles({
  listbox: {
    height: 160,
    fontSize: 12,
  },
});
export default function Autocompletion(props) {
  const classes = textStyles();
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [existingTags, setExistingTags] = useState([props.existed]);
  useEffect(() => {
    setExistingTags(props.existed);
    RestAPI.conceptChart()
      .then((response) => {
        let chartData = [];

        let dataLength = Math.min(response.data.length, 5);
        for (let index = 0; index < dataLength; index++) {
          chartData.push({
            group: "Potential interest",
            category: response.data[index].categories.map((item) => item.name),
          });
        }
        setData(chartData);
      })
      .catch((error) => {
        handleServerErrors(error, toast.error);
      });
  }, [props]);
  function gettingData(data) {
    let dataa = [];
    let filterObj = data.map((item) => item.category);
    let merged = [].concat.apply([], filterObj);
    for (let i = 0; i < merged.length; i++) {
      dataa.push({
        group: "Potential interest",
        category: merged[i],
      });
    }
    return dataa;
  }
  function gettingInterest(data) {
    let dataa = [];
    let filterObj = data.map((item) => item.text);
    let merged = [].concat.apply([], filterObj);
    for (let i = 0; i < merged.length; i++) {
      dataa.push({
        group: "Other interests",
        category: merged[i],
      });
    }

    return dataa;
  }

  const flatProps1 = {
    options: gettingData(data).concat(gettingInterest(props.tags)),
  };

  const inputChange = (e, newValue) => {
    if (newValue == null) return;
    if (newValue.category) {
      const input1 = newValue.category;
      if (existingTags.indexOf(input1.toLowerCase()) > -1) {
        console.log("already added");
        props.onChange("add");
        setInput("add");
      } else if (props.value == null) {
        console.log("already added");
      } else {
        setInput(newValue);
        props.onChange(input1.toLowerCase());
        props.submit({ id: input1, text: input1.toLowerCase() });
        setExistingTags([...existingTags, input1]);
        setInput("add");
      }
    } else {
      if (
        existingTags.indexOf(e.target.value.trim()) > -1 ||
        existingTags.indexOf(e.target.value) > -1
      ) {
        console.log("already added");
      } else if (existingTags.indexOf(props.value) > -1) {
        console.log("already added");
        props.onChange(" ");
        setInput("add");
      } else {
        const input1 = e.target.value.trim();
        setInput("newValue");
        setExistingTags([...existingTags, input1]);
        props.onChange(input1);
      }
    }
  };

  return (
    <Stack spacing={1} sx={{ width: 180, height: "15%" }}>
      <Autocomplete
        classes={classes}
        {...flatProps1}
        getOptionLabel={(option) => (option.category ? option.category : " ")}
        groupBy={(option) => option.group}
        limitTags={5}
        defaultValue="new interest"
        id="flat-demo"
        freeSolo
        value={input}
        onChange={inputChange}
        style={{ borderRadius: "5px", height: "15%" }}
        renderInput={(params) => (
          <TextField {...params} label="add new interest" variant="standard" />
        )}
      />
    </Stack>
  );
}
