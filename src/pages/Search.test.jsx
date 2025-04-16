import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
import "@testing-library/jest-dom";
import Search from "./Search";


describe("Search Component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("renders Search component correctly", () => {
    render(<Search />);

    expect(screen.getByText("Search for a City 🌍")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter city name...")).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    render(<Search />);

    const input = screen.getByLabelText("Enter city name...");
    fireEvent.change(input, { target: { value: "New York" } });

    expect(input).toHaveValue("New York");
  });

  test("shows loading spinner when fetching cities", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "New York", country: "USA", region: "New York" },
          ]),
      })
    );

    render(<Search />);

    const input = screen.getByLabelText("Enter city name...");
    fireEvent.change(input, { target: { value: "New York" } });
    expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);

    await waitFor(() => expect(screen.getByRole("list")).toBeInTheDocument());
  });

  test("displays city suggestions", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "New York", country: "USA", region: "New York" },
          ]),
      })
    );

    render(<Search />);

    const input = screen.getByLabelText("Enter city name...");
    fireEvent.change(input, { target: { value: "New York" } });

    await waitFor(() => screen.getByText("New York, USA"));

    expect(screen.getByText("New York, USA")).toBeInTheDocument();
  });

  test("clicking on a city navigates to the weather page", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); // Mock navigation function

    // Mock fetch response for cities
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "New York", country: "USA", region: "New York" },
          ]),
      })
    );

    render(<Search />);

    const input = screen.getByLabelText("Enter city name...");
    fireEvent.change(input, { target: { value: "New York" } });

    // Wait for city list to appear
    const cityItem = await screen.findByText("New York, USA");
    expect(cityItem).toBeInTheDocument();

    // Click on the city item
    fireEvent.click(cityItem);

    // Ensure navigation occurs
    expect(mockNavigate).toHaveBeenCalledWith("/weather?loc=New York");
  });
});
