import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import React, { useState } from "react";
import ExploreIcon from "@mui/icons-material/Explore";
import { useTemperature } from "../../context/temperatureContext";
import { convertTemperature } from "../../utils/util";
const Highlight = (data) => {
  const [apiData, setApiData] = useState(data.data.data);
  const { isCelsius, toggleTemperatureUnit } = useTemperature(); 

  function getPressure(pressure) {
    if(pressure<980){
      return "Very Low";
    }else if(pressure<1009 && pressure>980){
      return "Low";
    }else if(pressure<1025 && pressure>1009){
      return "Normal";
    }else if(pressure<1040 && pressure>1025){
      return "High";
  }else{
      return "Very High";
  }
}
function getVisibility(visibility) {
    if (visibility > 10) {
        return "Excellent";
    } else if (visibility > 5) {
        return "Good";
    } else if (visibility > 2) {
        return "Moderate";
    } else if (visibility > 1) {
        return "Poor";
    } else if (visibility > 0.5) {
        return "Very Poor";
    } else {
        return "Severe / Dangerous";
    }
}
function getHumidity(humidity) {
    if (humidity < 30) {
        return "Low (Dry)";
    } else if (humidity >= 30 && humidity <= 50) {
        return "Comfortable";
    } else if (humidity > 50 && humidity <= 70) {
        return "Moderate (Humid)";
    } else if (humidity > 70 && humidity <= 85) {
        return "High (Very Humid)";
    } else {
        return "Extreme (Oppressive)";
    }
}
function getUVColor(uvIndex) {
    if (uvIndex <= 2) {
      return "#4CAF50"; 
    } else if (uvIndex <= 5) {
      return "#FFEB3B"; 
    } else if (uvIndex <= 7) {
      return "#FF9800"; 
    } else if (uvIndex <= 10) {
      return "#F44336"; 
    } else {
      return "red"; 
    }
  }
  return (
    <>
      <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "40px" }}>
        Today's Highlights
      </div>
      <div className="highlightCardsWrapper">
        <div>
          <span className="cardTitle">UV Index</span>
          <Gauge
          cornerRadius="50%"
            sx={(theme) => ({
              width: 170,
              height: 120,
              justifySelf: "center",
              marginBottom: "40px !important",
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 32,
                fontWeight: "bold",
                transform: 'translate(0px, -10px)',
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: getUVColor(apiData?.current?.uv || 0),
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: theme.palette.text.disabled,
              },
            })}
            value={apiData?.current?.uv > 11 ? 11 : apiData?.current?.uv}
            startAngle={-90}
            endAngle={90}
            valueMax={11}
            valueMin={0}

          />
        </div>
        <div>
          <span className="cardTitle">Temperature</span>
          <div className="sunIconsContainer">
            <div>
              <img src="/high-temperature.png" width={40} alt="" />
              <span>
                {convertTemperature(apiData?.forecast?.forecastday[0]?.day?.maxtemp_c,isCelsius).toFixed(1)}
                <sup>o</sup>
                {isCelsius ? "C" : "F"}
              </span>
            </div>
            <div>
              <img src="/low-temperature.png" width={40} alt="" />
              <span>
                {convertTemperature(apiData?.forecast?.forecastday[0]?.day?.mintemp_c,isCelsius).toFixed(1)}
                <sup>o</sup>
                {isCelsius ? "C" : "F"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <span className="cardTitle">Wind Status</span>
          <div className="cardTitle windDetails">
            <span>{apiData?.current?.wind_kph}</span>
            <span>km/h</span>
          </div>
          <div className="direction " style={{ marginLeft: "20px" }}>
            <ExploreIcon fontSize="small" sx={{ color: "blue" }} />
            {apiData?.current?.wind_dir}
          </div>
        </div>
        <div>
          <span className="cardTitle">Sunrise & Sunset</span>
          <div className="sunIconsContainer">
            <div>
              <img src="/sunrise.png" width={40} alt="" />
              {apiData?.forecast?.forecastday[0]?.astro?.sunrise}
            </div>
            <div>
              <img src="/sunset.png" width={40} alt="" />
              {apiData?.forecast?.forecastday[0]?.astro?.sunset}
            </div>
          </div>
        </div>
        <div>
          <span className="cardTitle">Humidity</span>
          <div className=" humidity">
            <span>
              {apiData?.current?.humidity}
              <sup style={{ fontSize: "22px" }}>%</sup>
            </span>
            <span className="meterContainer">
              <div className="meter"  style={{ top: `${100 - apiData?.current?.humidity}%` }} ></div>
            </span>
          </div>
          <div className="direction " style={{ marginLeft: "20px" }}>
            {getHumidity(apiData?.current?.humidity)}
          </div>
        </div>
        <div>
          <span className="cardTitle">Visibility</span>
          <div className="cardTitle windDetails">
            <span>{apiData?.current?.vis_km}</span>
            <span>km</span>
          </div>
          <div className="direction " style={{ marginLeft: "20px" }}>
            {getVisibility(apiData?.current?.vis_km)}
          </div>
        </div>
        <div>
          <span className="cardTitle">Pressure</span>
          <div className="cardTitle windDetails">
            <span>{apiData?.current?.pressure_mb}</span>
            <span>mb</span>
          </div>
          <div className="direction " style={{ marginLeft: "20px" }}>
            {getPressure(apiData?.current?.pressure_mb)}
          </div>
        </div>
        <div>
          <span className="cardTitle">Moonrise & Moonset</span>
          <div className="sunIconsContainer">
            <div>
              <img src="/moonrise.png" width={40} alt="" />
              {apiData?.forecast?.forecastday[0]?.astro?.moonrise}
            </div>
            <div>
              <img src="/moonset.png" width={40} alt="" />
              {apiData?.forecast?.forecastday[0]?.astro?.moonset}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Highlight;
