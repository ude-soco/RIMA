import React, {useEffect, useState} from "react";
import './ScrollTopWrapper.scss';
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";

export default function ScrollTopWrapper() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 30) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible &&
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip>
            Scroll to top
          </Tooltip>
        }
      >
        <Button onClick={scrollToTop} className="btn btn-info btn-circle btn-lg">
          <FontAwesomeIcon icon={faArrowUp}/>
        </Button>
      </OverlayTrigger>
      }
    </div>
  );
}