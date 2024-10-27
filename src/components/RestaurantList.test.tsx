import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import RestaurantList from "./RestaurantList";
import { selectRestaurant } from "../redux/action";
import { useFetchedData } from '../hooks/fetchdata';

const mockStore = configureStore([]);

jest.mock('../hooks/fetchdata');

describe("RestaurantList Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      restaurant: null,
    });
  });

  test("displays loading state", () => {
    (useFetchedData as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
    });

    render(
      <Provider store={store}>
        <RestaurantList />
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays filtered restaurant data", () => {
    const mockData = [
      {
        id: "1",
        name: "Velvet & Vine",
        rating: 4.7,
        details: {
          address: "123 Fine St, London",
          contactEmail: "info@gourmetkitchen.com",
        },
      },
      {
        id: "2",
        name: "The Olive Tree",
        rating: 4.5,
        details: {
          address: "456 Olive St, London",
          contactEmail: "contact@olivetree.com",
        },
      },
    ];

    (useFetchedData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    render(
      <Provider store={store}>
        <RestaurantList />
      </Provider>
    );
    expect(screen.getByText("Restaurants")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText("Search here");
    fireEvent.change(searchInput, { target: { value: "vine" } });
    fireEvent.submit(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByText("Velvet & Vine")).toBeInTheDocument();
    expect(screen.queryByText("The Olive Tree")).not.toBeInTheDocument();
  });

  test("dispatches selectRestaurant action when a restaurant is clicked", () => {
    const mockData = [
      {
        id: 1,
        name: "Velvet & Vine",
        shortDescription: "A fine dining experience with a modern twist.",
        rating: 4.7,
        details: {
          address: "123 Fine St, London",
          contactEmail: "info@gourmetkitchen.com",
          reviewScore:23
        },
      },
    ];

    (useFetchedData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    render(
      <Provider store={store}>
        <RestaurantList />
      </Provider>
    );

    const restaurantItem = screen.getByText("Velvet & Vine");
    fireEvent.click(restaurantItem);

    const actions = store.getActions();
    expect(actions).toContainEqual(selectRestaurant(mockData[0]));
  });

  test("sorts restaurant data correctly", () => {
    const mockData = [
      {
        id: "2",
        name: "The Olive Tree",
        rating: 4.5,
        details: {
          address: "456 Olive St, London",
          contactEmail: "contact@olivetree.com",
        },
      },
      {
        id: "1",
        name: "Velvet & Vine",
        rating: 4.7,
        details: {
          address: "123 Fine St, London",
          contactEmail: "info@gourmetkitchen.com",
        },
      },
    ];

    (useFetchedData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    render(
      <Provider store={store}>
        <RestaurantList />
      </Provider> 
    );

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: "rating_desc" } });

    expect(screen.getByText("Velvet & Vine")).toBeInTheDocument();
    expect(screen.getByText("The Olive Tree")).toBeInTheDocument();

    const items = screen.getAllByRole("button", { name: /the olive tree|velvet & vine/i });
    expect(items[0]).toHaveTextContent("The Olive Tree");
    expect(items[1]).toHaveTextContent("Velvet & Vine");
  });
});
