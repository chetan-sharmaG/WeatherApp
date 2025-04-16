import React, { useState } from "react";
import DaysForeCast from "./DaysForeCast";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Highlight from "./Highlight";
import "./RightPanel.css";
const RightPanel = (data) => {
  const [apiData, setApiData] = useState(data.data);
  return (
    <div className="rightSide">
      <DaysForeCast data={data} />
      <Highlight data={data} />
    </div>
  );
};

export default RightPanel;
