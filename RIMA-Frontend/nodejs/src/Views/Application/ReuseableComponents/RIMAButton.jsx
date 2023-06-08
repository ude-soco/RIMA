import React, { useState } from "react";
import { Button } from "@mui/material";

const RIMAButton = ({ name, onClick, activeButton }) => {
  const [hovered, setHorvered] = useState(false);

  const handleMouseEnter = () => {
    setHorvered(true);
  };
  const handleMouseLeave = () => {
    setHorvered(false);
  };
  const handleClick = () => {
    onClick();
  };
  return (
    <Button
      variant={hovered || activeButton ? "contained" : "outlined"}
      color="primary"
      active={activeButton}
      value={name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      sx={{ textTransform: "none" }}
    >
      {name}
    </Button>
  );
};
export default RIMAButton;
