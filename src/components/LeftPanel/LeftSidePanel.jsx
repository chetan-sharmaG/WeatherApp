import React, { use, useEffect, useState } from "react";
import { useTemperature } from "../../context/temperatureContext";
import { convertTemperature } from "../../utils/util";
import { useNavigate } from "react-router-dom";

const LeftSidePanel = (data) => {
  const [apiData, setApiData] = useState({});
  const { isCelsius, toggleTemperatureUnit } = useTemperature();
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setApiData(data.data);
      convertDate(data.data.location.localtime);
    }
  }, [data]);

  const getCurrentISTTime = () => {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(now);
  };

  function returnIconUrl(icon) {
    if (icon == "Sunny") {
      return "/sun.png";
    } else if (icon == "Partly cloudy") {
      return "/partly-cloudy.png";
    } else if (icon == "Patchy rain nearby") {
      return "/rainy-day.png";
    } else if (icon == "Patchy light drizzle") {
      return "/drizzle.png";
    } else if (icon == "Clear") {
      return "/clear.png";
    } else if (
      icon == "Moderate or heavy rain with thunder" ||
      icon == "Patchy light rain with thunder"
    ) {
      return "/thunder.png";
    }else if(icon=='Mist'){
      return '/mist.png'
    }
  }
  const convertDate = (dateStr) => {
    const date = new Date(dateStr.replace(" ", "T")); 

    const day = date.toLocaleDateString("en-US", { weekday: "long" }); 
    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }); 

    setTime(time);
    setDate(day);
  };
  return (
    <>
      {Object.keys(apiData).length > 0 && (
        <div className="leftSide">
          <h5
            style={{ alignSelf: "baseline",cursor:'pointer' }}
            onClick={() => {
              navigate("/search");
            }}
          >
            Search for places ...
          </h5>
          <div className="weatherIcon">
            <img
              src={`${
                returnIconUrl(apiData?.current?.condition?.text) ||
                apiData?.current?.condition?.icon
              } `}
            />
          </div>
          <span className="currentTempWrapper">
            <span className="currentTemp">
              {convertTemperature(apiData.current?.temp_c, isCelsius).toFixed(
                1
              )}
              <sup style={{ fontSize: "12px" }}>o</sup>
              <sup style={{ fontSize: "20px" }}>{isCelsius ? "C" : "F"}</sup>
            </span>
            <span
              className="time"
              style={{ display: "flex", alignItems: "end" }}
            >
              <span>{date},</span>
              <span>{time}</span>
            </span>
          </span>
          <span
            style={{
              display: "flex",
              fontWeight: "bold",
              fontSize: "12px",
              gap: "20px",
              alignItems: "start",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img
                src={apiData?.current?.condition?.icon}
                height={"25px"}
                width={27}
              />
              {apiData?.current?.condition?.text}
            </span>
            <span
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img src="/umbrella.png" height={"25px"} />
              Rain -{" "}
              {apiData?.forecast?.forecastday[0]?.day?.daily_chance_of_rain}%
            </span>
          </span>
          <span
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "bolder",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img src="/placeholder.png" height={"25px"} />
            {apiData?.location?.name} , {apiData?.location?.country}
          </span>
        </div>
      )}
    </>
  );
};

export default LeftSidePanel;
