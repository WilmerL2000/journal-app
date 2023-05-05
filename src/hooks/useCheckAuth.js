import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth';
import { startLoadingNotes } from '../store/journal';

export const useCheckAuth = () => {
  const { status } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  /* This code block is using the `useEffect` hook to listen for changes in the authentication state of
  the user. It is using the `onAuthStateChanged` method from Firebase to listen for changes in the
  authentication state. When the authentication state changes, the callback function is called with
  the `user` object as an argument. If there is no user, the `logout` action is dispatched. If there
  is a user, the `login` action is dispatched with the user's `uid`, `email`, `displayName`, and
  `photoURL` as arguments. The empty array `[]` as the second argument to `useEffect` ensures that
  this effect only runs once when the component mounts. */
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      // console.log(user);
      if (!user) return dispatch(logout());
      const { uid, email, displayName, photoURL } = user;
      dispatch(login({ uid, email, displayName, photoURL }));
      dispatch(startLoadingNotes());
    });
  }, []);

  return { status };
};
