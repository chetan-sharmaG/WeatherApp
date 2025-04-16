import { render, screen, waitFor } from "@testing-library/react";
import DaysForeCast from "./DaysForeCast.jsx";  // Adjust path as needed
import { TemperatureProvider } from "../../context/temperatureContext"; // Ensure correct import
import React from "react";

// Mocking useTemperature hook
jest.mock("../../context/temperatureContext", () => ({
  useTemperature: () => ({
    isCelsius: true,
    toggleTemperatureUnit: jest.fn(),
  }),
}));

const mockData = {
  data: {
    current: { last_updated: "2025-03-24 12:00" },
    forecast: {
      forecastday: [
        {
          date: "2025-03-24",
          day: {
            maxtemp_c: 30,
            mintemp_c: 20,
            maxtemp_f: 86,
            mintemp_f: 68,
            avgtemp_c: 25,
            avgtemp_f: 77,
            condition: {
              text: "Sunny",
              icon: "/sunny.png",
            },
          },
          hour: [
            {
              time: "2025-03-24 12:00",
              temp_c: 26,
              temp_f: 78.8,
              condition: {
                text: "Sunny",
                icon: "/sunny.png",
              },
            },
          ],
        },
      ],
    },
  },
};

describe("DaysForeCast Component", () => {
  test("renders the weekly forecast correctly", async () => {
    console.log("Mock Data:", mockData);
    render(
      // <TemperatureProvider>
        <DaysForeCast data={mockData} />
      //  </TemperatureProvider>
    );

    // Wait for elements to appear
    await waitFor(() => expect(screen.getByText("Week")).toBeInTheDocument());

    // Check if weather cards are rendered
    expect(screen.getByText("Mon")).toBeInTheDocument(); // Date

  //  const weatherIcon = await screen.findByRole("img",);

  // Check if the image source matches the expected icon path
  await waitFor(() => {
    expect(
      screen.getByText((content) => content.includes("25.0"))
    ).toBeInTheDocument();
  });
  });

  test("switches to hourly forecast when 'Today' is clicked", async () => {
    render(
      
        <DaysForeCast data={mockData} />

    );

    // Click on "Today" to switch forecast type
    screen.getByText("Today").click();

    // Wait for re-render
    await waitFor(() => expect(screen.getByText("12:00 PM")).toBeInTheDocument());

    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(screen.getByText("26.0")).toBeInTheDocument(); // Hourly temperature
  });
});
