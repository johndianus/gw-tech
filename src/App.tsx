import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetails from "./components/RestaurantDetails";
import BookTable from "./components/BookTable";
import { useSelector } from "react-redux";
import { RootState } from './redux/reducer';

function App() {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant);

  return (
    <Container>
      <Row>
        <Col md={4} className={selectedRestaurant ? `d-none d-md-block`:""}>
          <RestaurantList/>
        </Col>
        <Col md={8}>
          {selectedRestaurant && (
            <>
              <RestaurantDetails/>
              <BookTable />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
