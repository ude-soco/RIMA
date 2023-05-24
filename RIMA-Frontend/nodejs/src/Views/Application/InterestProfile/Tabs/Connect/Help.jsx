import React, { useState, useEffect } from "react";
import foto1 from "./fotoAnimation.gif";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

export default function Help() {
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "Instructions",
    },
    {
      id: 2,
      title: "instruction 1",
      image: foto1
    },
    {
      id: 3,
      title: "instruction 2",
      image: foto1
    },
    {
      id: 4,
      title: "instruction 3",
      image: foto1
    },
    {
      id: 5,
      title: "instruction 4",
      image: foto1
    }
  ]);

  const [selectedWindow, setSelectedWindow] = useState({ id: 1 });//You can change the id to 0 to show the Pop ups just once

  const handleClose = () => {
    setSelectedWindow({ id: 0 });
  };

  const handleNext = () => {
    setSelectedWindow((prevSelectedWindow) => {
      const nextWindowId = prevSelectedWindow.id + 1;
      const isLastWindow = nextWindowId > windows.length;
      return {
        id: isLastWindow ? prevSelectedWindow.id : nextWindowId
      };
    });
  };

  const handlePrevious = () => {
    setSelectedWindow((prevSelectedWindow) => {
      const previousWindowId = prevSelectedWindow.id - 1;
      const isFirstWindow = previousWindowId < 1;
      return {
        id: isFirstWindow ? prevSelectedWindow.id : previousWindowId
      };
    });
  };

  useEffect(() => {
    const isHelpShown = sessionStorage.getItem("helpShown");
    if (!isHelpShown) {
      setSelectedWindow({ id: 1 });
      sessionStorage.setItem("helpShown", true);
    }
  },[]);

  return (
    <>
      {selectedWindow.id !== 0 && (
        <Dialog open={true} onClose={handleClose}>
          <DialogTitle>{windows[selectedWindow.id - 1].title}</DialogTitle>
          <DialogContent>
            <img
              src={windows[selectedWindow.id - 1].image}
              style={{ width: "100%" }}
              alt={windows[selectedWindow.id - 1].title}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrevious} disabled={selectedWindow.id === 1}>
              Previous
            </Button>
            <Button onClick={handleClose}>Close</Button>
            <Button
              onClick={handleNext}
              disabled={selectedWindow.id === windows.length}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
