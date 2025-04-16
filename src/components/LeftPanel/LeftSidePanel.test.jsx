import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useTemperature } from "../../context/temperatureContext";
import { convertTemperature } from "../../utils/util";
import LeftSidePanel from "./LeftSidePanel";

// Mock dependencies
jest.mock("../../context/temperatureContext", () => ({
  useTemperature: jest.fn(),
}));

jest.mock("../../utils/util", () => ({
  convertTemperature: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("LeftSidePanel Component", () => {
  let mockNavigate;
  const mockData = {
    data: {
      location: { name: "New York", country: "USA", localtime: "2024-03-24 10:00" },
      current: {
        temp_c: 20,
        condition: { text: "Sunny", icon: "/sun.png" },
      },
      forecast: {
        forecastday: [{ day: { daily_chance_of_rain: 30 } }],
      },
    },
  };
  beforeEach(() => {
    mockNavigate = jest.fn();
    useTemperature.mockReturnValue({
      isCelsius: true,
      toggleTemperatureUnit: jest.fn(),
    });

    convertTemperature.mockImplementation((temp, isCelsius) =>
      isCelsius ? temp : temp * 1.8 + 32
    );

    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });


  test("renders correctly with provided data", () => {
   

    render(
        <LeftSidePanel {...mockData} />
    );

    expect(screen.getByText("New York , USA")).toBeInTheDocument();
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(screen.getByText("Rain - 30%")).toBeInTheDocument();
  });

  test("navigates to search page when clicking 'Search for places ...'", () => {
    render(
        <LeftSidePanel {...mockData} />
    );

    const searchLink = screen.getByText("Search for places ...");
    fireEvent.click(searchLink);

    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });

  test("displays correct temperature based on Celsius setting", () => {
    const mockData = {
      data: {
        location: { name: "Bangalore", country: "India", localtime: "2024-03-24 10:00" },
        current: { temp_c: 25, condition: { text: "Clear", icon: "/clear.png" } },
      },
    };

    render(
        <LeftSidePanel {...mockData} />
    );

    expect(convertTemperature).toHaveBeenCalledWith(25, true);
    expect(screen.getByText("25.0")).toBeInTheDocument(); // Celsius by default
  });
});
