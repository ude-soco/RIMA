import React from "react";
import Loader from "react-loader-spinner";

import { Box } from "@material-ui/core";
const ActiveLoader = ({ width, height, visible }) => {
  return (
    <Box
      style={{
        marginLeft: "50%",
        marginTop: "2%",
        position: "absolute",
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
