import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux"
import { useSelector } from "react-redux";
import { RootState } from '../redux/reducer';
import { selectRestaurant } from '../redux/action';
import { Restaurant } from "../types";
import { useFetchedData } from '../hooks/fetchdata';

const RestaurantDetails: React.FC = () => {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant);
  const { data, error, loading } = useFetchedData<Restaurant>(`/restaurants/${selectedRestaurant?.id}`);
console.log(data);
  if (!data && !loading) {
    return <div>No restaurant ID provided.</div>;
  }
  
  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Restaurant Details</Card.Title>
          <Card.Text>Address: {data?.details?.address}</Card.Text>
          <Card.Text>Review Score: {data?.details?.reviewScore}</Card.Text>
          <Card.Text>Contact: {data?.details.contactEmail}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;
