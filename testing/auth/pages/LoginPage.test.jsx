import { fireEvent, render, screen } from '@testing-library/react';
import { LoginPage } from '../../../src/auth/pages/LoginPage';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../../src/store/auth';
import { startGoogleSignIn } from '../../../src/store/auth/thunks';
import { MemoryRouter } from 'react-router-dom';
import { notAuthenticatedState } from '../../fixtures/authFixtures';

/* These lines are creating mock functions using the `jest.fn()` method. These mock functions are
replacing the original implementation of the `startGoogleSignIn` and `startLoginWithEmailPassword`
functions from the `../../../src/store/auth/thunks` module. This allows the test to spy on these
functions and verify that they are being called correctly when the corresponding button or form is
submitted. */
const mockStartGoogleSignIn = jest.fn();
const mockStartLoginWithEmailPassword = jest.fn();

/* This code is mocking the `startGoogleSignIn` and `startLoginWithEmailPassword` functions from the
`../../../src/store/auth/thunks` module. It replaces the original implementation of these functions
with mock functions that return `mockStartGoogleSignIn` and `mockStartLoginWithEmailPassword`,
respectively. This allows the test to spy on these functions and verify that they are being called
correctly when the corresponding button or form is submitted. */
jest.mock('../../../src/store/auth/thunks', () => ({
  startGoogleSignIn: () => mockStartGoogleSignIn,
  startLoginWithEmailPassword: ({ email, password }) => {
    return () => mockStartLoginWithEmailPassword({ email, password });
  },
}));

/* This code is mocking the `useDispatch` hook from the `react-redux` library. It replaces the original
implementation of the hook with a mock function that returns another mock function `fn()`. This
allows the test to spy on the `useDispatch` hook and verify that it is being called correctly when
the corresponding button is clicked. The `jest.requireActual('react-redux')` statement is used to
import the original implementation of the `react-redux` library, so that the mock implementation can
extend it. */
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: {
    auth: notAuthenticatedState,
  },
});

describe('Pruebas en el <LoginPage/>', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Debe de mostrar el componente correctamente ', () => {
    /* This code is rendering the `<LoginPage/>` component wrapped in a `<Provider>` component from the
   `react-redux` library and a `<MemoryRouter>` component from the `react-router-dom` library. The
   `<Provider>` component is providing the Redux store to the component tree, while the
   `<MemoryRouter>` component is providing a router context for the component tree. The `render()`
   function is a method provided by the `@testing-library/react` library that renders the component
   tree and returns an object with methods to interact with the rendered components for testing
   purposes. */
    //Test subject
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    /* `screen.debug()` is a method provided by the `@testing-library/react` library that prints the
    current state of the rendered component tree to the console. It can be useful for debugging and
    understanding the structure of the rendered components. In this case, it is being used to verify
    that the component is being rendered correctly. */
    // screen.debug();

    expect(screen.getAllByText('Login').length).toBeGreaterThanOrEqual(1);
  });

  test('Boton de Google debe de llamar el startGoogleSignIn', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const googleBtn = screen.getByLabelText('google-btn');
    fireEvent.click(googleBtn);
    expect(mockStartGoogleSignIn).toHaveBeenCalled();
  });

  test('submit debe de llamar el startLoginWithEmailPassword ', async () => {
    const email = 'wilmer@gmail.com';
    const password = '123456';

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    //Different forms to get inputs
    const emailField = screen.getByRole('textbox', {
      name: 'Correo electronico',
    });
    /* `fireEvent.change(emailField, { target: { name: 'email', value: email } });` is simulating a
    change event on the `emailField` input element. It is setting the value of the input element to
    `email` by passing it as the `value` property of the `target` object. The `name` property of the
    `target` object is set to `'email'` to indicate that the change event is related to the email
    input field. This is being done as part of testing the login form submission functionality in
    the `<LoginPage/>` component. */
    fireEvent.change(emailField, { target: { name: 'email', value: email } });

    const passwordField = screen.getByTestId('password');
    fireEvent.change(passwordField, {
      target: { name: 'password', value: password },
    });

    const loginForm = screen.getByLabelText('submit-form');
    fireEvent.submit(loginForm);

    expect(mockStartLoginWithEmailPassword).toHaveBeenCalledWith({
      email,
      password,
    });
  });
});
