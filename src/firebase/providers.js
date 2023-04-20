import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth } from './config';

/*This provider is used to authenticate users with their Google accounts. */
const googleProvier = new GoogleAuthProvider();

/**
 * The function uses Firebase Authentication to sign in a user with a Google account and returns the
 * user's authentication data or an error message.
 * @returns The function `sighInWithGoogle` returns an object with properties `ok`, `displayName`,
 * `email`, `photoURL`, and `uid` if the sign-in is successful. If there is an error, it returns an
 * object with properties `ok` and `errorMessage`.
 */
export const sighInWithGoogle = async () => {
  try {
    /* is using Firebase Authentication to sign in the user with a Google account. 
    Returns a Promise that resolves with the user's authentication data.*/
    const result = await signInWithPopup(firebaseAuth, googleProvier);
    // const credentials = GoogleAuthProvider.credentialFromResult(result);
    const { displayName, email, photoURL, uid } = result.user;

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return { ok: false, errorMessage };
  }
};

/**
 * This function registers a user with their email, password, and display name and returns their user
 * information or an error message.
 * @returns an object with properties `ok`, `uid`, `photoURL`, `email`, and `displayName` if the
 * registration is successful. If there is an error, the function returns an object with `ok` set to
 * `false` and an `errorMessage` property.
 */
export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName,
}) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    /*Is updating the current user's profile with the provided `displayName` 
    using the `updateProfile` method from Firebase Authentication. */
    await updateProfile(firebaseAuth.currentUser, { displayName });

    const { uid, photoURL } = resp.user;

    return { ok: true, uid, photoURL, email, displayName };
  } catch (error) {
    const errorMessage = error.message;
    return { ok: false, errorMessage };
  }
};

/**
 * This is a function that logs in a user with their email and password using Firebase authentication
 * and returns their user information or an error message.
 * @returns The function `loginWithEmailPassword` returns an object with either a `ok` property set to
 * `true` and the user's `uid`, `photoURL`, `email`, and `displayName` properties, or a `ok` property
 * set to `false` and an `errorMessage` property set to `'Correo o contraseña incorrectas'` (which
 * means "incorrect email or password" in Spanish
 */
export const loginWithEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const { uid, photoURL, displayName } = resp.user;

    return { ok: true, uid, photoURL, displayName };
  } catch (error) {
    return { ok: false, errorMessage: 'Correo o contraseña incorrectas' };
  }
};

export const logoutFirebase = async () => {
  return await firebaseAuth.signOut();
};
