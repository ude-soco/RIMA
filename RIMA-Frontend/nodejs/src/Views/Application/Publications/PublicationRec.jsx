import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import PubFunc1 from "./Function1/Recommendation/Publications";
import PubFunc2 from "./Function2/Recommendation/Publications";
import PubFunc3 from "./Function3/Recommendation/Publications";
import { useEffect } from "react";

// Publications/Recommendation/Publications

export default function PublicationRec() {
  const [publication, setPublication] = useState("Option 3");

  useEffect(() => {
    let functionSet = localStorage.getItem("rima-function");
    if (functionSet) {
      setPublication(functionSet);
    }
  }, []);

  return (
    <>
      {publication === "Option 1" && <PubFunc1 />}
      {publication === "Option 2" && <PubFunc2 />}
      {publication === "Option 3" && <PubFunc3 />}
    </>
  );
}
