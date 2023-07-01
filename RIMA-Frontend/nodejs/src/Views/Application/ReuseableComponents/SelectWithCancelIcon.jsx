// created by Islam Abdelghaffar
import React from "react";
import {
  Select,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const SelectWithCancelIcon = ({
  InputLabelProps,
  SelectLabelIdProps,
  SelectValueProps,
  onChangeActionProps,
  confEventsProps,
  clearSelectedEventProps,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <FormControl sx={{ m: 1, minWidth: 250, backgroundColor: "white" }}>
        <InputLabel>{InputLabelProps}</InputLabel>
        <Select
          labelId={SelectLabelIdProps}
          value={SelectValueProps}
          onChange={onChangeActionProps}
          endAdornment={
            SelectValueProps && (
              <IconButton onClick={clearSelectedEventProps}>
                <CancelIcon />
              </IconButton>
            )
          }
        >
          {confEventsProps.map((event, index) => {
            return (
              <MenuItem key={index} value={event.label}>
                {event.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};
export default SelectWithCancelIcon;
