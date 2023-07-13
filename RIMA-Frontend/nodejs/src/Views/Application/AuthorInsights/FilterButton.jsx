import React, { useState } from "react";
import { Button, Menu, MenuItem, Checkbox, Box } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterButton = ({
  optionsProps,
  handleToggleProps,
  checkedProps,
  onSaveClickedProps,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterListIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {optionsProps.map((option, index) => (
          <MenuItem key={option} onClick={() => handleToggleProps(index)}>
            <Checkbox checked={checkedProps[index]} />
            {option} publications
          </MenuItem>
        ))}
        <MenuItem>
          <Button onClick={() => onSaveClickedProps()}>Save</Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default FilterButton;
