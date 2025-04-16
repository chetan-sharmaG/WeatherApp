import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../components/LeftPanel/LeftSidePanel", () => () => (
  <div data-testid="left-panel">Left Panel</div>
));

jest.mock("../components/RightPanel/RightPanel", () => () => (
  <div data-testid="right-panel">Right Panel</div>
));

jest.mock("../components/Loader/Loader", () => () => (
  <div data-testid="loader">Loading...</div>
));

global.fetch = jest.fn();

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("redirects to /search if location is missing", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useSearchParams.mockReturnValue([new URLSearchParams()]); // No location param

    window.alert = jest.fn(); // Mock alert to prevent actual popup

    // Mock fetch to return an empty response with json() method
    global.fetch.mockResolvedValueOnce({
      json: async () => ({}),
      status: 400,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter your location in the search bar to get the weather forecast"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });

  test("displays loader while fetching data", async () => {
    useNavigate.mockReturnValue(jest.fn());
    useSearchParams.mockReturnValue([new URLSearchParams({ loc: "New York" })]);

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        location: { name: "New York" },
        forecast: {},
      }),
      status: 200,
    });

    render(<Dashboard />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });

  test("renders LeftSidePanel and RightPanel after data fetch", async () => {
    useNavigate.mockReturnValue(jest.fn());
    useSearchParams.mockReturnValue([new URLSearchParams({ loc: "New York" })]);

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        location: { name: "New York" },
        forecast: {},
      }),
      status: 200,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("left-panel")).toBeInTheDocument();
      expect(screen.getByTestId("right-panel")).toBeInTheDocument();
    });
  });
});
