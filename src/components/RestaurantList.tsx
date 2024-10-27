import React from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useFetchedData } from '../hooks/fetchdata';
import { Loading } from "./Loading";
import { Error } from "./Error";

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { data, error, loading } = useFetchedData<Restaurant[]>('/restaurants');
  console.log(data);
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
            onClick={() => onRestaurantSelect(restaurant.id)}
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
