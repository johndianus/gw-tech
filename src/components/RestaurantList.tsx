import React from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux"

import { ListGroup, Container } from "react-bootstrap";
import { useFetchedData } from '../hooks/fetchdata';
import { Loading } from "./Loading";
import { Error } from "./Error";
import { selectRestaurant } from '../redux/action';
import { Restaurant } from "../types";

const RestaurantList: React.FC = () => {
  const { data, error, loading } = useFetchedData<Restaurant[]>('/restaurants');
  const dispatch: Dispatch<any> = useDispatch()
  
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    dispatch(selectRestaurant(restaurant));
  };

  return (
    <Container>
      <h2>Restaurants</h2>
      {loading && <Loading />}
      {error && <Error error={error} />}
      <ListGroup>
        {data?.map((restaurant) => (
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
