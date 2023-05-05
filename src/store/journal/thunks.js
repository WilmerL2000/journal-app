import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { firebaseDB } from '../../firebase/config';
import {
  addNewEmptyNote,
  deleteNoteById,
  savingNewNote,
  setActiveNote,
  setNotes,
  setPhotosToActiveNote,
  setSaving,
  updateNote,
} from './';
import { loadNotes } from '../../helpers/loadNotes';
import { fileUpload } from '../../helpers';

/**
 * The `startNewNote` function creates a new Firestore document reference for a new note, adds it to
 * the Firestore database, and dispatches actions to add the new note to the app's state and set it as
 * the active note.
 * @returns The `startNewNote` function is returning an asynchronous function that takes in `dispatch`
 * and `getState` as arguments.
 */
export const startNewNote = () => {
  return async (dispatch, getState) => {
    dispatch(savingNewNote());

    const { uid } = getState().auth;

    const newNote = {
      title: '',
      body: '',
      imageUrls: [],
      date: new Date().getTime(),
    };

    /* `const newDoc = doc(collection(firebaseDB, `/journal/notes`));` is creating a new
    Firestore document reference for a new note. It is using the `collection` function from the
    Firestore Lite library to get a reference to the `notes` collection under the `journal`
    subcollection for the user with the `uid`. Then, it is using the `doc` function to create a new
    document reference within that collection. This new document reference will be used to add the
    new note to the Firestore database. */
    const newDoc = doc(collection(firebaseDB, `${uid}/journal/notes`));
    await setDoc(newDoc, newNote);
    newNote.id = newDoc.id;

    dispatch(addNewEmptyNote(newNote));
    dispatch(setActiveNote(newNote));
  };
};

/**
 * This function loads notes for a specific user and sets them in the Redux store.
 * @returns A function that takes two arguments (dispatch and getState) and returns a promise.
 */
export const startLoadingNotes = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;

    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  };
};

/**
 * This function saves a note to Firestore and updates the note in the Redux store.
 * @returns The function `startSaveNote` is returning an asynchronous function that takes two
 * arguments: `dispatch` and `getState`.
 */
export const startSaveNote = () => {
  return async (dispatch, getState) => {
    dispatch(setSaving());
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const noteToFireStore = { ...note };
    delete noteToFireStore.id;

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
    await setDoc(docRef, noteToFireStore, { merge: true });

    dispatch(updateNote(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispatch) => {
    dispatch(setSaving());

    const fileUploadPromises = [];
    /* The `for...of` loop is iterating over each `file` in the `files` array and calling the `fileUpload`
function on each `file`. The result of each `fileUpload` call is a promise that resolves with the
URL of the uploaded file. These promises are added to the `fileUploadPromises` array using the
`push` method. This loop is used to upload multiple files asynchronously and collect their URLs in
an array. */
    for (const file of files) {
      fileUploadPromises.push(fileUpload(file));
    }

    const photosUrls = await Promise.all(fileUploadPromises);
    dispatch(setPhotosToActiveNote(photosUrls));
  };
};

/**
 * This function deletes a note from a user's journal in Firebase and updates the Redux store.
 * @returns The function `startDeletingNote` is returning an asynchronous function that takes
 * `dispatch` and `getState` as arguments.
 */
export const startDeletingNote = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
    await deleteDoc(docRef);

    dispatch(deleteNoteById(note.id));
  };
};
