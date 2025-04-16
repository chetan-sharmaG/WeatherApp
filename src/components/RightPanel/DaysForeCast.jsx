import { Stack, styled, Switch, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTemperature } from "../../context/temperatureContext";
import { convertDateToDay, convertTemperature } from "../../utils/util";
import { AntSwitch } from "./styled";

const DaysForeCast = (data) => {
  const [weeklyData, setWeeklyData] = React.useState([]);
  const [hourlyData, setHourlyData] = React.useState([]);
  const [weeklyForecastFlag, setWeeklyForecastFlag] = React.useState(true);
  const { isCelsius, toggleTemperatureUnit } = useTemperature();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current && !weeklyForecastFlag) {
      const cardWidth = 150;
      const date = new Date(data.data.data.current.last_updated);
      const scrollOffset = date.getHours() * cardWidth + 23 * date.getHours();
      scrollContainerRef.current.scrollTo({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [weeklyForecastFlag]);

  useEffect(() => {
    console.error(data);
    if (data?.data?.data) {
      transformData(data.data.data);
      transformDataToHourly(data.data.data);
    }
  }, [data, isCelsius]);

  const convertDateToTime = (dateStr) => {
    const date = new Date(dateStr.replace(" ", "T"));
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };
  const transformData = (data) => {
    if (!data?.forecast?.forecastday) return; // Prevents the error
    let everyDayData = data.forecast.forecastday.map((item) => {
      return {
        date: convertDateToDay(item.date),
        maxTemp: item.day.maxtemp_c,
        minTemp: item.day.mintemp_c,
        maxTempinF: item.day.maxtemp_f,
        minTempinF: item.day.mintemp_f,
        conditionText: item.day.condition.text,
        conditionIcon: item.day.condition.icon,
        avgTemp_c: item.day.avgtemp_c,
        avgTemp_f: item.day.avgtemp_f,
      };
    });
    setWeeklyData(everyDayData);
  };
 
  const transformDataToHourly = (data) => {
    if (!data?.forecast?.forecastday?.[0]?.hour) return; // Prevents the error
    let everyHourData = data.forecast.forecastday[0].hour.map((item) => {
      return {
        date: convertDateToTime(item.time),
        conditionText: item.condition.text,
        conditionIcon: item.condition.icon,
        avgTemp_c: item.temp_c,
        avgTemp_f: item.temp_f,
      };
    });
    setHourlyData(everyHourData);
  };
  

  return (
    <>
      <div
        style={{
          display: "flex",
          fontWeight: "bold",
          position: "relative",
          fontSize: "18px",
          alignItems: "center",
          gap: "35px",
          marginBottom: "20px",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", position: "absolute", right: "0px" }}
        >
          <img src="/f.png" width={"20px"} height={"20px"} />
          <AntSwitch
            checked={isCelsius}
            onChange={toggleTemperatureUnit}
            inputProps={{ "aria-label": "ant design" }}
          />
          <img src="/c.png" width={"20px"} height={"20px"} />
        </Stack>
        <div
          className={!weeklyForecastFlag ? "selected" : "unselected"}
          onClick={() => setWeeklyForecastFlag(false)}
        >
          Today
        </div>
        <div
          className={weeklyForecastFlag ? "selected" : "unselected"}
          onClick={() => setWeeklyForecastFlag(true)}
        >
          Week
        </div>
      </div>
      <div>
        <div ref={scrollContainerRef} className="weatherCardsWrapper">
          {weeklyForecastFlag
            ? weeklyData.map((item, index) => {
                return (
                  <div className="weatherCards" key={index}>
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <div className="cardDate">{item.date}</div>
                        <div className="conditionIconWrapper">
                          <img src={item.conditionIcon} />
                        </div>
                        <div className="cardtemp">
                          {convertTemperature(
                            item.avgTemp_c,
                            isCelsius
                          ).toFixed(1)}
                          <sup>o</sup>
                          {isCelsius ? "C" : "F"}
                        </div>
                      </div>
                      <div className="flip-card-back">
                        <span>
                          Min:{" "}
                          {convertTemperature(
                            weeklyData[index].minTemp,
                            isCelsius
                          ).toFixed(1)}
                          <sup>o</sup>
                          {isCelsius ? "C" : "F"}
                        </span>
                        <span>
                          Max:{" "}
                          {convertTemperature(
                            weeklyData[index].maxTemp,
                            isCelsius
                          ).toFixed(1)}
                          {isCelsius ? "C" : "F"}
                        </span>
                        <span>
                          Average:{" "}
                          {convertTemperature(
                            weeklyData[index].avgTemp_c,
                            isCelsius
                          ).toFixed(1)}
                          <sup>o</sup>
                          {isCelsius ? "C" : "F"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            : hourlyData.map((item, index) => {
                return (
                  <div className="weatherCards" key={index}>
                    <div className="cardDate">{item.date}</div>

                    <div className="conditionIconWrapper">
                      <img src={item.conditionIcon} />
                    </div>
                    <div className="cardtemp">
                      {convertTemperature(item.avgTemp_c, isCelsius).toFixed(1)}
                      <sup>o</sup>
                      {isCelsius ? "C" : "F"}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default DaysForeCast;
