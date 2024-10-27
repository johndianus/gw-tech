import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { selectRestaurant } from "../redux/action";
import RestaurantDetails from "./RestaurantDetails";
import { useFetchedData } from "../hooks/fetchdata";
import "@testing-library/jest-dom";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

jest.mock("../hooks/fetchdata", () => ({
  useFetchedData: jest.fn(),
}));

const mockReducer = (state = { restaurant: { id: null, details: {} } }, action: any) => {
  switch (action.type) {
    case "SELECT_RESTAURANT":
      return { ...state, restaurant: action.payload };
    default:
      return state;
  }
};

describe("RestaurantDetails component", () => {
  let store: any;

  beforeEach(() => {
    store = createStore(mockReducer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading component when loading", () => {
    (useFetchedData as jest.Mock).mockReturnValue({ loading: true, error: null, data: null });

    render(
      <Provider store={store}>
        <RestaurantDetails />
      </Provider>
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  test("renders error message on error", () => {
    const errorMessage = "No restaurant ID provided.";
    (useFetchedData as jest.Mock).mockReturnValue({ loading: false, error: errorMessage, data: null });

    render(
      <Provider store={store}>
        <RestaurantDetails />
      </Provider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("renders restaurant details when data is available", () => {
    const mockData = {
      id: 1,
      name: "Sushi Paradise",
      shortDescription: "Traditional sushi and modern fusion rolls.",
      rating: 4.7,
      details: {
        address: "123 Main St",
        contactEmail: "contact@restaurant.com",
        reviewScore: 4.5,
        openingHours: {
          weekday: "12:00 PM - 10:00 PM",
          weekend: "11:00 AM - 11:00 PM",
        },
      },
    };

    (useFetchedData as jest.Mock).mockReturnValue({ loading: false, error: null, data: mockData });
    store.dispatch(selectRestaurant(mockData));
    render(
      <Provider store={store}>
        <RestaurantDetails />
      </Provider>
    );

    expect(screen.getByText("Restaurant Details")).toBeInTheDocument();
    expect(screen.getByText("Address: 123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Review Score: 4.5")).toBeInTheDocument();
    expect(screen.getByText("Contact: contact@restaurant.com")).toBeInTheDocument();
  });

  test("dispatches selectRestaurant(null) action when Back button is clicked", () => {
    const mockData = {
      id: 1,
      name: "123 Main St",
      details: {
        address: "123 Main St",
        contactEmail: "contact@restaurant.com",
        reviewScore: 4.5,
        openingHours: {
          weekday: "12:00 PM - 10:00 PM",
          weekend: "11:00 AM - 11:00 PM",
        },
      },
    };

    (useFetchedData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    const store = mockStore({
      restaurant: { id: 1, details: mockData.details },
    });

    render(
      <Provider store={store}>
        <RestaurantDetails />
      </Provider>
    );

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(selectRestaurant(null));
  });

});
