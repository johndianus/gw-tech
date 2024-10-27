import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux"
import { useSelector } from "react-redux";
import { useFetchedData } from '../hooks/fetchdata';
import { Loading } from "./Loading";
import { Error } from "./Error";
import { RootState } from '../redux/reducer';
import { selectRestaurant } from '../redux/action';
import { Restaurant } from "../types";

const RestaurantDetails: React.FC = () => {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant);
  const dispatch: Dispatch<any> = useDispatch()
  const { data, error, loading } = useFetchedData<Restaurant>(`/restaurants/${selectedRestaurant?.id}`);

  if (!data && !loading) {
    return <div>No restaurant ID provided.</div>;
  }
  
  return (
    <Container className="mt-5">
      {loading && <Loading />}
      {error && <Error error={error} />}
      {data && (
        <>
          <Button 
            variant="secondary" 
            className="mb-4 d-block d-md-none"
            onClick={() => dispatch(selectRestaurant(null))}
          >
            Back
          </Button>
          <Card>
            <Card.Body>
              <Card.Title>Restaurant Details</Card.Title>
              <Card.Text>Address: {data?.details?.address}</Card.Text>
              <Card.Text>Review Score: {data?.details?.reviewScore}</Card.Text>
              <Card.Text>Contact: {data?.details.contactEmail}</Card.Text>
              <Card.Text>Weekday Opening: {data?.details?.openingHours?.weekday}</Card.Text>
              <Card.Text>Weekend Opening: {data?.details?.openingHours?.weekend}</Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default RestaurantDetails;
