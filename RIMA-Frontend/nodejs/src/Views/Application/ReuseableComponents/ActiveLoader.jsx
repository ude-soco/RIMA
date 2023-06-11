import React from "react";
import Loader from "react-loader-spinner";

import { Box } from "@material-ui/core";
const ActiveLoader = ({ width, height, visible, marginLeft = "50%" }) => {
  return (
    <Box
      style={{
        marginLeft: marginLeft,
        marginTop: "2%",
        position: "absolute",
        zIndex: 999,
      }}
    >
      <Loader
        type="Bars"
        visible={visible}
        color="#00BFFF"
        height={height}
        width={width}
      />
    </Box>
  );
};
export default ActiveLoader;
