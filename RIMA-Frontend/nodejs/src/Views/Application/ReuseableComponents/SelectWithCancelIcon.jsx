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
  mdProp = 4,
  smProp = 6,
  minWidthProp = 250,
}) => {
  return (
    <Grid item xs={12} sm={smProp} md={mdProp}>
      <FormControl sx={{ m: 1, minWidth: minWidthProp, backgroundColor: "white" }}>
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
