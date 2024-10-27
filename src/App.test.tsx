import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import { RootState } from './redux/reducer';
import { useFetchedData } from './hooks/fetchdata';

jest.mock('./hooks/fetchData');

const mockStore = configureStore<Partial<RootState>>();

describe("App Component Rendering", () => {
  test("renders only RestaurantList when no restaurant is selected", () => {
    const restaurantData = [
      {
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
      },
      {
        id: 2,
        name: "Sample Restaurant 2",
        shortDescription: "Sample Restaurant Description",
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
      },
    ];

    (useFetchedData as jest.Mock).mockReturnValue({
      data: restaurantData,
      error: null,
      loading: false,
    });

    const store = mockStore({ restaurant: null });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Restaurants/i)).toBeInTheDocument();
    expect(screen.queryByText(/Restaurant Details/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Booking Form/i)).not.toBeInTheDocument();
  });

  test("renders RestaurantList, RestaurantDetails, and BookTable when a restaurant is selected", () => {
    const selectedRestaurant = {
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

    (useFetchedData as jest.Mock).mockReturnValue({
      data: [selectedRestaurant],
      error: null,
      loading: false,
    });

    const store = mockStore({ restaurant: selectedRestaurant });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Restaurants/i)).toBeInTheDocument();
    expect(screen.getByText(/Restaurant Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Form/i)).toBeInTheDocument();
  });
});
