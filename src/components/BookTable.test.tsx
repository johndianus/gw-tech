import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BookTable from './BookTable';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);
const store = mockStore({
  restaurant: { id: 1 },
});

describe('BookTable Component', () => {

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BookTable />
      </Provider>
    );

  test('renders the form fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date and time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /book/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date and time are required/i)).toBeInTheDocument();
      expect(screen.getByText(/at least one guest is required/i)).toBeInTheDocument();
    });
  });

  test('displays error when input datetime is out of opening hours', async () => {
    renderComponent();
    const dateTimeInput = screen.getByLabelText(/date and time/i);
    
    const invalidDateTime = '2024-12-01T08:00';
    fireEvent.change(dateTimeInput, { target: { value: invalidDateTime } });

    fireEvent.click(screen.getByRole('button', { name: /book/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/selected time must be within opening hours/i)
      ).toBeInTheDocument()
    );
  });
  
  test('submits form successfully when all fields are valid', async () => {
    renderComponent();

    userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    fireEvent.change(screen.getByLabelText(/date and time/i), {
      target: { value: '2024-12-01T13:00' },
    });
    userEvent.type(screen.getByLabelText(/guests/i), '3');

    fireEvent.click(screen.getByRole('button', { name: /book/i }));

    await waitFor(() =>
      expect(screen.getByText(/successfully booked/i)).toBeInTheDocument()
    );
  });

  test('displays error message if submission fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'An error occurred' }),
      })
    ) as jest.Mock;

    renderComponent();

    userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    fireEvent.change(screen.getByLabelText(/date and time/i), {
      target: { value: '2024-12-01T13:00' },
    });
    userEvent.type(screen.getByLabelText(/guests/i), '3');

    fireEvent.click(screen.getByRole('button', { name: /book/i }));

    await waitFor(() =>
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
    );

    global.fetch = jest.fn();
  });
});
