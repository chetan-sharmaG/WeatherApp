import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LeftSidePanel from "../components/LeftPanel/LeftSidePanel";
import Loader from "../components/Loader/Loader";
import RightPanel from "../components/RightPanel/RightPanel";
import "./Dashboard.css";

const Dashboard = () => {
  const [loc] = useSearchParams();
  const navigate = useNavigate();
  const [loading,setLoading] = React.useState(false);
  const [apiData, setApiData] = React.useState({});

  async function fetchData() {
    setLoading(true);
    let res = await fetch(
      `${import.meta.env.VITE_REACT_APP_WEATHER_URL}/forecast.json?key=${import.meta.env.VITE_REACT_APP_WEATHER_API_KEY}&q=${loc.get(
        "loc"
      ) || "Bangalore"}&days=7`
    );
    let data = await res.json();
    if(res.status === 404 || res.status === 400) {
      setTimeout(() => {
        alert("Please enter your location in the search bar to get the weather forecast");
        navigate("/search");
      }, 0);
    }
    setApiData(data);
    setLoading(false);
  }
  useEffect(() => {
       fetchData();
  }, []);

  useEffect(() => {
    if (!loc.get("loc") || loc.get("loc").length === 0) {
      setTimeout(() => {
        alert("Please enter your location in the search bar to get the weather forecast");
        navigate("/search");
      }, 0);
    }
  }, [loc, navigate]);

  if(loading) {
    return <Loader/>
  }
  return (
    <div className="dashboardWrapper">
      {Object.keys(apiData).length > 0 && (
        <>
          <LeftSidePanel data={apiData} />
          <RightPanel data={apiData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
