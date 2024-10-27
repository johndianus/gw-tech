import React, { useRef, useState } from "react";
import { ListGroup, Container, Button, Form } from "react-bootstrap";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { useFetchedData } from '../hooks/fetchdata';
import { Loading } from "./Loading";
import { Error } from "./Error";
import { selectRestaurant } from '../redux/action';
import { Restaurant } from "../types";

const RestaurantList: React.FC = () => {
  const { data, error, loading } = useFetchedData<Restaurant[]>('/restaurants');
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');
  const dispatch: Dispatch<any> = useDispatch();

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    dispatch(selectRestaurant(restaurant));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchRef.current) {
      setSearchValue(searchRef.current.value);
    }
  };

  const handleSorting = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
  };

  const filteredAndSortedData = () => {
    let filteredData = data?.filter((rest) => 
      rest.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredData) {
      filteredData = [...filteredData].sort((a, b) => {
        switch (sortValue) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "rating_asc":
            return b.rating - a.rating;
          case "rating_desc":
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  return (
    <Container>
      <h2>Restaurants</h2>

      <Form className="d-flex w-100 mb-3" onSubmit={handleSubmit}>
        <Form.Group className="flex-grow-1 me-2 mb-0" controlId="formGroupSearch">
          <Form.Control type="text" placeholder="Search here" ref={searchRef} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      <Form.Select aria-label="sorting" className="mb-3" onChange={handleSorting}>
        <option value="0" disabled>Sort By</option>
        <option value="name_asc">Sort by A-Z</option>
        <option value="name_desc">Sort by Z-A</option>
        <option value="rating_asc">High Rating</option>
        <option value="rating_desc">Low Rating</option>
      </Form.Select>

      {loading && <Loading />}
      {error && <Error error={error} />}
      <ListGroup>
        {filteredAndSortedData()?.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => handleSelectRestaurant(restaurant)}
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
