import {
  loginWithEmailPassword,
  logoutFirebase,
  registerUserWithEmailPassword,
  sighInWithGoogle,
} from '../../firebase/providers';
import { clearNotesLogout } from '../journal';
import { checkingCredentials, login, logout } from './';

//Redux - Thunk: Allows you to return and perform different asynchronous functions at the same time

/**
 * The function `checkingAuthentication` dispatches the `checkingCredentials` action to the Redux
 * store.
 * @param email - The email address entered by the user for authentication.
 * @param password - The password parameter is a string that represents the user's password.
 * @returns The function `checkingAuthentication` is returning an asynchronous function that takes a
 * `dispatch` parameter and returns a Promise. When this function is called, it dispatches the
 * `checkingCredentials` action to the Redux store.
 */
export const checkingAuthentication = (email, password) => {
  /* Defining an asynchronous function that takes a `dispatch` parameter and returns a Promise. When
 this function is called, it dispatches the `checkingCredentials` action to the Redux store. */
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};

/**
 * This function initiates a Google sign-in process using Firebase authentication and dispatches
 * actions based on the result.
 * @returns The function `startGoogleSignIn` is returning an asynchronous function that takes a
 * `dispatch` parameter.
 */
export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    /* is calling the `signInWithGoogle()` function and waiting for it to complete before assigning the result
    The `signInWithGoogle()` function is likely a Firebase authentication method
    that allows users to sign in with their Google account. */
    const result = await sighInWithGoogle();
    if (!result.ok) return dispatch(logout(result.errorMessage));

    dispatch(login(result));
  };
};

/**
 * This function starts the process of creating a user with email and password by dispatching actions
 * to check credentials, registering the user, and logging them in if successful.
 * @returns The function `startCreatingUserWithEmailPassword` is returning an asynchronous function
 * that takes a `dispatch` argument. This function dispatches two actions: `checkingCredentials` and
 * either `logout` or `login` depending on the result of the `registerUserWithEmailPassword` function.
 * The `registerUserWithEmailPassword` function is called with an object containing `email`,
 * `password`, and `displayName`
 */
export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    const { ok, uid, photoURL, errorMessage } =
      await registerUserWithEmailPassword({
        email,
        password,
        displayName,
      });

    if (!ok) return dispatch(logout({ errorMessage }));

    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

/**
 * This is a function that logs in a user with their email and password and dispatches actions based on
 * the success or failure of the login attempt.
 * @returns A function that takes an object with email and password properties as arguments, and
 * returns an asynchronous function that dispatches actions to check the credentials, login the user
 * with the provided email and password, and logout the user if the login fails. If the login is
 * successful, it dispatches an action to login the user with the retrieved user information.
 */
export const startLoginWithEmailPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    const { ok, uid, photoURL, errorMessage, displayName } =
      await loginWithEmailPassword({ email, password });

    if (!ok) return dispatch(logout({ errorMessage }));

    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

/**
 * This function logs out a user from Firebase and dispatches a logout action.
 * @returns The function `startLogout` is returning an asynchronous function that takes a `dispatch`
 * parameter. This function calls the `logoutFirebase` function and waits for it to complete using the
 * `await` keyword. Then it dispatches the `logout` action with an empty object as its payload.
 */
export const startLogout = () => {
  return async (dispatch) => {
    await logoutFirebase();
    dispatch(clearNotesLogout());
    dispatch(logout({}));
  };
};
