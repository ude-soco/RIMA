import React from 'react';
import Paper from '@mui/material/Paper';

const Tooltip = ({ show, position, content }) => {
  if (!show) {
    return null;
  }

  const style = {
    position: 'absolute',
    left: position.x,
    top: position.y,
  };

  return (
    <Paper
      className="tooltip"
      style={style}
      sx={{
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: 1,
        padding: 1,
        fontSize: '14px',
        zIndex: 1000,
      }}
    >
      {content}
    </Paper>
  );
};

export default Tooltip;
