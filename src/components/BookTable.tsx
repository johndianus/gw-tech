import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { RootState } from '../redux/reducer';
import { useDispatch } from "react-redux";
import { Dispatch } from "redux"
import { useSelector } from "react-redux";
import { selectRestaurant } from '../redux/action';
import { getMinDateTime } from "../utils";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  datetime: string;
  guests: number;
  restaurantId: number;
}

const BookTable: React.FC = () => {  
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant);
  const dispatch: Dispatch<any> = useDispatch()
  const [bookingStatus, setBookingStatus] = useState<string>('new');
  const [bookingError, setBookingError] = useState<string>('');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(8, "Name must be at least 8 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits")
      .min(10, "Phone number must be at least 10 digits"),
    datetime: Yup.date()
      .required("Date and time are required")
      .min(getMinDateTime(), "Date and time must be at least one hour from now"),
    guests: Yup.number()
      .required("Number of guests is required")
      .min(1, "At least one guest is required"),
  });
  
  const handleSubmit = async (values: FormValues) => {
    setBookingStatus('new');
    setBookingError('');
  
    try {
      const restId: number = selectedRestaurant?.id ?? 0;
      values.restaurantId = Number(restId);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setBookingStatus('error');
        setBookingError(errorData.message || 'An error occurred');
        return;
      }
  
      setBookingStatus('completed');
      setBookingError('');
    } catch (err: any) {
      console.error(err);
      setBookingStatus('error');
      setBookingError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Container className="mt-4">
      {bookingStatus === 'completed' && (
        <>
          <Alert >Successfully Booked !!</Alert>
          <Button 
            variant="success" 
            onClick={() => dispatch(selectRestaurant(null))}
          >New Booking</Button>
      </>)}
      {bookingStatus === 'error' && (<Alert>{bookingError}</Alert>)}
      {bookingStatus === 'new' && (
      <>
        <h2>Booking Form</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            datetime: "",
            guests: 0,
            restaurantId: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* Name Field */}
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && !!errors.name}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Email Field */}
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Phone Field */}
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.phone && !!errors.phone}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Date and Time Field */}
              <Form.Group controlId="datetime">
                <Form.Label>Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="datetime"
                  value={values.datetime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.datetime && !!errors.datetime}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.datetime}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Guests Field */}
              <Form.Group controlId="guests">
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of guests"
                  name="guests"
                  value={values.guests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.guests && !!errors.guests}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.guests}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Submit Button */}
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Book"}
              </Button>
            </Form>
          )}
        </Formik>
      </>)
      }
    </Container>
  );
};

export default BookTable;
