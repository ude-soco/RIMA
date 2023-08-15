import React, { useState, useEffect } from "react";
import foto0 from "./Animations/null.png";
import foto1 from "./Animations/eins.gif";
import foto2 from "./Animations/zwei.png";
import foto3 from "./Animations/drei.gif";
import foto4 from "./Animations/vier.gif";
import foto5 from "./Animations/fünf.gif";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

// React component named 'Help' with props
export default function Help(props) {
  // Define an array of 'windows', each window has an id, title and image
  const [windows, setWindows] = useState([ 
    {
      id: 1,
      title: "The Connect page helps you get in touch with other researchers",
      image: foto0
    },
    {
      id: 2,
      title: "You can click on the name of the authors",
      image: foto1
    },
    {
      id: 3,
      title: "If you click on the names you get the following options to get more information",
      image: foto2
    },
    {
      id: 4,
      title: "If you click 'Compare Interests' the degree of overlap between the circles shows you how much the interests match",
      image: foto3
    },
    {
      id: 5,
      title: "If you click 'Where am I cited' and 'Where have I cited?' you can see the publications by the other reasearcher which cited you and your publications where you have cited them",
      image: foto4
    },
    {
      id: 4,
      title: "The numbers represent the number of citations",
      image: foto5
    }
  ]);

  // State to keep track of the currently selected window
  const [selectedWindow, setSelectedWindow] = useState({ id: 1 });

  // Function to close the help dialog
  const handleClose = () => {
    props.closeHelp();
    setSelectedWindow({ id: 0 });
    
  };

  // Function to move to the next window
  const handleNext = () => {
    setSelectedWindow((prevSelectedWindow) => {
      const nextWindowId = prevSelectedWindow.id + 1;
      const isLastWindow = nextWindowId > windows.length;
      return {
        id: isLastWindow ? prevSelectedWindow.id : nextWindowId
      };
    });
  };

  // Function to move to the previous window
  const handlePrevious = () => {
    setSelectedWindow((prevSelectedWindow) => {
      const previousWindowId = prevSelectedWindow.id - 1;
      const isFirstWindow = previousWindowId < 1;
      return {
        id: isFirstWindow ? prevSelectedWindow.id : previousWindowId
      };
    });
  };

  // Effect to determine whether to show the help dialog based on sessionStorage
  useEffect(() => {
    const isHelpShown = sessionStorage.getItem("helpShown");
    if (!isHelpShown) {
      setSelectedWindow({ id: 1 });
      sessionStorage.setItem("helpShown", true);
    }
  },[]);

  return (
    <>
      {/* Render the help dialog based on selectedWindow */}
      {selectedWindow.id !== 0 && (
        <Dialog open={true} onClose={handleClose}>
          <DialogTitle>{windows[selectedWindow.id - 1].title}</DialogTitle>
          <DialogContent>
            {/* Display the image associated with the selected help window */}
            <img
              src={windows[selectedWindow.id - 1].image}
              style={{ width: "100%" }}
              alt={windows[selectedWindow.id - 1].title}
            />
          </DialogContent>
          <DialogActions>
            {/* Button to navigate to the previous window */}
            <Button onClick={handlePrevious} disabled={selectedWindow.id === 1}>
              Previous
            </Button>
            {/* Button to close the help dialog */}
            <Button onClick={handleClose}>Close</Button>
            {/* Button to navigate to the next window */}
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
