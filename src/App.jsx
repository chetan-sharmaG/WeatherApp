import React from "react";
import Dashboard from "./pages/Dashboard";
import { TemperatureProvider } from "./context/temperatureContext";
import {BrowserRouter , Routes, Route, Navigate} from "react-router-dom"
import Search from "./pages/Search";
import Loader from "./components/Loader/Loader";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/weather"
          element={
            <TemperatureProvider>
              <Dashboard />
            </TemperatureProvider>
          }
        />
        <Route path="/search" element={<Search />} />
        <Route path="/loading" element={<Loader />} />
        <Route path="/" element={<Navigate to="/weather?loc=Bangalore" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
