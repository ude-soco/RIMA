import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/lab/Autocomplete";

const SearchBox = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (event, value) => {
    setSearchQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const response = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/autocomplete?query=${value}`
    );

    if (response.data && response.data.matches) {
      setSuggestions(response.data.matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (event, value) => {
    if (!value) {
      return;
    }

    const selectedPaper = suggestions.find(
      (suggestion) => suggestion.title === value
    );
    if (selectedPaper) {
      onSearch(selectedPaper.id);
    }
  };

  return (
    <Autocomplete
      sx={{
        width: 600,
        position: "absolute",
        top: "40px",
        left: "50px",
        zIndex: 12,
        backgroundColor: "#fff"
      }}
      freeSolo
      options={suggestions.map((suggestion) => suggestion.title)}
      renderInput={(params) => (
        <TextField {...params} label="Search papers" variant="outlined" />
      )}
      onChange={handleSelect}
      onInputChange={handleInputChange}
      // onSelect={handleSelect}
    />
  );
};

export default SearchBox;
